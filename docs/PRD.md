# Educo - Product Requirements Document (PRD v7.0)

## Multi-Tenant, Tenant-Configurable, AI-Verified School ERP

**Mobile | Tablet | Desktop | Fully Tested | Requirement-Validated | Enterprise SaaS**

---

## 1. Executive Summary

Educo is a multi-tenant School ERP and Digital Education Platform designed for African educational institutions across Primary, Secondary, and Tertiary levels.

Educo provides:

- Academic management
- Financial management
- Administrative operations
- Communication systems
- Digital learning (LMS)
- Regional exam alignment
- Tenant-level customization
- Device-adaptive UI (Mobile, Tablet, Desktop)
- AI-enforced requirement validation
- Full automated testing down to the lowest function

Educo guarantees:

- Cross-tenant isolation
- Configuration-aware execution
- Feature-flag modularity
- Exact requirement implementation
- Zero untested logic
- CI/CD-gated deployments

---

## 2. Vision

To build Africa's most reliable, configurable, secure, and deeply verified education ERP SaaS platform.

---

## 3. Target Markets & Regional Support

### Supported Regions & Frameworks

| Region | Frameworks |
|--------|------------|
| Nigeria | WAEC, NECO, BECE, NCEE, JAMB, GCE |
| Ghana | BECE, WASSCE |
| Kenya | KCPE, KCSE |
| South Africa | NSC, CAPS |
| Uganda | UNEB |

### Institution Types

- Private schools
- Public schools
- School networks
- Polytechnics
- Universities
- International institutions

### Local Integrations

- **Payments**: Paystack, Flutterwave, Interswitch
- **Communication**: SMS Gateway, WhatsApp Business API
- **Academic Standards**: WAEC, NECO, JAMB

Regional grading systems must be configurable per tenant.

---

## 4. System Architecture

### Core Layers

| Layer | Technology | Responsibility |
|-------|------------|----------------|
| Web Frontend | Next.js 15 (React 19) | Admin ERP UI + CMS |
| Admin Portal | Next.js 15 (React 19) | Super Admin / Tenant management |
| Mobile App | React Native (Expo SDK 54) | Student/Parent/Teacher access |
| Backend API | Supabase (PostgreSQL + Edge Functions) | Business logic + tenant resolution |
| Database | PostgreSQL (schema-per-tenant) | Real-time data, per-tenant schemas |
| Auth | Supabase Auth + JWT | MFA, RBAC, SSO |
| Storage | Supabase Storage | Certificates, transcripts, media |
| Realtime Engine | Supabase Realtime | Sync, notifications |
| Feature Flag Engine | Custom engine (lib/featureFlags.ts) | Module enablement |
| Permission Engine | RBAC middleware | Role enforcement |
| Tenant Configuration Engine | SchoolSettingsContext + config tables | Behavior resolution |
| Testing Layer | Vitest + Playwright | Multi-layer verification |
| CI/CD | GitHub Actions | Deployment enforcement |
| Integrations | Paystack, Zoom, Google, WhatsApp, Agora | Communication & payment |

### Current Tech Stack (Implemented)

| Component | Technology |
|-----------|------------|
| Root App | Next.js 15.1.3, port 3000 |
| Admin App | Next.js 15.1.3, port 3001 |
| Mobile App | Expo SDK 54, React Native 0.81.5 |
| Styling (Web) | Tailwind CSS v4 (CSS-first config) |
| Styling (Mobile) | NativeWind 4.2 + Tailwind v3 |
| State Management | React Context (18 providers) |
| Charts | Recharts |
| Export | jsPDF, html2canvas, xlsx |
| Drag & Drop | @dnd-kit |
| Communication | Agora RTC/RTM, WebRTC |
| Icons | Lucide React |

---

## 5. Multi-Tenant Architecture (Schema-Per-Tenant)

Each tenant (school) has:

- Dedicated PostgreSQL schema
- Isolated student/staff/finance data
- Independent feature flags
- Independent configuration tables
- Independent academic rules
- Independent finance rules

### Tenant Resolution Flow

1. Identify tenant via domain/subdomain/token
2. Resolve tenant schema
3. Load tenant configuration
4. Inject configuration into engines
5. Execute request

**No request executes without tenant context.**

