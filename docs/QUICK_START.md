# Educo v4.0 Quick Start Guide

## Getting Started with Feature Flags & Multi-Tenant Architecture

This guide will help you quickly integrate feature flags and tenant-aware features into your components.

---

## 1. Basic Feature Check

### In a Component

```typescript
import { useFeatureFlags } from "@/hooks/useFeatureFlags";

function MyComponent() {
  const { isEnabled } = useFeatureFlags();

  return (
    <div>
      {isEnabled('FF_Student_Transfer') && (
        <button>Transfer Student</button>
      )}
    </div>
  );
}
```

### Using Convenient Helpers

```typescript
import { useFeatureFlags } from "@/hooks/useFeatureFlags";

function StudentActions() {
  const {
    canTransferStudents,
    canManageProfile,
    canProcessPrivateFinance,
  } = useFeatureFlags();

  return (
    <>
      {canManageProfile && <EditButton />}
      {canTransferStudents && <TransferButton />}
      {canProcessPrivateFinance && <PaystackButton />}
    </>
  );
}
```

---

## 2. Using Feature Guards

### Simple Guard

```typescript
import StudentFeatureGuard from "@/components/students/StudentFeatureGuard";

function MyPage() {
  return (
    <StudentFeatureGuard feature="FF_Hostel_Management">
      <HostelSection />
    </StudentFeatureGuard>
  );
}
```

### With Fallback

```typescript
<StudentFeatureGuard
  feature="FF_Transport_GPS"
  fallback={<ManualTransportTracking />}
>
  <GPSTransportTracking />
</StudentFeatureGuard>
```

### With Message

```typescript
<StudentFeatureGuard
  feature="FF_Library_QR"
  showMessage={true}
>
  <LibraryQRScanner />
</StudentFeatureGuard>
```

---

## 3. Multiple Features

### OR Logic (Any Feature)

```typescript
import { StudentFeatureGuardAny } from "@/components/students/StudentFeatureGuard";

<StudentFeatureGuardAny
  features={[
    'FF_Finance_Private',
    'FF_Finance_Public',
    'FF_Finance_Tertiary'
  ]}
>
  <PaymentSection />
</StudentFeatureGuardAny>
```

### AND Logic (All Features)

```typescript
import { StudentFeatureGuardAll } from "@/components/students/StudentFeatureGuard";

<StudentFeatureGuardAll
  features={[
    'FF_Transcript_Generation',
    'FF_Transcript_Payment',
    'FF_Finance_Private'
  ]}
>
  <PaidTranscriptDownload />
</StudentFeatureGuardAll>
```

---

## 4. Accessing Tenant Context

```typescript
import { useFeatureFlags } from "@/hooks/useFeatureFlags";

function TenantInfo() {
  const { tenantContext } = useFeatureFlags();

  return (
    <div>
      <p>Tenant: {tenantContext.tenantId}</p>
      <p>Region: {tenantContext.region}</p>
      <p>Education Level: {tenantContext.educationLevel}</p>
      <p>Institution Type: {tenantContext.institutionType}</p>
    </div>
  );
}
```

---

## 5. Server-Side / Utility Functions

```typescript
import { isFeatureEnabled } from "@/lib/featureFlags";

function getPaymentMethods(
  institutionType: InstitutionType,
  educationLevel: EducationLevel
) {
  const methods = [];

  if (isFeatureEnabled('FF_Finance_Private', { institutionType, educationLevel })) {
    methods.push('paystack', 'interswitch', 'flutterwave');
  }

  if (isFeatureEnabled('FF_Finance_Public', { institutionType, educationLevel })) {
    methods.push('offline', 'bulk-upload');
  }

  return methods;
}
```

---

## 6. School Settings Context

```typescript
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";

function SchoolInfo() {
  const { settings } = useSchoolSettings();

  return (
    <div>
      <h1>{settings.schoolName}</h1>
      <p>Type: {settings.institutionType}</p>
      <p>Levels: {settings.supportedLevels.join(', ')}</p>
      <p>Schedule: {settings.scheduleType}</p>
    </div>
  );
}
```

---

## 7. Education Level Utilities

```typescript
import {
  detectEducationLevelFromClass,
  getEducationLevelColor,
  getInstitutionTypeColor
} from "@/utils/educationLevel";

// Auto-detect education level
const level = detectEducationLevelFromClass("VI, A"); // Returns "Secondary"

// Get colors for badges
const levelColors = getEducationLevelColor("Primary");
// Returns: { bg, text, border, icon }

const typeColors = getInstitutionTypeColor("Private");
// Returns: { bg, text, border, icon }
```

---

## 8. Common Patterns

### Conditional Rendering Based on Level

```typescript
function StudentGrading({ student }: { student: Student }) {
  const { tenantContext } = useFeatureFlags();

  if (tenantContext.educationLevel === 'Primary') {
    return <PrimaryGradingInterface student={student} />;
  }

  if (tenantContext.educationLevel === 'Secondary') {
    return <SecondaryGradingInterface student={student} />;
  }

  if (tenantContext.educationLevel === 'Tertiary') {
    return <TertiaryGradingInterface student={student} />;
  }

  return null;
}
```

### Level-Specific Feature Checks

```typescript
function GradingSection() {
  const {
    canUsePrimaryGrading,
    canUseSecondaryGrading,
    canUseTertiaryGrading,
  } = useFeatureFlags();

  return (
    <>
      {canUsePrimaryGrading && <PrimaryGradingForm />}
      {canUseSecondaryGrading && <SecondaryGradingForm />}
      {canUseTertiaryGrading && <TertiaryGradingForm />}
    </>
  );
}
```

### Institution-Specific Features

