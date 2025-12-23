---
title: 'Refresh Tokens: the missing piece in your authentication system'
createAt: '2025-09-10'
updateAt: '2025-09-10'
author: 'David Alfonso Pereira'
authorPhoto: '/david-portafolio/profile.webp'
authorPhotoAlt: 'David Alfonso'
tags:
  [
    'programming',
    'web development',
    'refresh token',
    'access token',
    'security',
  ]
description: 'In this article we explore what a refresh token is, how it works, and why it is essential for maintaining secure and seamless sessions in modern applications.'
image: '/david-portafolio/blogs/segurity.webp'
---

# Refresh Tokens: the missing piece in your authentication system

<img src="/david-portafolio/blogs/segurity.webp" alt="Authentication Security" class="img-blog" />

Have you ever wondered how apps like Gmail or Spotify keep you logged in for weeks without asking for your password every few hours? The answer lies in **refresh tokens**.

When I first started implementing authentication in my projects, I made the classic mistake: access tokens with 24-hour expiration. "That way users won't have to log in so often," I thought. Terrible idea. If someone steals that token, they have access for an entire day.

The correct solution is to use **two types of tokens**, each with a specific purpose. And that's exactly what we're going to cover.

---

## What is a Refresh Token?

Let's get straight to the point. In a modern authentication system you have two tokens:

- **Access token**: short-lived (minutes or hours), used to access protected resources.
- **Refresh token**: long-lived (days or weeks), used _only_ to obtain new access tokens.

The refresh token is like a master key that lets you renew your access without entering username and password again. The user doesn't notice anything, the experience is smooth, and security is maintained because the access token expires quickly.

---

## The complete flow

Here's how it works in practice:

1. The user logs in with their credentials.
2. The server returns an **access token** (short duration) and a **refresh token** (long duration).
3. The frontend uses the access token for every API request.
4. When the access token expires (401 Unauthorized), the frontend sends the refresh token.
5. If the refresh token is valid, the server generates a new access token.
6. If the refresh token has also expired, the user needs to log in again.

Simple, but there are several details where people get it wrong. Let's look at them.

---

## Step by step example

### 1. Initial login

```http
POST /auth/login
Content-Type: application/json

{
  "username": "user123",
  "password": "securePassword"
}
```

The server responds with both tokens:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_in": 900,
  "token_type": "Bearer"
}
```

### 2. Using the access token

```http
GET /api/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Everything works fine while the token is valid.

### 3. The token expires

```http
HTTP/1.1 401 Unauthorized

{
  "error": "invalid_token",
  "error_description": "Token has expired"
}
```

This is where the refresh token comes in.

### 4. Silent renewal

```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

The server validates the refresh token and returns a new one:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...new",
  "expires_in": 900,
  "token_type": "Bearer"
}
```

The user didn't notice anything. The app keeps working.

---

## The most common mistake: where to store tokens

This is where many tutorials lead you astray. They tell you to store tokens in `localStorage` or `sessionStorage`. **Don't do it.**

Why? Because any JavaScript script can read them. An XSS attack, a malicious browser extension, and your tokens are gone.

### The right way

- **Refresh token**: in an `HttpOnly` + `Secure` + `SameSite=Strict` cookie
- **Access token**: in memory (a JavaScript variable, React/Vue state, etc.)

With this strategy:

- The refresh token is invisible to JavaScript (prevents XSS)
- It only travels over HTTPS (prevents sniffing)
- The browser sends it automatically
- If someone steals the access token from memory, it expires in minutes

---

## Practical implementation

Let's look at real code. A Node.js backend with Express and a vanilla frontend.

### Backend (Node.js + Express)