### Tenant Lifecycle

| Stage | Action |
|-------|--------|
| Provisioning | Super Admin creates new tenant → schema auto-generated |
| Configuration | Default grading, academic year, feature flags applied |
| Onboarding | Tenant admin invited via subdomain (e.g. sunrise.educo.africa) |
| Runtime Isolation | Middleware enforces tenantId context in all API calls |
| Deactivation | Tenant archived safely without data loss |

### Customization Options

| Category | Examples |
|----------|----------|
| Branding | Logo, colors, subdomain |
| Localization | Language, timezone |
| Grading | WAEC, NECO, GPA |
| Currency | NGN, GHS, KES, ZAR, UGX |
| Payment | Paystack, Flutterwave, Interswitch |
| Features | LMS, Finance, Hostel, Transcript |

---

## 6. Tenant-Level Application Framework

Each tenant operates as a configurable application instance.

### Configuration Domains

#### Academic Configuration
- Term/semester structure
- Grading scale
- GPA formula
- Pass mark
- Promotion logic
- Transcript template
- Assessment weighting

#### Finance Configuration
- Tuition structure
- Currency
- Installment rules
- Late fee penalties
- Discount logic
- Scholarship rules
- Tax/VAT rules

#### Module Enablement

Tenant may enable/disable:
- LMS
- Hostel
- Transport
- Library
- Finance
- Admissions
- CBT Exams
- HR
- Inventory

#### UI & Branding
- Logo
- Primary color
- Secondary color
- School name
- Address
- Email
- Report headers

#### Communication
- SMTP provider
- SMS gateway
- WhatsApp integration
- Notification rules

#### Regional Configuration
- Country
- Education board
- Academic year structure
- National ID format

**All configuration retrieval logic must have 100% unit test coverage.**

---

## 7. Role & Permission System

| Role | Scope | Description |
|------|-------|-------------|
| Super Admin | Global (Platform) | Manages all tenants & configurations |
| Tenant Admin | Institution | Oversees academics, finance, operations |
| Branch Admin | Branch | Localized management |
| Teacher | Class/Subject | Attendance, grading, reporting |
| Accountant | Finance | Financial operations |
| Student | Self | Access results, fees, transcripts |
| Parent | Linked Students | Monitor progress, make payments |
| Custom Roles | Configurable | Vendors, franchise partners |

**Features**: RBAC + MFA + Tenant Context Isolation

Permissions must be enforced:
- At API layer
- At route layer
- At UI layer

**All role restrictions must be fully tested.**

---

## 8. Feature Flag Framework

All major features are controlled by feature flags (`FF_*` convention).

### Flag Levels

Flags operate at:
- **Global level** — platform-wide defaults
- **Tenant level** — per-school overrides

### 40+ Implemented Flags

| Category | Flags |
|----------|-------|
| School Management | `FF_School_Management`, `FF_Branch_Hierarchy` |
| Student | `FF_Student_Profile`, `FF_Student_Transfer`, `FF_Student_Grading` |
| Staff | `FF_Staff_HR`, `FF_Staff_Payroll`, `FF_Staff_Transfer` |
| Attendance | `FF_Attendance_Biometric`, `FF_Attendance_GPS`, `FF_Attendance_Evening_Weekend` |
| LMS | `FF_LMS_Zoom`, `FF_LMS_GoogleDrive`, `FF_LMS_Grading` |
| Finance | `FF_Finance_Private`, `FF_Finance_Public`, `FF_Finance_Tertiary` |
| Communication | `FF_Chat_WhatsApp`, `FF_Call_Zoom`, `FF_GoogleCalendar`, `FF_Email_SendGrid`, `FF_FacebookIntegration` |
| Facilities | `FF_Library_QR`, `FF_Hostel_Management`, `FF_Transport_GPS` |
| Reports | `FF_Reports_Export`, `FF_Reports_GoogleDataStudio` |
| Transcripts | `FF_Transcript_Generation`, `FF_Transcript_Payment` |
| Grading | `FF_Grading_Primary`, `FF_Grading_Secondary`, `FF_Grading_Tertiary` |
| Notifications | `FF_Notifications_Push`, `FF_Notifications_SMS`, `FF_Notifications_Email`, `FF_Notifications_WhatsApp`, `FF_Notifications_Social` |
| Admissions | `FF_Admissions_International`, `FF_Exams_National` |

