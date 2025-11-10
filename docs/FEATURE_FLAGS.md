# Feature Flags & Multi-Tenant Architecture

## Overview

Educo v4.0 implements a comprehensive feature flag system aligned with a **schema-per-tenant** multi-tenant architecture. This allows for:

- **Modular feature rollout** across different regions (Nigeria, Ghana, Kenya, etc.)
- **Institution-specific features** based on education level and institution type
- **Tenant isolation** with independent schemas for each school
- **Flexible configuration** per tenant without code changes

---

## Architecture

### Multi-Tenant Model

Each school/institution operates in its own PostgreSQL schema:

```typescript
// Tenant context is injected into every API call
app.use((req, res, next) => {
  const tenantId = req.headers['x-tenant-id'];
  setTenantSchema(tenantId);
  next();
});
```

**Benefits:**
- ✅ Full data isolation between schools
- ✅ Independent backups per tenant
- ✅ Custom configuration (grading, branding, payments)
- ✅ Secure row-level access control

### Feature Flag System

Feature flags control which features are available based on:
1. **Education Level**: Primary, Secondary, or Tertiary
2. **Institution Type**: Public, Private, or International
3. **Region**: Nigeria, Ghana, Kenya, South Africa, Uganda, etc.

---

## Implementation

### 1. Feature Flag Configuration

Location: [lib/featureFlags.ts](../lib/featureFlags.ts)

All feature flags follow the `FF_*` naming convention:

```typescript
export type FeatureFlagKey =
  | 'FF_Student_Profile'
  | 'FF_Student_Transfer'
  | 'FF_Finance_Private'
  | 'FF_Grading_Primary'
  // ... and more
```

### 2. School Settings Context

Location: [contexts/SchoolSettingsContext.tsx](../contexts/SchoolSettingsContext.tsx)

The `SchoolSettingsContext` provides tenant-aware feature checking:

```typescript
interface SchoolSettings {
  // Education & Institution
  supportedLevels: EducationLevel[];
  defaultEducationLevel: EducationLevel;
  institutionType: InstitutionType;

  // Multi-tenant
  tenantId?: string;
  region?: string;
  subdomain?: string;
}
```

### 3. Feature Flags Hook

Location: [hooks/useFeatureFlags.ts](../hooks/useFeatureFlags.ts)

Use the `useFeatureFlags` hook in components:

```typescript
import { useFeatureFlags } from "@/hooks/useFeatureFlags";

function StudentTransferButton() {
  const { canTransferStudents, tenantContext } = useFeatureFlags();

  if (!canTransferStudents) return null;

  return <button>Transfer Student</button>;
}
```

---

## Feature Flag Categories

### Student Management

| Flag | Description | Enabled By Default |
|------|-------------|-------------------|
| `FF_Student_Profile` | Student ID & digital profile | ✅ |
| `FF_Student_Transfer` | Cross-branch transfers | ✅ |
| `FF_Student_Grading` | Grading and assessment | ✅ |

### Finance Management

| Flag | Description | Enabled For |
|------|-------------|-------------|
| `FF_Finance_Private` | Paystack/Interswitch integration | Private, International |
| `FF_Finance_Public` | Offline/bulk payments | Public |
| `FF_Finance_Tertiary` | Hostel, convocation, transcript fees | Tertiary |

### Grading Systems

| Flag | Description | Enabled For |
|------|-------------|-------------|
| `FF_Grading_Primary` | Numeric + remarks system | Primary |
| `FF_Grading_Secondary` | WAEC-style A1-F9 | Secondary |
| `FF_Grading_Tertiary` | GPA 0-5.0 | Tertiary |

### Communication

| Flag | Description | Enabled By Default |
|------|-------------|-------------------|
| `FF_Chat_WhatsApp` | WhatsApp Business API | ✅ |
| `FF_Call_Zoom` | Zoom video integration | ✅ |
| `FF_GoogleCalendar` | Google Calendar sync | ✅ |
| `FF_Email_SendGrid` | Email notifications | ✅ |
| `FF_FacebookIntegration` | Social media integration | ❌ (MVP) |

