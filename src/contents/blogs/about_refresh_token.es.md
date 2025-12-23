---
title: 'Refresh Tokens: la pieza que faltaba en tu sistema de autenticación'
createAt: '2025-09-10'
updateAt: '2025-09-10'
author: 'David Alfonso Pereira'
authorPhoto: '/david-portafolio/profile.webp'
authorPhotoAlt: 'David Alfonso'
tags:
  [
    'programación',
    'desarrollo web',
    'refresh token',
    'access token',
    'seguridad',
  ]
description: 'En este artículo exploramos qué es un refresh token, cómo funciona y por qué es fundamental para mantener sesiones seguras y continuas en aplicaciones modernas.'
image: '/david-portafolio/blogs/segurity.webp'
---

# Refresh Tokens: la pieza que faltaba en tu sistema de autenticación

<img src="/david-portafolio/blogs/segurity.webp" alt="Seguridad en autenticación" class="img-blog" />

¿Alguna vez te has preguntado cómo hacen apps como Gmail o Spotify para mantenerte logueado durante semanas sin pedirte la contraseña cada rato? La respuesta está en los **refresh tokens**.

Cuando empecé a implementar autenticación en mis proyectos, cometí el error clásico: tokens de acceso con expiración de 24 horas. "Así el usuario no tiene que loguearse tan seguido", pensé. Terrible idea. Si alguien roba ese token, tiene acceso durante un día entero.

La solución correcta es usar **dos tipos de tokens**, cada uno con un propósito específico. Y eso es exactamente lo que vamos a ver.

---

## ¿Qué es un Refresh Token?

Vamos directo al grano. En un sistema de autenticación moderno tienes dos tokens:

- **Access token**: de vida corta (minutos u horas), lo usas para acceder a recursos protegidos.
- **Refresh token**: de vida larga (días o semanas), lo usas _únicamente_ para obtener nuevos access tokens.

El refresh token es como una llave maestra que te permite renovar tu acceso sin volver a meter usuario y contraseña. El usuario no se entera de nada, la experiencia es fluida, y la seguridad se mantiene porque el access token expira rápido.

---

## El flujo completo

Así funciona en la práctica:

1. El usuario hace login con sus credenciales.
2. El servidor devuelve un **access token** (corta duración) y un **refresh token** (larga duración).
3. El frontend usa el access token para cada petición a la API.
4. Cuando el access token expira (401 Unauthorized), el frontend envía el refresh token.
5. Si el refresh token es válido, el servidor genera un nuevo access token.
6. Si el refresh token también expiró, toca volver a hacer login.

Simple, pero hay varios detalles donde la gente se equivoca. Vamos a verlos.

---

## Ejemplo paso a paso

### 1. Login inicial

```http
POST /auth/login
Content-Type: application/json

{
  "username": "usuario123",
  "password": "contraseñaSegura"
}
```

El servidor responde con ambos tokens:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_in": 900,
  "token_type": "Bearer"
}
```

### 2. Usando el access token

```http
GET /api/perfil
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Todo bien mientras el token sea válido.

### 3. El token expira

```http
HTTP/1.1 401 Unauthorized

{
  "error": "invalid_token",
  "error_description": "Token has expired"
}
```

Aquí es donde entra el refresh token.

### 4. Renovación silenciosa

```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

El servidor valida el refresh token y devuelve uno nuevo:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...nuevo",
  "expires_in": 900,
  "token_type": "Bearer"
}
```

El usuario ni se enteró. La app sigue funcionando.

---

## El error más común: dónde guardar los tokens

Aquí es donde muchos tutoriales te llevan por mal camino. Te dicen que guardes los tokens en `localStorage` o `sessionStorage`. **No lo hagas.**

¿Por qué? Porque cualquier script JavaScript puede leerlos. Un ataque XSS, una extensión maliciosa del navegador, y adiós tokens.

### La forma correcta

- **Refresh token**: en una cookie `HttpOnly` + `Secure` + `SameSite=Strict`
- **Access token**: en memoria (una variable JavaScript, estado de React/Vue, etc.)

Con esta estrategia:

- El refresh token es invisible para JavaScript (previene XSS)
- Solo viaja por HTTPS (previene sniffing)
- El navegador lo envía automáticamente
- Si alguien roba el access token de memoria, expira en minutos

---

## Implementación práctica

Vamos a ver código real. Un backend en Node.js con Express y un frontend vanilla.

### Backend (Node.js + Express)