### Test Requirements

Tests must validate:
- Enabled state
- Disabled state
- Role-based visibility
- Mobile/tablet variations
- API enforcement

**No feature exists without flag validation.**

---

## 9. Core Modules

### 9.1 School & Branch Management

- Multi-campus, multi-branch setup
- Regional grading templates (WAEC, NECO, BECE)
- Branch hierarchy & delegation

**Feature Flags**: `FF_School_Management`, `FF_Branch_Hierarchy`

### 9.2 Student Management

- Digital student profiles with ID & parent linkage
- Attendance, discipline, and academic tracking
- Cross-branch transfer workflow with finance sync
- Uploads: Birth certificates, transcripts, photos
- Bulk import
- Promotion workflow
- Report cards & cumulative reports

#### Assessment by Level

| Level | Assessment Types |
|-------|------------------|
| Primary | Classwork, homework, projects, behavior, sports |
| Secondary | Assignments, quizzes, labs, exams, weekend classes |
| Tertiary | Coursework, mid/final exams, internships, presentations |

**Feature Flags**: `FF_Student_Profile`, `FF_Student_Transfer`, `FF_Student_Grading`

### 9.3 Staff & HR Management

- HR profiles, attendance & payroll
- Transfers across branches
- Leave management & performance review
- Discipline tracking

**Feature Flags**: `FF_Staff_HR`, `FF_Staff_Payroll`, `FF_Staff_Transfer`

### 9.4 Attendance Management

- Modes: Manual, Biometric, GPS
- Lesson-level & sessional attendance
- Real-time attendance dashboards
- Evening/weekend class tracking

**Feature Flags**: `FF_Attendance_Biometric`, `FF_Attendance_GPS`, `FF_Attendance_Evening_Weekend`

### 9.5 Academics & LMS

- Timetables, grading, assignments
- Zoom for live classes
- Google Drive for file sharing
- Multimedia LMS CMS
- Document editor (DocEditor)
- Interactive whiteboard

**Feature Flags**: `FF_LMS_Zoom`, `FF_LMS_GoogleDrive`, `FF_LMS_Grading`

### 9.6 Finance & Accounts

Supports multi-term billing, receipts, waivers, installment plans, and tenant-level finance analytics.

| Level | Fee Types | Integration | Flag |
|-------|-----------|-------------|------|
| Primary (Private) | Tuition, PTA, meals, transport | Paystack/Interswitch | `FF_Finance_Private` |
| Secondary (Public) | Exam levies | CSV/Offline | `FF_Finance_Public` |
| Tertiary | Tuition, hostel, convocation, transcript | Paystack/Bank API | `FF_Finance_Tertiary` |

### 9.7 Communication Suite

| Feature | Integration | Flag |
|---------|-------------|------|
| Chat | WhatsApp API | `FF_Chat_WhatsApp` |
| Video | Zoom / WebRTC / Agora | `FF_Call_Zoom` |
| Calendar | Google Calendar | `FF_GoogleCalendar` |
| Email | SendGrid | `FF_Email_SendGrid` |
| Social Feed | Facebook/Instagram | `FF_FacebookIntegration` |

### 9.8 Library, Hostel & Transport

- QR code-based library issue/return
- Hostel allocation & visitor management
- GPS transport tracking & OTP-based pickup

**Feature Flags**: `FF_Library_QR`, `FF_Hostel_Management`, `FF_Transport_GPS`

### 9.9 Reports & Analytics

- Tenant-level dashboards
- Performance metrics per term/branch
- Export: PDF/Excel
- Google Data Studio integration

**Feature Flags**: `FF_Reports_GoogleDataStudio`, `FF_Reports_Export`

### 9.10 Transcript & Certification

- Generate transcripts across education levels
- Include attendance, discipline, weekend/evening programs
- Integrated payment workflow (Paystack, Interswitch)
- Output formats: PDF, Excel

**Feature Flags**: `FF_Transcript_Generation`, `FF_Transcript_Payment`

### 9.11 Adaptive Grading Framework (AGE)

