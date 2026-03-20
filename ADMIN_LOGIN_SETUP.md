# Admin Login System - Setup Guide

## Overview

Your Hirwa Ambassadeur news site now has a complete admin authentication system with:

- ✅ Admin login page at `/auth/login`
- ✅ Protected admin routes requiring authentication
- ✅ Session management with secure tokens
- ✅ Role-based access control (super_admin, admin, editor)
- ✅ Logout functionality
- ✅ Password management

## Quick Start

### 1. Create First Super Admin Account

Run this command to create your first admin account:

```bash
npx convex run auth:createSuperAdmin --args "admin@hirwa.com" "admin123" "Admin User"
```

**Arguments:**
- First arg: Email address
- Second arg: Password (use something stronger in production)
- Third arg: Display name

**Example:**
```bash
npx convex run auth:createSuperAdmin --args "john@hirwanews.com" "SecurePassword123!" "John Doe"
```

### 2. Access Admin Dashboard

1. Start your dev servers:
   ```bash
   # Terminal 1
   npm run dev

   # Terminal 2
   npx convex dev
   ```

2. Navigate to: `http://localhost:3000/auth/login`

3. Enter your credentials and login

4. You'll be redirected to `/admin/create` where you can create articles

## Credentials Management

### Default Test Account
```
Email: admin@hirwa.com
Password: admin123
```

⚠️ **IMPORTANT**: Change this password immediately for security!

### Creating Additional Admins

Once logged in as super admin, you can create more admin accounts via API:

```javascript
// This would be called from an admin panel (coming soon)
const result = await createAdmin({
  email: 'editor@hirwa.com',
  password: 'editorPassword123',
  name: 'Editor User',
  role: 'editor',
  currentAdminToken: 'your-token-here'
});
```

## API Functions

All auth functions are in `convex/auth.ts`:

### Login
```javascript
const result = await login({ email: 'admin@hirwa.com', password: 'admin123' });
// Returns: { success: true, sessionId, token, admin: { _id, email, name, role } }
```

### Get Current Admin
```javascript
const admin = await getCurrentAdmin({ token: 'session-token' });
// Returns admin details or null if token invalid/expired
```

### Logout
```javascript
await logout({ token: 'session-token' });
```

### Change Password
```javascript
await changePassword({
  token: 'session-token',
  oldPassword: 'current-password',
  newPassword: 'new-password'
});
```

## Database Schema

### Admins Table
```
- _id (string) - Document ID
- email (string) - Unique email
- passwordHash (string) - Hashed password
- name (string) - Display name
- role (string) - 'super_admin', 'admin', or 'editor'
- isActive (bool) - Enable/disable account
- lastLogin (string optional) - Last login timestamp
- createdAt (string) - Account creation date
```

### Admin Sessions Table
```
- _id (string) - Document ID
- adminId (ref) - Reference to admin
- token (string) - Session token
- expiresAt (string) - Expiration time (30 days)
- createdAt (string) - Session creation date
```

## Session Management

- Session tokens are stored in browser's `localStorage`
- Tokens expire after **30 days**
- Expired sessions are automatically cleaned up
- Logging out removes the token from localStorage

### Token Storage Keys
```javascript
localStorage.getItem('adminToken')     // Session token
localStorage.getItem('adminEmail')     // Admin email
localStorage.getItem('adminName')      // Admin name
localStorage.getItem('adminRole')      // Admin role
```

## Protected Routes

These routes require authentication:

```
/admin/*              - Admin creation/management pages
/dashboard/*          - Dashboard pages
```

**How it works:**
1. User tries to access `/admin/create`
2. Middleware checks for `adminToken` in cookies
3. If no token → redirected to `/auth/login`
4. If token exists → redirected to `/auth/login?from=/admin/create`
5. After login → redirected back to original page

## Security Implementation

### Password Hashing
- Uses SHA-256 + salt
- ⚠️ Note: In production, use bcryptjs or argon2
- Passwords never stored in plaintext

### Session Tokens
- 64-character hexadecimal strings
- Generated using crypto.randomBytes(32)
- Unique per session

### CORS & CSRF
- Configure CORS in Convex backend
- Add CSRF tokens for production

## Customization

### Change Session Expiration
Edit `convex/auth.ts`, find `getExpirationTime()`:
```javascript
function getExpirationTime(): string {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 30); // Change 30 to desired days
  return expiry.toISOString();
}
```

### Add Login Redirect
Edit `src/app/auth/login/page.tsx` to customize the post-login redirect.

### Update Password Hashing
Currently uses SHA-256. Update to bcryptjs:
```bash
npm install bcryptjs
```

Then update `convex/auth.ts`:
```javascript
import bcrypt from 'bcryptjs';

function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}
```

## Troubleshooting

### "Invalid email or password"
- Check email is lowercase
- Verify account is active (isActive = true)
- Ensure password matches stored hash

### Session expired
- Tokens expire after 30 days
- User needs to login again
- Old tokens are automatically deleted

### Can't access /admin/create
- Check localStorage has `adminToken`
- Verify token hasn't expired
- Try logging out and back in

### Middleware not protecting routes
- Verify `middleware.ts` exists at project root
- Check routes match `protectedRoutes` array
- Restart dev server after middleware changes

## Next Steps

### Phase 2 (Coming Soon)
- [ ] Admin dashboard with user management
- [ ] Create/edit additional admins
- [ ] Change password form
- [ ] Forgot password flow
- [ ] Email verification
- [ ] 2FA setup
- [ ] Admin activity logs
- [ ] Article review workflow
- [ ] Writer approval management

### Production Checklist
- [ ] Switch password hashing to bcryptjs/argon2
- [ ] Enable HTTPS
- [ ] Set secure cookie flags
- [ ] Add rate limiting on login endpoint
- [ ] Implement CSRF protection
- [ ] Add login attempt tracking
- [ ] Set up email notifications for logins
- [ ] Configure passwordless login (optional)

## Support

For issues or questions:
1. Check Convex logs: `npx convex logs`
2. Review browser console for errors
3. Verify database schema matches documented format
4. Check localStorage for token presence

---

**Last Updated:** March 20, 2026

