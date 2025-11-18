# Role-Based Access Control (RBAC)

This application implements a comprehensive role-based access control system with three distinct user roles.

## User Roles

### 1. Owner (Full Access)
- **Dashboard Route:** `/dashboard`
- **Layout:** `dashboard.vue`
- **Access Level:** Complete access to all features
- **Features:**
  - CRM (Leads, Trial Lessons)
  - LMS (Students, Groups, Attendance)
  - Tests & Exams (Test Builder, Test Management)
  - Finance (Expenses, Income, Salaries, Payments)
  - Reports & Analytics
  - Settings & Configuration

### 2. Admin (Management Access)
- **Dashboard Route:** `/admin/dashboard`
- **Layout:** `admin.vue`
- **Access Level:** CRM, LMS, and Payments
- **Features:**
  - CRM (Leads, Trial Lessons)
  - LMS (Students, Groups, Attendance)
  - Finance - Payments Only
  - Limited Settings

### 3. Teacher (Teaching Access)
- **Dashboard Route:** `/teacher/dashboard`
- **Layout:** `teacher.vue`
- **Access Level:** LMS and Tests & Exams
- **Features:**
  - LMS (Students, Groups, Attendance)
  - Tests & Exams (Test Builder, Test Management)
  - View own students and groups
  - Limited Settings

## Technical Implementation

### Layouts
Each role has a dedicated layout file with customized navigation:
- `app/layouts/dashboard.vue` - Owner layout (full menu)
- `app/layouts/admin.vue` - Admin layout (CRM, LMS, Payments)
- `app/layouts/teacher.vue` - Teacher layout (LMS, Tests)

### Middleware
- `app/middleware/auth.ts` - Ensures user is authenticated
- `app/middleware/role.ts` - Enforces role-based access control

### Route Protection
Pages use `definePageMeta` to specify:
```vue
definePageMeta({
  layout: "teacher", // or "admin", "dashboard"
  middleware: ["auth", "role"],
});
```

### Role-Based Redirection
After login, users are automatically redirected based on their role:
- Owner → `/dashboard`
- Admin → `/admin/dashboard`
- Teacher → `/teacher/dashboard`

The redirection logic is handled in:
- `app/composables/useAuth.ts` - `getRoleBasedRedirect()` function
- `app/pages/auth/verify-login-otp.vue` - After OTP verification

### User Role Detection
User roles are stored in the user object returned from the authentication API:
```typescript
interface User {
  id: string;
  name?: string;
  email?: string;
  role?: 'owner' | 'admin' | 'teacher';
  center_id?: string;
}
```

## Pages Structure

### Owner Pages (`/dashboard/*`)
All existing dashboard pages remain under `/dashboard` route.

### Admin Pages (`/admin/*`)
- `/admin/dashboard` - Admin dashboard
- `/admin/leads` - Lead management
- `/admin/students` - Student management
- `/admin/payments` - Payment processing
- `/admin/settings` - Admin settings

### Teacher Pages (`/teacher/*`)
- `/teacher/dashboard` - Teacher dashboard
- `/teacher/students` - View students
- `/teacher/groups` - Manage groups
- `/teacher/attendance` - Take attendance
- `/teacher/test-builder/reading` - Create reading tests
- `/teacher/test-builder/listening` - Create listening tests
- `/teacher/reading/tests` - View reading tests
- `/teacher/listening/tests` - View listening tests
- `/teacher/writing/tests` - View writing tests
- `/teacher/settings` - Teacher settings

## Adding New Role-Protected Pages

1. Create the page in the appropriate directory (`/dashboard`, `/admin`, or `/teacher`)
2. Add the page meta with appropriate layout and middleware:
```vue
definePageMeta({
  layout: "teacher", // or "admin", "dashboard"
  middleware: ["auth", "role"],
});
```
3. Add the route to the corresponding layout's sidebar menu
4. Update role route rules in `app/middleware/role.ts` if needed

## Testing Roles

To test different roles, modify the user's role in the authentication response or database:
- Set `role: 'owner'` for full access
- Set `role: 'admin'` for CRM, LMS, and Payments access
- Set `role: 'teacher'` for LMS and Tests access

## Future Enhancements

- [ ] Fine-grained permissions within each role
- [ ] Role switching for owners
- [ ] Audit logging for role-based actions
- [ ] Dynamic role assignment UI
- [ ] Permission-based feature flags