| Level | Component | Weight | Output | Flag |
|-------|-----------|--------|--------|------|
| Primary | Classwork, Tests, Projects, Behavior, Exams | 20/20/10/10/40 | Numeric + Remarks | `FF_Grading_Primary` |
| Secondary | Tests, Assignments, Practicals, Exam | 15/10/10/50 | WAEC-style (A1–F9) | `FF_Grading_Secondary` |
| Tertiary | CA, Lab, Mid Exam, Final Exam | 30/10/20/40 | GPA (A–F) | `FF_Grading_Tertiary` |

### 9.12 Admissions

- National and international admission workflows
- **Nigeria**: NCEE, BECE, WAEC/NECO, UTME, JUPEB, ND
- **International**: IB, SAT, ACT, GRE, GMAT, IELTS, TOEFL

**Feature Flags**: `FF_Admissions_International`, `FF_Exams_National`

### 9.13 Inventory Management

- School supplies tracking
- Asset management
- Procurement workflow

**Feature Flags**: `FF_Inventory_Management` (new)

### Module Requirements

Each module must include:
- CRUD operations
- Validation logic
- Role-based access tests
- Feature flag tests
- Integration tests
- E2E tests
- Visual regression baselines
- Mobile & Tablet validation

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

## 11. Device Support Model

Educo supports three device classes as first-class targets:

| Device | Width | Priority |
|--------|-------|----------|
| Mobile | ≤ 768px | Portrait-first |
| Tablet | 769px–1024px | Landscape-first, hybrid productivity |
| Desktop | ≥ 1025px | Full density |

**Tablet is NOT scaled mobile. Tablet is a hybrid productivity layout.**

### 11.1 Mobile Requirements

- Single-column layouts
- Drawer navigation
- Large tap targets
- Portrait-first design
- Keyboard-safe forms
- Touch interactions

Must test: Portrait, small screens, drawer behavior, overflow prevention.

### 11.2 Tablet Requirements (First-Class Support)

- Collapsible sidebar
- Mini-sidebar mode
- 2–3 column layouts
- Landscape-first optimization
- Touch-first interaction
- Expanded data tables
- Inline editing where applicable

**Portrait Mode**: 2 cards per row, collapsed sidebar
**Landscape Mode**: 3–4 cards per row, expanded sidebar, multi-column forms

Playwright must simulate tablet resolutions and orientations.

### 11.3 Desktop Requirements

- Full sidebar
- Multi-column forms
- Maximum data density
- Advanced reporting layouts
- Bulk operations

---

## 12. Mobile App (React Native / Expo)

| User | Features | Integrations |
|------|----------|--------------|
| Student | Timetable, results, payments, reports | Zoom, Google |
| Parent | Progress, chat, fees, leave requests, receipts | WhatsApp, Paystack |
| Teacher | Attendance, grading, messages | Zoom, WhatsApp |
| Admin | Analytics, approvals | Google, Facebook |

### Current Mobile Screens (Implemented)

- Home dashboard
- Children management
- Fee information & payment history
- Messaging
- Reports & report details
- Term progress
- 11+ modal components (PayFees, ViewReceipt, LeaveRequest, etc.)

---

## 13. Automated Testing Framework

### Primary Frameworks

- **Unit/Component**: Vitest + React Testing Library
- **E2E**: Playwright

### Testing occurs at five levels:

#### Level 1 — Unit Testing

Must cover:
- Utility functions
- Validation functions
- GPA/finance calculations
- Tenant configuration resolvers
- Permission resolvers
- Feature flag evaluators
- Device detection logic

**Coverage: 100% for logic layers.**

#### Level 2 — Component Testing

Must verify:
- Rendering
- Props
- State transitions
- Conditional rendering
- Exact text labels
- Disabled/loading/error states
- Breakpoint behavior

#### Level 3 — Integration Testing

Validate:
- UI → API
- API → DB
- Tenant config → logic
- Feature flag → UI
- Role → route enforcement

#### Level 4 — End-to-End Testing (Playwright)

Must test:
- Full workflows
- Multi-role interaction
- Cross-module operations
- Mobile viewports
- Tablet portrait & landscape
- Desktop flows
- Cross-tenant access attempts
- Feature flag variations

#### Level 5 — Visual Regression