### Facilities

| Flag | Description | Enabled For |
|------|-------------|-------------|
| `FF_Hostel_Management` | Hostel allocation | Secondary, Tertiary |
| `FF_Transport_GPS` | GPS tracking | ❌ (Future) |
| `FF_Library_QR` | QR-based book management | ❌ (Future) |

### Reports & Transcripts

| Flag | Description | Enabled By Default |
|------|-------------|-------------------|
| `FF_Transcript_Generation` | Auto-generate transcripts | ✅ |
| `FF_Transcript_Payment` | Payment integration | ✅ |
| `FF_Reports_Export` | PDF/Excel export | ✅ |
| `FF_Reports_GoogleDataStudio` | Data Studio integration | ❌ (Future) |

---

## Usage Examples

### Basic Feature Check

```typescript
import { useFeatureFlags } from "@/hooks/useFeatureFlags";

function FeesPage() {
  const { canProcessPrivateFinance, canProcessPublicFinance } = useFeatureFlags();

  return (
    <div>
      {canProcessPrivateFinance && <PaystackButton />}
      {canProcessPublicFinance && <BulkUploadButton />}
    </div>
  );
}
```

### Feature Guard Component

```typescript
import StudentFeatureGuard from "@/components/students/StudentFeatureGuard";

function StudentActions() {
  return (
    <>
      <StudentFeatureGuard feature="FF_Student_Transfer">
        <TransferButton />
      </StudentFeatureGuard>

      <StudentFeatureGuard
        feature="FF_Hostel_Management"
        showMessage={true}
      >
        <HostelAllocationButton />
      </StudentFeatureGuard>
    </>
  );
}
```

### Multiple Features (OR Logic)

```typescript
import { StudentFeatureGuardAny } from "@/components/students/StudentFeatureGuard";

function GradingSection() {
  return (
    <StudentFeatureGuardAny
      features={[
        "FF_Grading_Primary",
        "FF_Grading_Secondary",
        "FF_Grading_Tertiary"
      ]}
    >
      <GradingInterface />
    </StudentFeatureGuardAny>
  );
}
```

### Multiple Features (AND Logic)

```typescript
import { StudentFeatureGuardAll } from "@/components/students/StudentFeatureGuard";

function TranscriptPayment() {
  return (
    <StudentFeatureGuardAll
      features={[
        "FF_Transcript_Generation",
        "FF_Transcript_Payment",
        "FF_Finance_Private"
      ]}
    >
      <TranscriptPaymentFlow />
    </StudentFeatureGuardAll>
  );
}
```

### Direct Flag Check

```typescript
import { isFeatureEnabled } from "@/lib/featureFlags";

// Server-side or utility function
function getAvailablePaymentMethods(
  institutionType: InstitutionType,
  educationLevel: EducationLevel
) {
  const methods = [];

  if (isFeatureEnabled('FF_Finance_Private', { institutionType, educationLevel })) {
    methods.push('paystack', 'interswitch');
  }

  if (isFeatureEnabled('FF_Finance_Public', { institutionType, educationLevel })) {
    methods.push('offline', 'bulk');
  }

  return methods;
}
```

---

## Tenant Configuration

### Default Settings

```typescript
const defaultSettings: SchoolSettings = {
  supportedLevels: ["Primary", "Secondary"],
  defaultEducationLevel: "Secondary",
  institutionType: "Private",
  scheduleType: "full-time",
  tenantId: "default",
  region: "Nigeria",
  subdomain: "demo.educo.africa",
};
```

### Custom Tenant Settings

```typescript
// Example: Tertiary institution in Ghana
const ghanaUniversitySettings: SchoolSettings = {
  supportedLevels: ["Tertiary"],
  defaultEducationLevel: "Tertiary",
  institutionType: "Public",
  scheduleType: "full-time",
  tertiaryType: "University",
  tenantId: "ug-ghana-001",
  region: "Ghana",
  subdomain: "ug.educo.africa",
};
```

