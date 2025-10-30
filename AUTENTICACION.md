# Sistema de Autenticación y Control de Tokens

## 📋 Resumen

El sistema de autenticación está configurado para controlar automáticamente el vencimiento de tokens y redirigir al login cuando sea necesario.

## 🔒 Componentes de Seguridad

### 1. **Auth Guard** (`auth.guard.ts`)

**Responsabilidad:** Proteger rutas que requieren autenticación

**Verificaciones:**
- ✅ Usuario está logueado (`isLogged()`)
- ✅ Token existe en localStorage
- ✅ Redirige a `/auth/login` si falta autenticación

**Uso:**
```typescript
// En app.routes.ts
{
  path: '',
  component: AppLayout,
  canActivate: [authGuard],  // ← Protege toda el área privada
  children: [...]
}
```

### 2. **OAuth2 Interceptor** (`oauth2.interceptor.ts`)

**Responsabilidad:** Interceptar todas las peticiones HTTP para:

**Funcionalidades:**
1. **Agregar Token Automático**
   - Agrega `Authorization: Bearer {token}` a todas las peticiones (excepto públicas)
   - Rutas públicas: `/auth/login`, `/public/signup`, `/api/health`

2. **Manejo de Errores 401 (Token Inválido/Expirado)**
   ```
   401 Detectado → Limpiar sesión → Redirigir a Login
   ```

3. **Manejo de Errores 404 (Subscription)**
   - No muestra error crítico si `/api/subscription` retorna 404
   - Útil cuando el endpoint aún no está implementado

**Flujo:**
```
Request → Interceptor agrega token → Backend responde
                                    ↓
                              401 UNAUTHORIZED
                                    ↓
                        Interceptor limpia sesión
                                    ↓
                        Router redirige a /auth/login
```

### 3. **Auth Service** (`auth.service.ts`)

**Métodos Principales:**

```typescript
// Verificar si está logueado
isLogged(): boolean

// Obtener token
getAuthToken(): string | null

// Guardar datos de autenticación
saveAuthData(response: LoginSuccessResponse): void

// Cerrar sesión (limpia localStorage)
logout(): void

// Obtener usuario actual
getCurrentUser(): UserData | null

// Obtener org_id
getOrgId(): number | null
```

## 🔄 Flujo de Autenticación

### Login Exitoso
```
1. Usuario ingresa credenciales
2. LoginComponent llama authService.loginWithUserCredentials()
3. Backend responde con token
4. authService.saveAuthData() guarda:
   - token
   - user data
   - org_id
   - session
5. Router navega a /dashboard
```

### Sesión Expirada
```
1. Usuario hace request a API
2. OAuth2Interceptor agrega token
3. Backend responde 401 UNAUTHORIZED
4. Interceptor detecta 401
5. authService.logout() limpia localStorage
6. Router.navigate(['/auth/login'])
7. Usuario ve pantalla de login
```

### Protección de Rutas
```
1. Usuario intenta acceder a /dashboard
2. authGuard.canActivate() verifica:
   - ¿isLogged() = true?
   - ¿token existe?
3. Si falla → redirect a /auth/login?returnUrl=/dashboard
4. Si pasa → permite acceso
```

## 📦 Datos en localStorage

```javascript
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Usuario",
    "email": "user@example.com",
    "role": "admin"
  },
  "org_id": "123",
  "session": { ... }
}
```

## ⚠️ Manejo de Errores

### Error 401 (Token Expirado)
- **Acción:** Logout automático + redirect a login
- **Mensaje:** "Sesión expirada. Por favor, inicia sesión nuevamente."
- **No se muestran toasts** (evita spam de errores)

### Error 404 (Subscription Endpoint)
- **Acción:** Mostrar plan "Free" por defecto
- **No muestra error al usuario**
- **Console warning** para debug

### Otros Errores (500, 503, etc.)
- **Acción:** Propagar error al componente
- **Componente decide** si mostrar toast/mensaje

## 🛡️ Buenas Prácticas Implementadas

1. **Doble Protección**
   - `canActivate` en rutas principales
   - `canMatch` en lazy loading modules

2. **Limpieza Automática**
   - Logout limpia TODA la localStorage
   - Previene datos corruptos/obsoletos

3. **Logging para Debug**
   - Console logs con emojis para identificar eventos
   - `🔒` = Guard bloqueó acceso
   - `✅` = Acceso permitido

4. **ReturnUrl**
   - Guarda la URL original cuando redirige al login
   - Después del login, vuelve a la página deseada

## 🔧 Configuración

El interceptor está registrado en `app.config.ts`:

```typescript
providers: [
  { provide: HTTP_INTERCEPTORS, useClass: Oauth2Interceptor, multi: true }
]
```

## 📝 Notas Importantes

### Frontend vs Backend

**Frontend es responsable de:**
- ✅ Detectar token expirado (401)
- ✅ Redirigir al login
- ✅ Limpiar sesión local
- ✅ Proteger rutas con guards
- ✅ Agregar token a requests

**Backend es responsable de:**
- ✅ Validar token en cada request
- ✅ Retornar 401 si token es inválido/expirado
- ✅ Generar tokens con expiración
- ✅ Implementar refresh tokens (opcional)

### ¿Por qué no usar refresh tokens?

El sistema actual NO implementa refresh tokens porque:
1. La API actual no tiene endpoint `/auth/refresh`
2. Simplicidad: logout y re-login es más seguro
3. Tokens de larga duración pueden configurarse en el backend

Si en el futuro se implementa refresh token:
- El método `tryAgainWithRefresToken()` ya está preparado en el interceptor
- Solo falta implementar el endpoint en el backend

## 🚀 Testing

Para probar el sistema de expiración:

1. **Login normal** → Debería funcionar
2. **Borrar token** de localStorage manualmente
3. **Hacer request** → Debería redirigir a login
4. **Usar token expirado** → Backend retorna 401 → Logout automático

## 📊 Diagrama de Flujo

```
┌─────────────────┐
│  Usuario accede │
│   a /dashboard  │
└────────┬────────┘
         │
         ▼
┌────────────────────┐
│   authGuard verifica│
│   token existe?     │
└────────┬───────────┘
         │
    ┌────┴────┐
    │   SÍ    │   NO
    ▼         ▼
┌────────┐  ┌──────────────┐
│ Permite│  │ Redirect a   │
│ acceso │  │ /auth/login  │
└───┬────┘  └──────────────┘
    │
    ▼
┌────────────────────┐
│ Componente carga   │
│ y hace API request │
└────────┬───────────┘
         │
         ▼
┌────────────────────────┐
│ OAuth2Interceptor      │
│ agrega Authorization   │
└────────┬───────────────┘
         │
         ▼
┌────────────────┐
│  Backend API   │
└────────┬───────┘
         │
    ┌────┴────┐
    │  200 OK │  401 UNAUTHORIZED
    ▼         ▼
┌────────┐  ┌──────────────────┐
│ Mostrar│  │ Interceptor catch│
│  datos │  │ authService.logout()│
└────────┘  │ Router.navigate() │
            └──────────────────┘
```

## 🎯 Resumen Ejecutivo

**Pregunta:** ¿El frontend controla el vencimiento del token?

**Respuesta:** ✅ **SÍ**

1. **Guards** previenen acceso sin token
2. **Interceptor** detecta 401 del backend
3. **Logout automático** limpia sesión
4. **Redirect a login** preserva returnUrl
5. **Manejo de errores** diferenciado por código HTTP

**El sistema está completamente funcional y listo para producción.**