```js
import express from 'express'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

const app = express()
app.use(express.json())
app.use(cookieParser())

// In production, use environment variables
const ACCESS_TOKEN_SECRET = 'your_access_secret'
const REFRESH_TOKEN_SECRET = 'your_refresh_secret'
const ACCESS_TOKEN_EXPIRY = '15m' // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d' // 7 days

// In production, use Redis or a database
let refreshTokensStore = []

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Token required' })
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }
    req.user = user
    next()
  })
}

// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body

  // Here you would validate against your database
  if (!username || !password) {
    return res.status(400).json({ error: 'Credentials required' })
  }

  const accessToken = jwt.sign({ username }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  })

  const refreshToken = jwt.sign({ username }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  })

  // Store refresh token (in production: database)
  refreshTokensStore.push(refreshToken)

  // Refresh token goes in HttpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })

  // Access token goes in the body
  res.json({ accessToken })
})

// Refresh
app.post('/refresh', (req, res) => {
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' })
  }

  if (!refreshTokensStore.includes(refreshToken)) {
    return res.status(403).json({ error: 'Invalid refresh token' })
  }

  try {
    const user = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET)

    const newAccessToken = jwt.sign(
      { username: user.username },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    )

    res.json({ accessToken: newAccessToken })
  } catch (err) {
    return res.status(403).json({ error: 'Refresh token expired' })
  }
})

// Logout
app.post('/logout', (req, res) => {
  const refreshToken = req.cookies.refreshToken

  // Remove from valid tokens list
  refreshTokensStore = refreshTokensStore.filter((t) => t !== refreshToken)

  res.clearCookie('refreshToken')
  res.json({ message: 'Logged out' })
})

// Example protected route
app.get('/profile', authenticateToken, (req, res) => {
  res.json({
    message: `Hello ${req.user.username}`,
    data: 'Sensitive information here',
  })
})

app.listen(4000, () => {
  console.log('Server at http://localhost:4000')
})
```

### Frontend (vanilla JavaScript)

```js
// The access token lives in memory, not in storage
let accessToken = null

async function login(username, password) {
  const res = await fetch('http://localhost:4000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    credentials: 'include', // Important for cookies
  })

  if (!res.ok) throw new Error('Login failed')

  const data = await res.json()
  accessToken = data.accessToken
}

async function refreshAccessToken() {
  const res = await fetch('http://localhost:4000/refresh', {
    method: 'POST',
    credentials: 'include',
  })

  if (!res.ok) {
    // Refresh token expired, need to log in again
    accessToken = null
    throw new Error('Session expired')
  }

  const data = await res.json()
  accessToken = data.accessToken
}

async function logout() {
  await fetch('http://localhost:4000/logout', {
    method: 'POST',
    credentials: 'include',
  })
  accessToken = null
}

// Wrapper for authenticated requests with automatic retry
async function fetchWithAuth(url, options = {}) {
  const makeRequest = () =>
    fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    })

  let res = await makeRequest()

  // If access token expired, refresh and retry
  if (res.status === 401) {
    try {
      await refreshAccessToken()
      res = await makeRequest()
    } catch (e) {
      // Redirect to login
      window.location.href = '/login'
      throw e
    }
  }

  return res
}

// Usage
async function loadProfile() {
  const res = await fetchWithAuth('http://localhost:4000/profile')
  const data = await res.json()
  console.log(data)
}
```

The `fetchWithAuth` function is key: it intercepts 401 responses, renews the token automatically, and retries the request. The user notices nothing.

---

## Should you store refresh tokens in a database?

It depends on your use case, but generally yes. The advantages are clear:

- **Revoke sessions**: real logout, not just deleting the client cookie
- **Close all sessions**: "log out from all devices"
- **Invalidate compromised tokens**: if you detect suspicious activity
- **Token rotation**: each refresh generates a new refresh token and invalidates the previous one

Without a database (pure JWT) it's simpler, but you lose the ability to revoke tokens before they expire.

---

## Recommended expiration times

There's no universal rule, but these values work well for most applications:

| Token         | Duration      | Reason                          |
| ------------- | ------------- | ------------------------------- |
| Access token  | 15-30 minutes | Limits attack window if stolen  |
| Refresh token | 7-30 days     | Balance between UX and security |

For banking or healthcare apps, reduce these times. For a social app, you can be more permissive.

---

## Summary

The key points for implementing refresh tokens correctly:

1. **Short access token, long refresh token**: the first for using, the second for renewing
2. **Never store tokens in localStorage**: use HttpOnly cookies for refresh and memory for access
3. **Implement automatic renewal**: users shouldn't know tokens exist
4. **Consider storing refresh tokens in DB**: gives you full control over sessions
5. **Always use HTTPS**: tokens travel with every request

With these concepts clear, your authentication system will be much more robust. And your users will have a smooth experience without sacrificing security.