---

## Regional Rollout Strategy

### Phase 1: Nigeria (MVP)
- ✅ WAEC, NECO, JAMB integration
- ✅ Paystack, Interswitch payments
- ✅ WhatsApp Business API

### Phase 2: Ghana
- WASSCE, BECE integration
- GHS currency support
- Ghana-specific payment gateways

### Phase 3: Kenya
- KCPE, KCSE integration
- KES currency support
- M-Pesa integration

### Phase 4: Other African Countries
- South Africa (NSC, CAPS)
- Uganda (UNEB)
- Additional regional customizations

---

## Best Practices

### 1. Always Use Feature Guards

❌ **Bad:**
```typescript
function StudentPage() {
  return (
    <div>
      <TransferButton /> {/* Always visible */}
    </div>
  );
}
```

✅ **Good:**
```typescript
function StudentPage() {
  return (
    <div>
      <StudentFeatureGuard feature="FF_Student_Transfer">
        <TransferButton />
      </StudentFeatureGuard>
    </div>
  );
}
```

### 2. Provide Fallbacks

```typescript
<StudentFeatureGuard
  feature="FF_Transport_GPS"
  fallback={<ManualAttendanceButton />}
>
  <GPSTrackingButton />
</StudentFeatureGuard>
```

### 3. Check Context

```typescript
const { tenantContext } = useFeatureFlags();

console.log('Current tenant:', tenantContext.tenantId);
console.log('Region:', tenantContext.region);
console.log('Education level:', tenantContext.educationLevel);
```

### 4. Server-Side Checks

For API routes and server actions:

```typescript
import { isFeatureEnabled } from "@/lib/featureFlags";

export async function POST(request: Request) {
  const { institutionType, educationLevel } = await getTenantContext(request);

  if (!isFeatureEnabled('FF_Student_Transfer', { institutionType, educationLevel })) {
    return new Response('Feature not enabled', { status: 403 });
  }

  // Process transfer...
}
```

---

## Testing Feature Flags

### Toggle in Development

Modify [lib/featureFlags.ts](../lib/featureFlags.ts):

```typescript
export const DEFAULT_FEATURE_FLAGS: Record<FeatureFlagKey, FeatureFlagConfig> = {
  FF_Transport_GPS: {
    enabled: true, // Toggle for testing
    description: 'GPS transport tracking',
  },
};
```

### Test Different Contexts

```typescript
import { isFeatureEnabled } from "@/lib/featureFlags";

// Test Primary school
const primaryResult = isFeatureEnabled('FF_Grading_Primary', {
  educationLevel: 'Primary',
  institutionType: 'Private',
});

// Test Tertiary institution
const tertiaryResult = isFeatureEnabled('FF_Finance_Tertiary', {
  educationLevel: 'Tertiary',
  institutionType: 'Public',
});
```

---

## Future Enhancements

1. **Database-driven flags**: Move configuration from code to database per tenant
2. **Admin UI**: Dashboard for Super Admin to manage tenant feature flags
3. **A/B testing**: Gradual rollout with percentage-based enabling
4. **Analytics**: Track feature usage per tenant
5. **API integration**: External service for centralized flag management

---

## Related Documentation

- [Educo v4.0 PRD](../docs/PRD_v4.md)
- [Multi-Tenant Architecture](../docs/MULTI_TENANT.md)
- [Grading Systems](../docs/GRADING.md)
- [Integration Guide](../docs/INTEGRATIONS.md)

---

## Support

For questions or issues with feature flags:
- Check the [Feature Flags Configuration](../lib/featureFlags.ts)
- Review the [School Settings Context](../contexts/SchoolSettingsContext.tsx)
- Consult the [Educo v4.0 PRD](../docs/PRD_v4.md)
