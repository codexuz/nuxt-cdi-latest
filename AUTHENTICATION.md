# Authentication Middleware for Nuxt 4

This project includes two authentication middlewares to protect routes and manage user access.

## Middleware Files

### 1. `auth.ts` - Protected Routes Middleware
Protects routes that require authentication. Redirects unauthenticated users to `/login`.

**Location:** `app/middleware/auth.ts`

**Usage:**
```vue
<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>
```

### 2. `guest.ts` - Guest Only Middleware
Prevents authenticated users from accessing guest-only pages (like login/register).

**Location:** `app/middleware/guest.ts`

**Usage:**
```vue
<script setup>
definePageMeta({
  middleware: 'guest'
})
</script>
```

## How to Use

### Protect a Page (Require Authentication)
```vue
<!-- pages/protected-page.vue -->
<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <div>
    <h1>This page requires authentication</h1>
  </div>
</template>
```

### Guest Only Page (Login/Register)
```vue
<!-- pages/login.vue -->
<script setup>
definePageMeta({
  middleware: 'guest'
})
</script>

<template>
  <div>
    <h1>Login Page</h1>
  </div>
</template>
```

### Multiple Middlewares
```vue
<script setup>
definePageMeta({
  middleware: ['auth', 'some-other-middleware']
})
</script>
```

### Global Middleware
To apply middleware to all routes, rename the file with `.global.ts` suffix:
- `auth.global.ts` - applies to all routes
- `guest.global.ts` - applies to all routes

## Authentication Flow

1. **Login Process:**
   - User visits `/login` (protected by `guest` middleware)
   - Upon successful login, JWT token is stored in cookie
   - User is redirected to home page

2. **Protected Route Access:**
   - User tries to access protected route
   - `auth` middleware checks for valid token
   - If token exists, access is granted
   - If no token, user is redirected to `/login`

3. **Logout Process:**
   - Call `logout()` function from `useAuth` composable
   - Token is cleared from cookie
   - User store is cleared
   - User is redirected to `/login`

## Available Auth Functions

From `composables/useAuth.ts`:

```javascript
// Login user with OTP
await loginUser(otp_code)

// Logout user
await logout()

// Get user profile
await getProfile()
```

## Pages Currently Protected

- `/exams` - Requires authentication
- `/listening/[id]` - Requires authentication  
- `/reading/[id]` - Requires authentication
- `/login` - Guest only (redirects if authenticated)

## Token Storage

The authentication token is stored in:
- HTTP-only cookie: `access_token`
- User data in Pinia store: `user`
- Local storage: User ID for persistence

## Security Features

- JWT token validation
- Automatic redirection for unauthorized access
- Cookie-based session management
- Server-side rendering (SSR) compatible
- Guest route protection to prevent double login