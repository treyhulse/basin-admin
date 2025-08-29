# Auth Provider System - Clerk-like Authentication

The Basin API now includes a comprehensive auth provider system that scopes authentication sessions by tenant and provides centralized auth context, similar to Clerk.

## Key Features

### 1. **Tenant-Scoped Sessions**
- Each login creates a session tied to a specific tenant
- JWT tokens include tenant context (`tenant_id`, `tenant_slug`)
- Users can belong to multiple tenants with different roles/permissions

### 2. **Centralized Auth Context**
- Easy access to user, tenant, roles, and permissions
- Available through the `auth` context in all protected routes
- Similar to Clerk's `useAuth()` hook

### 3. **Session Management**
- Unique session IDs for each authentication
- Tenant switching without re-authentication
- Comprehensive permission and role validation

## API Endpoints

### Authentication & Session Management

#### Login with Tenant Context
```bash
POST /auth/login
{
  "email": "user@example.com",
  "password": "password",
  "tenant_slug": "acme-corp"  # Optional: specify tenant
}
```

Response includes tenant context:
```json
{
  "token": "eyJ...",
  "user": { ... },
  "tenant_id": "uuid",
  "tenant_slug": "acme-corp"
}
```

#### Switch Tenant
```bash
POST /auth/switch-tenant
Authorization: Bearer <token>
{
  "tenant_id": "new-tenant-uuid"
}
```

#### Get Auth Context
```bash
GET /auth/context
Authorization: Bearer <token>
```

Returns comprehensive auth context:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  },
  "tenant": {
    "id": "uuid",
    "name": "Acme Corp",
    "slug": "acme-corp"
  },
  "session": {
    "id": "session-uuid",
    "expires_at": "2024-01-01T00:00:00Z"
  },
  "auth": {
    "is_admin": false,
    "roles": ["member", "editor"],
    "permissions": ["users:read", "posts:create"]
  }
}
```

#### Get User Tenants
```bash
GET /auth/tenants
Authorization: Bearer <token>
```

## Usage in Go Code

### 1. **Accessing Auth Context in Handlers**

```go
func (h *Handler) SomeProtectedEndpoint(c *gin.Context) {
    // Get the auth provider
    auth, exists := middleware.GetAuthProvider(c)
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authenticated"})
        return
    }

    // Access auth information
    userID := auth.UserID
    tenantID := auth.TenantID
    isAdmin := auth.IsAdmin
    roles := auth.Roles
    permissions := auth.Permissions

    // Use the information...
}
```

### 2. **Using the Auth Provider Service**

```go
type Handler struct {
    authProvider *AuthProviderService
}

func (h *Handler) SomeEndpoint(c *gin.Context) {
    // Get current user
    user, err := h.authProvider.GetCurrentUser(c)
    if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
        return
    }

    // Get current tenant
    tenant, err := h.authProvider.GetCurrentTenant(c)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "No tenant context"})
        return
    }

    // Validate permissions
    if !h.authProvider.ValidatePermission(c, "users", "read") {
        c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions"})
        return
    }
}
```

### 3. **Middleware for Permission/Role Requirements**

```go
// Require specific permission
router.GET("/users", 
    middleware.AuthMiddleware(cfg, db),
    authProvider.RequirePermission("users", "read"),
    handler.GetUsers,
)

// Require specific role
router.POST("/admin/settings", 
    middleware.AuthMiddleware(cfg, db),
    authProvider.RequireRole("admin"),
    handler.UpdateSettings,
)

// Require tenant context
router.GET("/data", 
    middleware.AuthMiddleware(cfg, db),
    authProvider.RequireTenant(),
    handler.GetData,
)
```

## Frontend Integration

### 1. **Store Auth Context**
```javascript
// After login
const authContext = await fetch('/auth/context', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());

// Store in your app state
setAuth(authContext);
```

### 2. **Use Auth Context**
```javascript
function useAuth() {
  const [auth, setAuth] = useState(null);
  
  const hasPermission = (table, action) => {
    return auth?.auth?.permissions?.includes(`${table}:${action}`) || false;
  };
  
  const hasRole = (role) => {
    return auth?.auth?.roles?.includes(role) || false;
  };
  
  const isAdmin = auth?.auth?.is_admin || false;
  const currentTenant = auth?.tenant;
  const currentUser = auth?.user;
  
  return {
    auth,
    hasPermission,
    hasRole,
    isAdmin,
    currentTenant,
    currentUser,
  };
}
```

### 3. **Switch Tenants**
```javascript
async function switchTenant(tenantId) {
  const response = await fetch('/auth/switch-tenant', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ tenant_id: tenantId })
  });
  
  const { token: newToken } = await response.json();
  
  // Update token and refresh auth context
  setToken(newToken);
  await refreshAuthContext();
}
```

## Security Features

### 1. **JWT with Tenant Context**
- Tokens include `tenant_id` and `tenant_slug`
- Session IDs for tracking
- Automatic expiration

### 2. **Permission Validation**
- Field-level permissions (e.g., `users:read`, `posts:create`)
- Role-based access control
- Admin bypass for system operations

### 3. **Tenant Isolation**
- Users can only access data from tenants they belong to
- Automatic tenant filtering in queries
- Secure tenant switching

## Database Schema

The system uses these key tables:
- `users` - User accounts
- `tenants` - Organizations/workspaces
- `user_tenants` - Many-to-many user-tenant relationships with roles
- `roles` - Role definitions
- `permissions` - Granular permissions per role/tenant

## Benefits

1. **Multi-tenancy**: Users can work across multiple organizations
2. **Security**: Tenant-scoped sessions and data isolation
3. **Flexibility**: Easy tenant switching without re-authentication
4. **Developer Experience**: Simple auth context access similar to Clerk
5. **Scalability**: Efficient permission checking and role management

This auth provider system gives you the power and flexibility of Clerk while maintaining the security and multi-tenancy requirements of enterprise applications.