```typescript
function FinanceSection() {
  const { canProcessPrivateFinance, canProcessPublicFinance } = useFeatureFlags();

  return (
    <>
      {canProcessPrivateFinance && (
        <div>
          <PaystackPayment />
          <InterswitchPayment />
          <FlutterwavePayment />
        </div>
      )}

      {canProcessPublicFinance && (
        <div>
          <OfflinePayment />
          <BulkUpload />
        </div>
      )}
    </>
  );
}
```

---

## 9. Testing Features Locally

### Enable a Feature

Edit [lib/featureFlags.ts](../lib/featureFlags.ts):

```typescript
FF_Transport_GPS: {
  enabled: true, // Change to true to test
  description: 'GPS transport tracking',
},
```

### Change School Settings

Edit local storage in browser console:

```javascript
// Set institution type
localStorage.setItem('institutionType', 'public');

// Set education level
localStorage.setItem('educationLevels', JSON.stringify(['Primary']));

// Refresh page
window.location.reload();
```

### Simulate Different Tenants

```typescript
// In development, you can override tenant context
const { settings, updateSettings } = useSchoolSettings();

updateSettings({
  institutionType: 'Public',
  defaultEducationLevel: 'Primary',
  region: 'Kenya',
});
```

---

## 10. Common Feature Flag Groups

### Student Management
- `FF_Student_Profile` - Basic profile management
- `FF_Student_Transfer` - Cross-branch transfers
- `FF_Student_Grading` - Grading and assessment

### Finance Management
- `FF_Finance_Private` - Private institution payments (Paystack, etc.)
- `FF_Finance_Public` - Public institution payments (offline, bulk)
- `FF_Finance_Tertiary` - Tertiary fees (hostel, convocation, transcript)

### Communication
- `FF_Chat_WhatsApp` - WhatsApp integration
- `FF_Call_Zoom` - Zoom integration
- `FF_GoogleCalendar` - Calendar sync
- `FF_Email_SendGrid` - Email notifications

### Grading Systems
- `FF_Grading_Primary` - Primary school grading (numeric + remarks)
- `FF_Grading_Secondary` - Secondary grading (WAEC A1-F9)
- `FF_Grading_Tertiary` - Tertiary grading (GPA 0-5.0)

### Reports & Transcripts
- `FF_Transcript_Generation` - Auto-generate transcripts
- `FF_Transcript_Payment` - Transcript payment integration
- `FF_Reports_Export` - PDF/Excel export

### Facilities
- `FF_Hostel_Management` - Hostel allocation (Secondary & Tertiary)
- `FF_Transport_GPS` - GPS tracking (Future)
- `FF_Library_QR` - Library QR system (Future)

---

## 11. Best Practices

### ✅ DO

```typescript
// Use feature guards for entire sections
<StudentFeatureGuard feature="FF_Hostel_Management">
  <HostelManagementSection />
</StudentFeatureGuard>

// Check features before actions
const handleTransfer = () => {
  if (!canTransferStudents) return;
  // Proceed with transfer
};

// Provide fallbacks
<StudentFeatureGuard feature="FF_Transport_GPS" fallback={<ManualTracking />}>
  <GPSTracking />
</StudentFeatureGuard>
```

### ❌ DON'T

```typescript
// Don't hardcode feature checks
if (schoolType === 'private') {
  // Bad - use feature flags instead
}

// Don't skip feature checks for critical operations
const handleDelete = () => {
  // Bad - should check canManageProfile first
  deleteStudent(id);
};

// Don't render disabled features
{false && <DisabledFeature />} // Bad - use feature guards
```

---

## 12. Debugging

### Check Enabled Features

```typescript
import { useFeatureFlags } from "@/hooks/useFeatureFlags";

function DebugPanel() {
  const { enabledFeatures, tenantContext } = useFeatureFlags();

  return (
    <div>
      <h2>Tenant: {tenantContext.tenantId}</h2>
      <h3>Enabled Features:</h3>
      <ul>
        {enabledFeatures.map(feature => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Log Feature Checks

```typescript
const { isEnabled } = useFeatureFlags();

const featureEnabled = isEnabled('FF_Student_Transfer');
console.log('FF_Student_Transfer enabled:', featureEnabled);
```

---

## 13. Migration Checklist

When adding a new feature:

- [ ] Add feature flag to [lib/featureFlags.ts](../lib/featureFlags.ts)
- [ ] Add helper to [hooks/useFeatureFlags.ts](../hooks/useFeatureFlags.ts)
- [ ] Wrap UI with `<StudentFeatureGuard>`
- [ ] Add feature check in action handlers
- [ ] Update [docs/FEATURE_FLAGS.md](./FEATURE_FLAGS.md)
- [ ] Test with different tenant contexts
- [ ] Add to [docs/IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)

---

## 14. Resources

- [Complete Feature Flags Guide](./FEATURE_FLAGS.md)
- [Implementation Status](./IMPLEMENTATION_STATUS.md)
- [Educo v4.0 PRD](./PRD_v4.md)
- [Feature Flag Configuration](../lib/featureFlags.ts)
- [School Settings Context](../contexts/SchoolSettingsContext.tsx)

---

## Need Help?

1. Check the [Feature Flags Documentation](./FEATURE_FLAGS.md)
2. Review example components in [components/students/](../components/students/)
3. Consult the [PRD](./PRD_v4.md) for feature requirements
4. Ask the development team

---

**Quick Reference:**

```typescript
// Import
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import StudentFeatureGuard from "@/components/students/StudentFeatureGuard";

// Use
const { isEnabled, canTransferStudents } = useFeatureFlags();

// Guard
<StudentFeatureGuard feature="FF_Student_Transfer">
  <TransferButton />
</StudentFeatureGuard>
```

Happy coding! 🚀
