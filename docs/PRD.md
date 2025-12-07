# Educo - Product Requirements Document (PRD)

## 1. Overview

Educo is a unified School ERP and Digital Management Platform designed for African educational institutions — spanning Primary, Secondary, and Tertiary levels — built to digitize operations, enable data-driven decision-making, and scale across regions and school networks.

Educo supports a multi-tenant (schema-per-tenant) architecture to provision isolated environments for each school, ensuring secure data separation, independent backups, and localized configuration.

It's mobile-first, feature-flag enabled, and integrated with global collaboration tools like Google, Zoom, WhatsApp, and Facebook for real-time communication and learning.

---

## 2. Goals

### Primary Objectives

- Digitize academic, administrative, and financial processes
- Enable real-time communication among schools, teachers, students, and parents
- Deliver mobile-first access for all stakeholders
- Provide AI-powered analytics and actionable insights
- Simplify local and international admission workflows
- Enable massive scalability through multi-tenant provisioning
- Roll out regional features dynamically via feature flags

---

## 3. Target Market

Educo is optimized for African educational systems following regional and international academic standards.

### Supported Regions & Frameworks

| Region | Frameworks |
|--------|------------|
| 🇳🇬 Nigeria | WAEC, NECO, BECE, NCEE, JAMB, GCE |
| 🇬🇭 Ghana | BECE, WASSCE |
| 🇰🇪 Kenya | KCPE, KCSE |
| 🇿🇦 South Africa | NSC, CAPS |
| 🇺🇬 Uganda | UNEB |

### Institution Types

- Primary (Public & Private)
- Secondary (Public & Private)
- Tertiary (Universities, Polytechnics, Colleges — Public & Private)
- International Schools & Education Networks

### Local Integrations

- **Payments**: Paystack, Flutterwave, Interswitch
- **Communication**: SMS Gateway, WhatsApp Business API
- **Academic Standards**: WAEC, NECO, JAMB

---

## 4. Architecture Overview

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend (Web) | React / Vue / Angular | ERP dashboard & CMS |
| Mobile App | React Native | Portals for students, parents, and staff |
| Backend | Node.js + Express | APIs, workflows, automation |
| Database | Supabase (PostgreSQL + Edge Functions) | Real-time data, per-tenant schemas |
| Auth | Supabase Auth + JWT | MFA, RBAC, SSO |
| Storage | Supabase Storage | Certificates, transcripts, media |
| Realtime Engine | Supabase Realtime | Sync, notifications |
| Hosting | Netlify + Node.js Server | Cloud deployment |
| Integrations | Paystack, Zoom, Google, WhatsApp, Facebook | Communication & payment |
| Feature Flags | Custom engine | Modular feature rollout |

---

## 5. Multi-Tenant Architecture (Schema-per-Tenant)

Educo provisions a dedicated PostgreSQL schema per tenant (school) — ensuring isolation, configurability, and scalability.

### Key Advantages

- **Full Data Isolation** – Tenant-specific schema boundaries
- **Independent Backups** – Backup & restore per tenant
- **Custom Configuration** – Branding, currency, grading, timezone per tenant
- **Secure Access Control** – RLS + tenant-aware middleware

### Tenant Lifecycle

| Stage | Action |
|-------|--------|
| Provisioning | Super Admin creates new tenant → schema auto-generated |
| Configuration | Default grading, academic year, feature flags applied |
| Onboarding | Tenant admin invited via subdomain (e.g. sunrise.educo.africa) |
| Runtime Isolation | Middleware enforces tenantId context in all API calls |
| Deactivation | Tenant archived safely without data loss |

### Example Tenant Context

```javascript
app.use((req, res, next) => {
  const tenantId = req.headers['x-tenant-id'];
  setTenantSchema(tenantId);
  next();
});
```

### Customization Options

| Category | Examples |
|----------|----------|
| Branding | Logo, colors, subdomain |
| Localization | Language, timezone |
| Grading | WAEC, NECO, GPA |
| Currency | NGN, GHS, KES |
| Payment | Paystack, Flutterwave |
| Features | LMS, Finance, Hostel, Transcript |

---

## 6. User Roles & Permissions

| Role | Scope | Description |
|------|-------|-------------|
| Super Admin | Global | Manages all tenants & configurations |
| School Admin | Institution | Oversees academics, finance, operations |
| Branch Admin | Branch | Localized management |
| Teacher | Class/Subject | Attendance, grading, reporting |
| Student | Self | Access results, fees, transcripts |
| Parent | Linked Students | Monitor progress, make payments |
| Custom Roles | Configurable | Vendors, franchise partners |

**Features**: RBAC + MFA + Tenant Context Isolation

---

## 7. Core Modules (Unified Web + Mobile)

✅ Mobile Responsive | ✅ Real-time Sync | ✅ Tenant Data Isolation | ✅ Feature Flag Control

### 7.1 School & Branch Management

- Multi-campus, multi-branch setup
- Regional grading templates (WAEC, NECO, BECE)
- Branch hierarchy & delegation

**Feature Flags**: `FF_School_Management`, `FF_Branch_Hierarchy`

### 7.2 Student Management

- Digital student profiles with ID & parent linkage
- Attendance, discipline, and academic tracking
- Cross-branch transfer workflow with finance sync
- Uploads: Birth certificates, transcripts, photos

#### Assessment by Level

| Level | Assessment Types |
|-------|------------------|
| Primary | Classwork, homework, projects, behavior, sports |
| Secondary | Assignments, quizzes, labs, exams, weekend classes |
| Tertiary | Coursework, mid/final exams, internships, presentations |

**Feature Flags**: `FF_Student_Profile`, `FF_Student_Transfer`, `FF_Student_Grading`

