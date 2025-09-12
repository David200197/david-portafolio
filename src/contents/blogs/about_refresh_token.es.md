---
title: 'Refresh Token: qué es, cómo funciona y por qué es clave en la autenticación segura'
createAt: '2025-09-10'
updateAt: '2025-09-10'
author: 'David Alfonso Pereira'
authorPhoto: 'https://avatars.githubusercontent.com/u/80176604?s=96&v=4'
authorPhotoAlt: 'David Alfonso'
tags:
  [
    'programación',
    'desarrollo web',
    'refresh token',
    'access token',
    'segurity',
  ]
description: 'En este artículo exploramos qué es un refresh token, cómo funciona y por qué es fundamental para mantener sesiones seguras y continuas en aplicaciones modernas.'
image: '/david-portafolio/blogs/segurity.png'
---

# Refresh Token: qué es, cómo funciona y por qué es clave en la autenticación segura

<img src="/david-portafolio/blogs/segurity.png" alt="JavaScript Logo" class="img-blog" />

La autenticación es el corazón de cualquier aplicación moderna. Y en este ecosistema, **los tokens juegan un papel vital para garantizar sesiones seguras, fluidas y confiables**. Hoy quiero hablarte del **refresh token**, un concepto que quizás ya hayas escuchado, pero cuya correcta implementación puede marcar la diferencia entre una app robusta y una vulnerable.

---

## ¿Qué es un Refresh Token?

Un **refresh token** es una credencial de seguridad que permite obtener nuevos **access tokens** sin necesidad de que el usuario vuelva a iniciar sesión. Este access token es una credencial temporal que permite a un usuario o aplicación acceder a recursos protegidos de un sistema o API sin tener que enviar su contraseña. Cuando el **access token expira**, el cliente utiliza el refresh token para pedir uno nuevo al servidor. Así, la sesión se mantiene activa sin molestar al usuario y con un alto nivel de seguridad.

---

## ¿Cómo funciona?

El flujo es simple, pero poderoso:

1. El usuario inicia sesión.
2. El servidor entrega **dos tokens**: access (de vida corta) y refresh (de vida larga).
3. El access token se usa para consumir recursos protegidos.
4. Cuando caduca, la app envía el refresh token.
5. Si es válido, el servidor genera un **nuevo access token** (y a veces también un nuevo refresh token).

---

## Ejemplo de flujo de autenticación

### 1. Autenticación inicial

```http
POST /auth/login
{
  "username": "usuario123",
  "password": "contraseñaSegura"
}
```

#### _Respuesta del servidor_

```json
{
  "access_token": "...",
  "refresh_token": "...",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

### 2. Uso del Access Token

```http
GET /api/recursos-protegidos
Authorization: Bearer eyJhbGciOiJIUzI1...
```

### 3. Token expirado

```json
{
  "error": "invalid_token",
  "error_description": "Token has expired"
}
```

Normalmente acompañado de un 401 Unauthorized.

### 4. Renovación con Refresh Token

```http
POST /auth/refresh
{
  "refresh_token": "eyJhbGciOiJIUzI1..."
}
```

#### _Respuesta del servidor_

```json
{
  "access_token": "...nuevo",
  "refresh_token": "...nuevo",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

### 5. Refresh Token expirado

```json
{
  "error": "invalid_token",
  "error_description": "Refresh token has expired"
}
```

En este caso, el usuario debe volver a autenticarse.

## Durabilidad de los tokens

Access token debe caducar rápido (minutos u horas).
Refresh token puede durar más tiempo (días o semanas), pero con controles de seguridad adicionales.

## Persistencia de los tokens en el front

Muchos tutoriales recomiendan guardarlos en localStorage o sessionStorage, pero esto es una mala práctica:
Son vulnerables a extensiones maliciosas y ataques XSS. Una mejor solución:

- Guardar el refresh token en una cookie HttpOnly + Secure.

- Mantener el access token en memoria (variable global o estado).

- De esta forma, el refresh token entrega un nuevo access token sin necesidad de persistirlo.

### Ventajas de usar cookies seguras

#### Seguridad:

- HttpOnly: inaccesibles desde JavaScript (previene XSS).

- Secure: solo por HTTPS (previene sniffing).

- SameSite: reduce ataques CSRF.

#### Simplicidad:

El navegador las envía automáticamente en cada request.

### Consideraciones

Desactivar Secure en entornos locales sin HTTPS.

### Ejemplo práctico: Backend y Frontend

#### Backend (Node.js + Express)

```js
import express from 'express'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

// Middleware para verificar access token
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

// Login: genera tokens
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

#### Frontend (fetch API)

```js
let accessToken = null

async function login() {
  const res = await fetch('http://localhost:4000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'juan' }),
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
  console.log('Respuesta protegida:', data)
}
```

## Persistencia del Refresh Token en el backend

Depende del negocio, pero guardarlo en DB ofrece ventajas claras:

- Revocar sesiones en logout o por decisión administrativa.

- Controlar sesiones en múltiples dispositivos.

- Inhabilitar tokens comprometidos.

- Implementar rotación de refresh tokens (recomendado en sistemas modernos).

La alternativa sin DB (JWT auto-contenido) reduce complejidad, pero pierdes la posibilidad de revocar tokens de forma granular.

## Conclusión

El uso correcto de access tokens y refresh tokens es esencial para lograr aplicaciones seguras y con buena experiencia de usuario. Con estas prácticas, tu sistema de autenticación será mucho más sólido y tus usuarios estarán mejor protegidos.

Espero que te sea interesante este post, nos vemos en la proximo publicación
