# Admin Login - Quick Reference

## 🚀 Getting Started

### 1. Create Your First Admin Account
```bash
npx convex run auth:createSuperAdmin --args "admin@hirwa.com" "admin123" "Admin User"
```

### 2. Login
- URL: `http://localhost:3000/auth/login`
- Email: `admin@hirwa.com`
- Password: `admin123`

### 3. Create Articles
- After login, you're in `/admin/create`
- Write articles, upload images, and publish

---

## 📋 Key Information

| Item | Value |
|------|-------|
| **Login Page** | `/auth/login` |
| **Admin Dashboard** | `/admin/create` |
| **Protected Routes** | `/admin/*`, `/dashboard/*` |
| **Session Duration** | 30 days |
| **Password Hash** | SHA-256 + salt |
| **Storage** | localStorage keys: `adminToken`, `adminEmail`, `adminName`, `adminRole` |

---

## 🔐 Roles

- **super_admin** - Full system access, can create other admins
- **admin** - Full article management, can manage writers
- **editor** - Can create/edit articles, cannot manage users

---

## 🛠️ Useful Commands

### Check Convex logs
```bash
npx convex logs
```

### Run auth function manually
```bash
npx convex run auth:login --args "admin@hirwa.com" "admin123"
```

### List all admins
```bash
npx convex run auth:listAdmins --args "your-token-here"
```

---

## 📝 File Structure

```
convex/
  ├── auth.ts                    ← All auth functions
  ├── schema.ts                  ← Database tables (admins, adminSessions)
  └── _generated/
      └── api.ts                 ← Generated API

src/app/
  ├── auth/login/page.tsx        ← Login page UI
  ├── admin/create/page.tsx      ← Protected article creation
  └── dashboard/admin/page.tsx   ← (Future admin dashboard)

middleware.ts                    ← Route protection
```

---

## ⚠️ Security Notes

- ✅ Passwords are hashed (SHA-256)
- ⚠️ Use bcryptjs in production (see ADMIN_LOGIN_SETUP.md)
- ✅ Sessions expire after 30 days
- ✅ Logout clears all credentials
- 🔒 Add email verification for production
- 🔒 Add rate limiting for login attempts

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't login | Check email is exact, verify account exists |
| "Invalid email or password" | Account might be deactivated (isActive = false) |
| Session expired | Login again, tokens expire after 30 days |
| 404 on /admin/create | Make sure you're logged in |
| Can't see logout button | Refresh page after login |

---

## 📚 Documentation

Full setup guide: [ADMIN_LOGIN_SETUP.md](./ADMIN_LOGIN_SETUP.md)

---

**Last Updated:** March 20, 2026
**System Version:** 1.0