### 7.3 Staff Management

- HR profiles, attendance & payroll
- Transfers across branches
- Leave management & performance review

**Feature Flags**: `FF_Staff_HR`, `FF_Staff_Payroll`, `FF_Staff_Transfer`

### 7.4 Attendance Management

- Modes: Manual, Biometric, GPS
- Lesson-level & sessional attendance
- Real-time attendance dashboards
- Evening/weekend class tracking

**Feature Flags**: `FF_Attendance_Biometric`, `FF_Attendance_GPS`, `FF_Attendance_Evening_Weekend`

### 7.5 Academics & LMS

- Timetables, grading, assignments
- Zoom for live classes
- Google Drive for file sharing
- Multimedia LMS CMS

**Feature Flags**: `FF_LMS_Zoom`, `FF_LMS_GoogleDrive`, `FF_LMS_Grading`

### 7.6 Finance & Accounts

Supports multi-term billing, receipts, waivers, installment plans, and tenant-level finance analytics.

| Level | Fee Types | Integration | Flag |
|-------|-----------|-------------|------|
| Primary (Private) | Tuition, PTA, meals, transport | Paystack/Interswitch | `FF_Finance_Private` |
| Secondary (Public) | Exam levies | CSV/Offline | `FF_Finance_Public` |
| Tertiary | Tuition, hostel, convocation, transcript | Paystack/Bank API | `FF_Finance_Tertiary` |

### 7.7 Communication Suite

| Feature | Integration | Flag |
|---------|-------------|------|
| Chat | WhatsApp API | `FF_Chat_WhatsApp` |
| Video | Zoom / WebRTC | `FF_Call_Zoom` |
| Calendar | Google Calendar | `FF_GoogleCalendar` |
| Email | SendGrid | `FF_Email_SendGrid` |
| Social Feed | Facebook/Instagram | `FF_FacebookIntegration` |

### 7.8 Library, Hostel & Transport

- QR code-based library issue/return
- Hostel allocation & visitor management
- GPS transport tracking & OTP-based pickup

**Feature Flags**: `FF_Library_QR`, `FF_Hostel_Management`, `FF_Transport_GPS`

### 7.9 Reports & Analytics

- Tenant-level dashboards
- Performance metrics per term/branch
- Export: PDF/Excel
- Google Data Studio integration

**Feature Flags**: `FF_Reports_GoogleDataStudio`, `FF_Reports_Export`

### 7.10 Transcript Management

- Generate transcripts across education levels
- Include attendance, discipline, weekend/evening programs
- Integrated payment workflow (Paystack, Interswitch)
- Output formats: PDF, Excel

**Feature Flags**: `FF_Transcript_Generation`, `FF_Transcript_Payment`

### 7.11 Adaptive Grading Framework (AGE)

| Level | Component | Weight | Output | Flag |
|-------|-----------|--------|--------|------|
| Primary | Classwork, Tests, Projects, Behavior, Exams | 20/20/10/10/40 | Numeric + Remarks | `FF_Grading_Primary` |
| Secondary | Tests, Assignments, Practicals, Exam | 15/10/10/50 | WAEC-style (A1–F9) | `FF_Grading_Secondary` |
| Tertiary | CA, Lab, Mid Exam, Final Exam | 30/10/20/40 | GPA (A–F) | `FF_Grading_Tertiary` |

---

## 8. Admission & Examination Integration

Supports national and international academic workflows.

- **Nigeria**: NCEE, BECE, WAEC/NECO, UTME, JUPEB, ND
- **International**: IB, SAT, ACT, GRE, GMAT, IELTS, TOEFL

**Feature Flags**: `FF_Admissions_International`, `FF_Exams_National`

---

## 9. Mobile App (React Native)

| User | Features | Integrations |
|------|----------|--------------|
| Student | Timetable, results, payments | Zoom, Google |
| Parent | Progress, chat, fees | WhatsApp, Paystack |
| Teacher | Attendance, grading | Zoom, WhatsApp |
| Admin | Analytics, approvals | Google, Facebook |

---

## 10. Notifications & Realtime Updates

| Channel | Provider | Use | Flag |
|---------|----------|-----|------|
| Push | Supabase/Firebase | Alerts | `FF_Notifications_Push` |
| SMS | Local Gateway | Urgent alerts | `FF_Notifications_SMS` |
| Email | SendGrid | Reports | `FF_Notifications_Email` |
| WhatsApp | API | Fees, attendance | `FF_Notifications_WhatsApp` |
| Social Media | Facebook/Instagram | Announcements | `FF_Notifications_Social` |

---

## 11. MVP Scope

- ✅ Core Modules: Student, Staff, Finance, Attendance, LMS
- ✅ Multi-Tenant Schema Architecture
- ✅ Transfer & Transcript Workflows
- ✅ Adaptive Grading Framework
- ✅ Realtime Notifications
- ✅ Google, Zoom, WhatsApp, Facebook Integrations
- ✅ Mobile App (Student, Parent, Staff)

---

## 12. Future Enhancements

- AI-based grading & prediction insights
- Blockchain transcript validation
- WAEC, NECO, JAMB API integrations
- Integration monitoring dashboard
- WhatsApp chatbot for parents

---

## Summary

Educo v4.0 delivers a multi-tenant, scalable, AI-ready School ERP covering Primary → Tertiary institutions with:

- ✅ Schema-per-tenant data isolation
- ✅ Full attendance tracking system
- ✅ National & international exam support
- ✅ Mobile-first access
- ✅ Google, Zoom, WhatsApp, Facebook integrations
- ✅ Feature-flag controlled modular deployment
