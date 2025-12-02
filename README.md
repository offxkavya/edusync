![EduSync cover](./public/og-image.png)

# EduSync – College Management & Automation

EduSync is a full-stack platform for colleges to manage admissions, faculty workloads, attendance, marks, announcements, and dashboards in a single pane of glass. It is built entirely on Next.js App Router with Prisma + PostgreSQL, so the frontend, API routes, and ORM all live in one codebase.

---

## ⚙️ Stack

| Layer | Tech |
| --- | --- |
| UI | Next.js 14 (App Router), React 19, TailwindCSS |
| API | Next.js server routes (`src/app/api/*`) |
| ORM | Prisma 6 |
| DB | PostgreSQL (local or hosted) |
| Auth | JWT + bcrypt password hashing |
| Hosting | Vercel (web/API) + Railway/Neon/Supabase for PostgreSQL |

---

## 🚀 Getting Started

1. **Install**
   ```bash
   npm install
   ```
2. **Configure `.env`**
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB"
   JWT_SECRET="super-strong-secret"
   ```
3. **Sync database**
   ```bash
   npx prisma migrate dev
   ```
4. **Run**
   ```bash
   npm run dev
   ```
5. **Visit**
   - Landing: `http://localhost:3000`
   - Signup/Login/Profile/Dashboard: `/signup`, `/login`, `/profile`, `/dashboard`
   - Management views: `/students`, `/announcements/new`

---

## 🧭 App Routes

| Route | Description |
| --- | --- |
| `/` | Marketing hero page with CTA to sign up/log in |
| `/signup` | Multi-role signup (Student/Faculty/Admin) with conditional profile fields |
| `/login` | JWT-based login form |
| `/dashboard` | Role-aware overview: recent students, announcements, marks |
| `/students` | Admin/faculty student directory with search + filters |
| `/announcements/new` | Admin/faculty composer for broadcasting circulars |
| `/profile` | Rich profile card that surfaces user role plus student/faculty metadata |

All client pages use Tailwind utility classes and subtle motion effects to keep UI polished.

---

## 🛠 API Overview

| Endpoint | Method | Purpose | Access |
| --- | --- | --- | --- |
| `/api/signup` | POST | Create user + optional role-specific profile | Public (intake) or Admin |
| `/api/login` | POST | Authenticate, issue JWT with `{ userId, email, role }` | Public |
| `/api/profile` | GET | Return authenticated user + student/faculty data | Authenticated |
| `/api/students` | GET/POST | List (with pagination/search) or create students | Admin/Faulty (GET), Admin (POST) |
| `/api/students/[id]` | GET/PUT | Detailed student view + updates | Admin/Faculty (GET/PUT) |
| `/api/attendance` | GET/POST | Pull or submit attendance entries | Admin/Faculty |
| `/api/marks` | GET/POST | Fetch marks (students see own) or upload scores | Students (GET own), Admin/Faculty (POST) |
| `/api/announcements` | GET/POST | Get feed or publish announcement | GET: public, POST: Admin/Faculty |

All protected routes expect `Authorization: Bearer <token>` header. See `src/lib/auth-server.js` for the guard helper.

---

## 🗃 Prisma Data Model Highlights

- `User`: base entity with `role` (`ADMIN`, `FACULTY`, `STUDENT`) plus audit fields.
- `StudentProfile` / `FacultyProfile`: 1:1 extensions that store department info, enrollment numbers, employee codes, etc.
- `Course`, `Enrollment`, `Attendance`, `Mark`, `Announcement`: capture the academic lifecycle with referential integrity and enums like `AttendanceStatus` / `AssessmentType`.

Run `npx prisma studio` anytime to inspect records visually.

---

## 🔐 Auth Flow

1. Signup/Login endpoints hash passwords and issue JWTs.
2. Tokens are persisted in `localStorage` (`token` key) on the client.
3. Client pages guard protected routes via `useEffect` redirects.
4. Server routes use `authenticateRequest` (see `src/lib/auth-server.js`) to verify tokens and enforce role-based access.
5. Logout simply clears the token and navigates to `/login`.

---

## ✨ Feature Summary

- Role-based signup (Student/Faculty/Admin) with conditional form sections.
- Centralized profile showing enrollment, department, specialization data.
- Dashboard widgets for recent students, announcements, and student marks.
- Student directory with search/filters/pagination via Prisma queries.
- Attendance + marks APIs for faculty, with upsert semantics for assessments.
- Announcement publishing workflow with audience targeting.
- Tailwind-powered gradients, glassmorphism, and responsive layouts out of the box.

---

## 🧪 Testing & Tools

- **Manual**: hit `/signup`, `/login`, `/dashboard`, `/students`.
- **API**: use Thunder Client/Postman for `/api/*` endpoints; include `Authorization` header for protected routes.
- **Database**: `npx prisma studio` or `psql` for deeper inspection.
- **Linting**: `npm run lint`.

---

## 📦 Deployment Checklist

1. Provision PostgreSQL (Neon, Railway, Supabase, etc.).
2. Set `DATABASE_URL` + `JWT_SECRET` on hosting provider (Vercel).
3. `npx prisma migrate deploy` during CI/CD or Vercel build step.
4. `npm run build && npm run start` (handled by Vercel automatically).

---

## 🗺 Roadmap Ideas

- Course CRUD UI and enrollment workflows.
- Guardian/parent portal with selective announcements.
- Webhooks or cron jobs for daily attendance reminders.
- File uploads for study materials.
- Replace `localStorage` tokens with httpOnly cookies for hardened security.

Happy building! 👩‍🏫👨‍🏫
