# Student-Teacher Booking System

A full-stack application built with Next.js, MongoDB, and TypeScript for managing appointment bookings between students and teachers.

## 🚀 Features

### Admin Module
- Dashboard with system stats.
- Manage Teachers (Add/Update/Delete).
- Approve/Reject Student registrations.
- View all system appointments and logs.

### Teacher Module
- Manage Profile (Department, Subject, Bio).
- Schedule Availability Slots.
- Manage Appointment Requests (Approve/Reject).
- View upcoming schedule.

### Student Module
- Register and Login.
- Search Teachers by Name, Department, or Subject.
- View Teacher Availability.
- Book Appointments.
- Track Appointment Status.

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **Styling**: Tailwind CSS, Shadcn/UI (Custom implementation)
- **Auth**: JWT (Access + Refresh Tokens), Bcrypt, Middleware RBAC
- **Validation**: Zod

## 📂 Folder Structure

```
/app
  /(auth)       # Login/Register pages
  /admin        # Admin specific pages & layout
  /teacher      # Teacher specific pages & layout
  /student      # Student specific pages & layout
  /api          # Backend API routes
/components
  /ui           # Reusable UI components
/lib
  /models       # Mongoose Schemas (User, Appointment, etc)
  db.ts         # Database connection
  auth.ts       # Auth helpers
```

## ⚙️ Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd student_teacher_booking_appointment
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env.local` file in the root:
   ```env
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/edubook
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Access the app at `http://localhost:3000`.

## 🧪 API Documentation

### Auth
- `POST /api/auth/register`: Register new student.
- `POST /api/auth/login`: Login user.

### Admin
- `GET /api/admin/teachers`: List teachers.
- `POST /api/admin/teachers`: Add teacher.
- `PATCH /api/admin/students`: Approve student.

### Teacher
- `POST /api/teachers/availability`: Add slot.
- `PATCH /api/teachers/appointments`: Update appointment status.

### Student
- `GET /api/teachers/search`: Search teachers.
- `POST /api/appointments/book`: Book slot.

## 🔒 Security
- **RBAC**: Middleware protects `/admin`, `/teacher`, and `/student` routes.
- **Validation**: Zod schemas validate all API inputs.
- **Passwords**: Hashed using Bcrypt.

## 📝 License
MIT