```js
import express from 'express'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

const app = express()
app.use(express.json())
app.use(cookieParser())

// En producción, usa variables de entorno
const ACCESS_TOKEN_SECRET = 'tu_secreto_access'
const REFRESH_TOKEN_SECRET = 'tu_secreto_refresh'
const ACCESS_TOKEN_EXPIRY = '15m' // 15 minutos
const REFRESH_TOKEN_EXPIRY = '7d' // 7 días

// En producción, usa Redis o una base de datos
let refreshTokensStore = []

// Middleware de autenticación
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' })
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido o expirado' })
    }
    req.user = user
    next()
  })
}

// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body

  // Aquí validarías contra tu base de datos
  if (!username || !password) {
    return res.status(400).json({ error: 'Credenciales requeridas' })
  }

  const accessToken = jwt.sign({ username }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  })

  const refreshToken = jwt.sign({ username }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  })

  // Guardar refresh token (en producción: base de datos)
  refreshTokensStore.push(refreshToken)

  // El refresh token va en cookie HttpOnly
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
  })

  // El access token va en el body
  res.json({ accessToken })
})

// Refresh
app.post('/refresh', (req, res) => {
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token requerido' })
  }

  if (!refreshTokensStore.includes(refreshToken)) {
    return res.status(403).json({ error: 'Refresh token inválido' })
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
    return res.status(403).json({ error: 'Refresh token expirado' })
  }
})

// Logout
app.post('/logout', (req, res) => {
  const refreshToken = req.cookies.refreshToken

  // Eliminar de la lista de tokens válidos
  refreshTokensStore = refreshTokensStore.filter((t) => t !== refreshToken)

  res.clearCookie('refreshToken')
  res.json({ message: 'Sesión cerrada' })
})

// Ruta protegida de ejemplo
app.get('/perfil', authenticateToken, (req, res) => {
  res.json({
    message: `Hola ${req.user.username}`,
    datos: 'Información sensible aquí',
  })
})

app.listen(4000, () => {
  console.log('Server en http://localhost:4000')
})
```

### Frontend (JavaScript vanilla)

```js
// El access token vive en memoria, no en storage
let accessToken = null

async function login(username, password) {
  const res = await fetch('http://localhost:4000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    credentials: 'include', // Importante para las cookies
  })

  if (!res.ok) throw new Error('Login fallido')

  const data = await res.json()
  accessToken = data.accessToken
}

async function refreshAccessToken() {
  const res = await fetch('http://localhost:4000/refresh', {
    method: 'POST',
    credentials: 'include',
  })

  if (!res.ok) {
    // Refresh token expirado, hay que volver a loguear
    accessToken = null
    throw new Error('Sesión expirada')
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

// Wrapper para peticiones autenticadas con retry automático
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

  // Si el access token expiró, renovamos y reintentamos
  if (res.status === 401) {
    try {
      await refreshAccessToken()
      res = await makeRequest()
    } catch (e) {
      // Redirigir al login
      window.location.href = '/login'
      throw e
    }
  }

  return res
}

// Uso
async function cargarPerfil() {
  const res = await fetchWithAuth('http://localhost:4000/perfil')
  const data = await res.json()
  console.log(data)
}
```

El `fetchWithAuth` es clave: intercepta los 401, renueva el token automáticamente, y reintenta la petición. El usuario no nota nada.

---

## ¿Guardar refresh tokens en base de datos?

Depende de tu caso, pero generalmente sí. Las ventajas son claras:

- **Revocar sesiones**: logout real, no solo borrar la cookie del cliente
- **Cerrar todas las sesiones**: "cerrar sesión en todos los dispositivos"
- **Invalidar tokens comprometidos**: si detectas actividad sospechosa
- **Rotación de tokens**: cada refresh genera un nuevo refresh token e invalida el anterior

Sin base de datos (JWT puro) es más simple, pero pierdes la capacidad de revocar tokens antes de que expiren.

---

## Tiempos de expiración recomendados

No hay una regla universal, pero estos valores funcionan bien para la mayoría de aplicaciones:

| Token         | Duración      | Razón                                 |
| ------------- | ------------- | ------------------------------------- |
| Access token  | 15-30 minutos | Limita ventana de ataque si es robado |
| Refresh token | 7-30 días     | Balance entre UX y seguridad          |

Para apps bancarias o de salud, reduce estos tiempos. Para una app social, puedes ser más permisivo.

---

## Resumen

Los puntos clave para implementar refresh tokens correctamente:

1. **Access token corto, refresh token largo**: el primero para usar, el segundo para renovar
2. **Nunca guardes tokens en localStorage**: usa cookies HttpOnly para el refresh y memoria para el access
3. **Implementa renovación automática**: el usuario no debería saber que existen los tokens
4. **Considera guardar refresh tokens en DB**: te da control total sobre las sesiones
5. **Usa HTTPS siempre**: los tokens viajan en cada request

Con estos conceptos claros, tu sistema de autenticación será mucho más robusto. Y tus usuarios tendrán una experiencia fluida sin sacrificar seguridad.
