---
title: 'Refresh Token: what it is, how it works, and why it is key to secure authentication'
createAt: '2025-09-10'
updateAt: '2025-09-10'
author: 'David Alfonso Pereira'
authorPhoto: 'https://avatars.githubusercontent.com/u/80176604?s=96&v=4'
authorPhotoAlt: 'David Alfonso'
tags:
  [
    'programming',
    'web development',
    'refresh token',
    'access token',
    'security',
  ]
description: 'In this article, we explore what a refresh token is, how it works, and why it is fundamental for maintaining secure and continuous sessions in modern applications.'
image: '/david-portafolio/blogs/segurity.png'
---

# Refresh Token: what it is, how it works, and why it is key to secure authentication

<img src="/david-portafolio/blogs/segurity.png" alt="JavaScript Logo" class="img-blog" />

Authentication is the heart of any modern application. And in this ecosystem, **tokens play a vital role in ensuring secure, smooth, and reliable sessions**. Today I want to talk to you about the **refresh token**, a concept you may have already heard of, but whose correct implementation can make the difference between a robust app and a vulnerable one.

---

## What is a Refresh Token?

A **refresh token** is a security credential that allows obtaining new **access tokens** without requiring the user to log in again. This access token is a temporary credential that enables a user or application to access protected resources of a system or API without having to send their password. When the **access token expires**, the client uses the refresh token to request a new one from the server. This way, the session remains active without bothering the user and with a high level of security.

---

## How does it work?

The flow is simple but powerful:

1. The user logs in.
2. The server issues **two tokens**: access (short-lived) and refresh (long-lived).
3. The access token is used to consume protected resources.
4. When it expires, the app sends the refresh token.
5. If valid, the server generates a **new access token** (and sometimes also a new refresh token).

---

## Example of an authentication flow

### 1. Initial authentication

```http
POST /auth/login
{
  "username": "user123",
  "password": "SecurePassword"
}
```

#### _Server response_

```json
{
  "access_token": "...",
  "refresh_token": "...",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

### 2. Using the Access Token

```http
GET /api/protected-resources
Authorization: Bearer eyJhbGciOiJIUzI1...
```

### 3. Expired Token

```json
{
  "error": "invalid_token",
  "error_description": "Token has expired"
}
```

Usually accompanied by a `401 Unauthorized`.

### 4. Renewal with Refresh Token

```http
POST /auth/refresh
{
  "refresh_token": "eyJhbGciOiJIUzI1..."
}
```

#### _Server response_

```json
{
  "access_token": "...new",
  "refresh_token": "...new",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

### 5. Expired Refresh Token

```json
{
  "error": "invalid_token",
  "error_description": "Refresh token has expired"
}
```

In this case, the user must authenticate again.

---

## Token durability

- **Access token** should expire quickly (minutes or hours).
- **Refresh token** can last longer (days or weeks) but requires additional security controls.

---

## Token persistence on the frontend

Many tutorials recommend storing them in `localStorage` or `sessionStorage`, but this is bad practice:

- They are vulnerable to malicious extensions and XSS attacks.

### A better solution:

- Store the refresh token in an `HttpOnly + Secure` cookie.
- Keep the access token in memory (global variable or state).

This way, the refresh token issues a new access token without needing persistence.

---

## Advantages of using secure cookies

### Security:

- **HttpOnly**: inaccessible from JavaScript (prevents XSS).
- **Secure**: only over HTTPS (prevents sniffing).
- **SameSite**: reduces CSRF attacks.

### Simplicity:

- The browser sends them automatically with each request.

### Considerations:

- Disable `Secure` in local environments without HTTPS.

---

## Practical example: Backend and Frontend

### Backend (Node.js + Express)

```javascript
import express from 'express'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

// Middleware to verify access token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token provided' })

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(401).json({ error: 'Token expired or invalid' })
    req.user = user
    next()
  })
}

const app = express()
app.use(express.json())
app.use(cookieParser())

const ACCESS_TOKEN_SECRET = 'super_secret_access'
const REFRESH_TOKEN_SECRET = 'super_secret_refresh'
const ACCESS_TOKEN_EXPIRY = '30s'
const REFRESH_TOKEN_EXPIRY = '1d'
let refreshTokensStore = []

// Login: generate tokens
app.post('/login', (req, res) => {
  const { username } = req.body
  if (!username) return res.status(400).json({ error: 'Username required' })

  const accessToken = jwt.sign({ username }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  })
  const refreshToken = jwt.sign({ username }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  })

  refreshTokensStore.push(refreshToken)

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  })
  res.json({ accessToken })
})

app.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
      return res.status(401).json({ error: 'No refresh token' })
    }
    if (!refreshTokensStore.includes(refreshToken)) {
      return res.status(403).json({ error: 'Invalid refresh token' })
    }

    const user = await jwt.verify(refreshToken, REFRESH_TOKEN_SECRET)

    const newAccessToken = await jwt.sign(
      { username: user.username },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    )

    res.json({ accessToken: newAccessToken })
  } catch (err) {
    return res.status(403).json({ error: 'Token not valid' })
  }
})

app.post('/logout', (req, res) => {
  const refreshToken = req.cookies.refreshToken
  refreshTokensStore = refreshTokensStore.filter((t) => t !== refreshToken)
  res.clearCookie('refreshToken')
  res.json({ message: 'Logged out' })
})

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, this is protected data.` })
})

app.listen(4000, () => console.log('Server running on http://localhost:4000'))
```

### Frontend (fetch API)

```javascript
let accessToken = null

async function login() {
  const res = await fetch('http://localhost:4000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'john' }),
    credentials: 'include',
  })
  const data = await res.json()
  accessToken = data.accessToken
}

async function refresh() {
  const res = await fetch('http://localhost:4000/refresh', {
    method: 'POST',
    credentials: 'include',
  })
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

async function fetchProtected() {
  let res = await fetch('http://localhost:4000/protected', {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: 'include',
  })

  if (res.status === 401) {
    await refresh()
    res = await fetch('http://localhost:4000/protected', {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: 'include',
    })
  }

  const data = await res.json()
  console.log('Protected response:', data)
}
```

---

## Refresh Token persistence on the backend

It depends on the business, but storing it in a DB offers clear advantages:

- Revoke sessions on logout or by admin decision.
- Manage sessions across multiple devices.
- Invalidate compromised tokens.
- Implement refresh token rotation (recommended in modern systems).

The alternative without DB (self-contained JWT) reduces complexity, but you lose the ability to revoke tokens granularly.

---

## Conclusion

The correct use of access tokens and refresh tokens is essential for building secure applications with a good user experience. With these practices, your authentication system will be much more solid, and your users will be better protected.

Hope you found this post interesting. See you in the next publication!