Every major screen must:
- Capture baseline screenshot
- Compare on CI
- Fail on layout drift

Separate baselines required for:
- Mobile
- Tablet portrait
- Tablet landscape
- Desktop

### Coverage Thresholds

| Layer | Required |
|-------|----------|
| Utility logic | 100% |
| Permission logic | 100% |
| Feature flags | 100% |
| API endpoints | 100% |
| Critical workflows | 100% |
| UI components | 95%+ |
| Overall coverage | 95%+ |

**CI fails below thresholds.**

---

## 14. Security Testing

Must test:
- XSS prevention
- SQL injection prevention
- CSRF protection
- Tenant isolation
- Role escalation attempts
- Direct route access bypass

---

## 15. Cross-Tenant Isolation

Must validate:
- Tenant A cannot access Tenant B data
- Configs isolated
- Branding isolated
- Feature flags isolated
- Finance rules isolated
- Grading isolated

Playwright must simulate cross-tenant login attempts.

---

## 16. Requirement Fidelity Framework

For every new UI or function:
1. Extract exact request
2. Convert to structured acceptance criteria
3. Generate tests directly from criteria
4. Implement feature
5. Validate 1:1 mapping
6. Fail build if any requirement unmet

Exact wording, layout, rounding, order, and role rules must be verified. No interpretation allowed.

---

## 17. Zero-Assumption Policy

Claude must never:
- Rename fields without approval
- Reword labels
- Change layout structure
- Simplify logic
- Add undocumented behavior

Ambiguity requires clarification.

---

## 18. Self-Correcting AI Loop

Before commit:
1. Compare requirement → tests
2. Compare tests → implementation
3. Detect drift
4. Run all layers
5. Fix root cause
6. Commit only if all pass

**Tests may never be disabled to pass builds.**

---

## 19. CI/CD Enforcement

On every commit:
1. Run unit tests
2. Run component tests
3. Run integration tests
4. Run Playwright E2E
5. Run visual regression
6. Validate coverage
7. Detect requirement drift

**Deployment blocked if any fail.**

---

## 20. Definition of Done

Feature is complete ONLY if:

- [ ] Requirement spec structured
- [ ] Tests generated from every requirement line
- [ ] Implementation complete
- [ ] All test layers passing
- [ ] Visual baseline recorded
- [ ] Coverage thresholds met
- [ ] CI green
- [ ] Tenant-level behavior validated
- [ ] Mobile & Tablet validated (if UI)
- [ ] No requirement drift detected

---

## 21. Regional Rollout Strategy

| Phase | Region | Currency | Payment Gateway | Exams Support | Status |
|-------|--------|----------|-----------------|---------------|--------|
| 1 | Nigeria | NGN | Paystack, Interswitch | WAEC, NECO, JAMB, BECE | MVP Target |
| 2 | Ghana | GHS | Pending | WASSCE, BECE | Planned |
| 3 | Kenya | KES | M-Pesa (Pending) | KCPE, KCSE | Planned |
| 4 | South Africa | ZAR | Pending | NSC, CAPS | Planned |
| 4 | Uganda | UGX | Pending | UNEB | Planned |

---

## 22. Future Enhancements

- AI-based grading & prediction insights
- Blockchain transcript validation
- WAEC, NECO, JAMB API integrations
- Integration monitoring dashboard
- WhatsApp chatbot for parents
- A/B testing framework
- Feature flag audit logging

---

## 23. Final System State

Educo v7.0 is:

- Multi-tenant (schema isolated)
- Tenant-configurable application engine
- Feature-flag modular (40+ flags)
- Role & permission enforced
- Mobile-first
- Tablet-optimized (first-class support)
- Desktop-complete
- Deeply tested to lowest function
- Requirement-fidelity enforced
- Cross-tenant secure
- CI/CD gated
- AI self-correcting
- Enterprise SaaS ready

---

## Summary

This document defines a:

- Fully configurable multi-tenant ERP SaaS
- Adaptive device-aware UI system (Mobile, Tablet, Desktop)
- Strict requirement validation engine
- Deep automated testing governance (5 levels)
- Cross-tenant isolation model
- Enterprise-grade deployment standard

Educo is architected not just to work — but to be provably correct, configurable per tenant, and stable across mobile, tablet, and desktop.
