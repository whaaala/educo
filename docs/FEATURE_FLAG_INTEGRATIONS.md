# Feature Flag Integrations - Student Management

## Overview

This document tracks all feature flag integrations implemented in the student management module, showing how features are controlled based on tenant configuration.

---

## Integrated Feature Flags

### 1. **FF_Student_Profile** - Student Profile Management

**Status:** ✅ Integrated

**Controls:**
- Adding new students
- Editing student profiles
- Deleting students
- Viewing student details

**Implementation Locations:**

#### [components/students/StudentCard.tsx:32-61](../components/students/StudentCard.tsx#L32-L61)
```typescript
const { canManageProfile, tenantContext } = useFeatureFlags();

const handleEdit = (id: string) => {
  // Feature flag check: Only allow editing if FF_Student_Profile is enabled
  if (!canManageProfile) {
    console.warn(`Student profile management is not enabled for ${tenantContext.institutionType} institutions`);
    return;
  }
  router.push(`/students/edit/${id}`);
};

const handleDelete = (id: string) => {
  // Feature flag check: Only allow deletion if FF_Student_Profile is enabled
  if (!canManageProfile) {
    console.warn(`Student profile management is not enabled for ${tenantContext.institutionType} institutions`);
    return;
  }
  // Delete logic...
};
```

#### [app/students/page.tsx:785-792](../app/students/page.tsx#L785-L792)
```typescript
const handleAddStudent = () => {
  // Feature flag check: Only allow adding students if FF_Student_Profile is enabled
  if (!featureFlags.canManageProfile) {
    alert(`Student profile management is not enabled for ${settings.institutionType} institutions in ${settings.region}`);
    return;
  }
  router.push('/students/add');
};
```

**User Experience:**
- If disabled: Alert shown when trying to add/edit/delete students
- Edit/Delete buttons still visible but non-functional (with console warnings)
- Alternative: Could hide buttons entirely using feature guards

---

### 2. **FF_Reports_Export** - Export Functionality

**Status:** ✅ Integrated

**Controls:**
- PDF export of student lists
- Excel export of student lists
- Print functionality

**Implementation Locations:**

#### [app/students/page.tsx:756-782](../app/students/page.tsx#L756-L782)
```typescript
const handleExportPDF = () => {
  // Feature flag check: Only allow exports if FF_Reports_Export is enabled
  if (!featureFlags.canExportReports) {
    alert(`Report export is not enabled for ${settings.institutionType} institutions`);
    return;
  }
  // Export logic...
  exportStudentsToPDF(filteredStudents, filename);
};

const handleExportExcel = () => {
  // Feature flag check: Only allow exports if FF_Reports_Export is enabled
  if (!featureFlags.canExportReports) {
    alert(`Report export is not enabled for ${settings.institutionType} institutions`);
    return;
  }
  // Export logic...
  exportStudentsToExcel(filteredStudents, filename);
};
```

**User Experience:**
- If disabled: Alert shown when trying to export
- Export buttons remain visible but trigger alerts

---

### 3. **FF_Student_Transfer** - Student Transfer

**Status:** ✅ Integrated

**Controls:**
- Cross-branch student transfers
- Class/section change requests
- Internal transfers
- External school transfers
- Transfer history tracking
- Transfer approval workflow

**Implementation Locations:**

#### [components/students/StudentCard.tsx:69-77](../components/students/StudentCard.tsx#L69-L77)
```typescript
const handleTransferClick = () => {
  // Feature flag check: Only allow transfer if FF_Student_Transfer is enabled
  if (!canTransferStudents) {
    console.warn(`Student transfer is not enabled for ${tenantContext.institutionType} institutions`);
    alert(`Student transfer functionality is not enabled for ${tenantContext.institutionType} institutions`);
    return;
  }
  setShowTransferForm(true);
};
```

#### [components/students/StudentCard.tsx:129-138](../components/students/StudentCard.tsx#L129-L138)
```typescript
customActions={
  canTransferStudents
    ? [
        {
          icon: ArrowRight,
          label: "Transfer Student",
          onClick: handleTransferClick,
        },
      ]
    : undefined
}
```

#### [app/students/transfers/page.tsx:44-51](../app/students/transfers/page.tsx#L44-L51)
```typescript
// Check feature flag on transfers management page
useEffect(() => {
  if (isMounted && !canTransferStudents) {
    alert(`Student transfer functionality is not enabled for ${tenantContext.institutionType} institutions`);
    router.push("/students");
  }
}, [isMounted, canTransferStudents, tenantContext, router]);
```

**User Experience:**
- If enabled: "Transfer Student" button appears in student card dropdown menu
- If disabled: Button is hidden and transfer page redirects to students list
- Transfer form includes transfer type selection, destination details, and parent notification
- Admin page shows all transfer requests with filtering and status tracking

**Transfer Types Supported:**
- Section Change (within same class)
- Class Change (different class level)
- Internal Transfer (class + section change)
- Cross-Branch Transfer (to different branch)
- External Transfer (to different school)

**Components Created:**
- `TransferRequestForm.tsx` - Modal form for submitting transfer requests
- `TransferHistory.tsx` - Timeline view of student's transfer history
- `app/students/transfers/page.tsx` - Admin page for managing all transfers

**Data Models:**
- `types/transfer.ts` - Complete TypeScript interfaces for transfer system
- `lib/mockTransferData.ts` - Mock data and helper functions

---

### 4. **FF_Student_Grading** - Student Grading (Planned)

**Status:** 📋 Not Yet Implemented

**Will Control:**
- Entering grades
- Viewing grade history
- Grade calculations
- Report card generation

**Planned Implementation:**
```typescript
// Future implementation
const { canGradeStudents } = useFeatureFlags();

<StudentFeatureGuard feature="FF_Student_Grading">
  <GradingInterface student={student} />
</StudentFeatureGuard>
```

---

## Feature Flag Administration

### Management UI

Location: [app/admin/feature-flags/page.tsx](../app/admin/feature-flags/page.tsx)

**Access:** `http://localhost:3000/admin/feature-flags`

**Features:**
- Toggle feature flags on/off per tenant
- Search and filter flags by category
- View tenant context (ID, region, education level, institution type)
- Save/reset functionality
- Real-time enabled/disabled counts

**Categories:**
- Student Management (3 flags)
- Staff Management (3 flags)
- Finance (3 flags)
- Grading (3 flags)
- LMS & Academics (3 flags)
- Communication (5 flags)
- Attendance (3 flags)
- Facilities (3 flags)
- Reports & Transcripts (4 flags)
- Admissions (2 flags)
- Notifications (5 flags)
- School & Branch (2 flags)

---

## How Feature Flags Work

### 1. **Context-Aware Checking**

Feature flags are automatically checked based on:
- **Education Level**: Primary, Secondary, Tertiary
- **Institution Type**: Public, Private, International
- **Region**: Nigeria, Ghana, Kenya, etc.

Example:
```typescript
// FF_Finance_Private is only enabled for Private & International institutions
// FF_Grading_Primary is only enabled for Primary education level
```

### 2. **Using Feature Flags in Components**

#### Method 1: Direct Hook Usage
```typescript
import { useFeatureFlags } from "@/hooks/useFeatureFlags";

function MyComponent() {
  const { canManageProfile, canTransferStudents } = useFeatureFlags();

  if (!canManageProfile) return null;

  return <EditButton />;
}
```

#### Method 2: Feature Guards
```typescript
import StudentFeatureGuard from "@/components/students/StudentFeatureGuard";

<StudentFeatureGuard feature="FF_Student_Profile">
  <EditStudentForm />
</StudentFeatureGuard>
```

#### Method 3: Conditional Rendering
```typescript
const { isEnabled } = useFeatureFlags();

{isEnabled('FF_Student_Transfer') && <TransferButton />}
```

---

## Testing Feature Flags

### 1. **Toggle in Admin UI**

1. Go to `http://localhost:3000/admin/feature-flags`
2. Find the feature flag (e.g., `FF_Student_Profile`)
3. Click the toggle switch
4. Click "Save Changes"
5. Test the functionality (try to add/edit/delete a student)

### 2. **Test Different Institution Types**

```typescript
// Change institution type to Public
localStorage.setItem('institutionType', 'public');
window.location.reload();

// Check if FF_Finance_Private is disabled for Public institutions
```

### 3. **Test Different Education Levels**

```typescript
// Change to Primary level
localStorage.setItem('educationLevels', JSON.stringify(['Primary']));
window.location.reload();

// Check if FF_Grading_Primary is enabled
```

---

## Best Practices

### ✅ DO

1. **Check flags at action boundaries**
   ```typescript
   const handleDelete = () => {
     if (!canManageProfile) {
       alert('Feature not enabled');
       return;
     }
     // Delete logic
   };
   ```

2. **Provide informative messages**
   ```typescript
   alert(`Student profile management is not enabled for ${institutionType} institutions`);
   ```

3. **Use feature guards for entire sections**
   ```typescript
   <StudentFeatureGuard feature="FF_Student_Transfer">
     <TransferSection />
   </StudentFeatureGuard>
   ```

### ❌ DON'T

1. **Don't skip feature checks**
   ```typescript
   // Bad - no feature check
   const handleDelete = () => {
     deleteStudent(id);
   };
   ```

2. **Don't hardcode institution logic**
   ```typescript
   // Bad - use feature flags instead
   if (institutionType === 'private') {
     // Show feature
   }
   ```

---

## Current Integration Status

| Feature Flag | Status | Location | Notes |
|-------------|--------|----------|-------|
| **FF_Student_Profile** | ✅ Integrated | StudentCard, Students Page | Add/Edit/Delete checks |
| **FF_Reports_Export** | ✅ Integrated | Students Page | PDF/Excel export checks |
| **FF_Student_Transfer** | ✅ Integrated | StudentCard, Transfers Page | Full transfer workflow with 5 transfer types |
| **FF_Student_Grading** | 📋 Planned | - | Ready for implementation |

---

## Roadmap

### Phase 1: Current (Completed)
- ✅ Basic student profile management with feature flags
- ✅ Export functionality with feature flags
- ✅ Feature flag admin UI
- ✅ Documentation

### Phase 2: Next Steps
- [ ] Add feature guards to hide buttons when features are disabled
- [ ] Implement student transfer workflow with FF_Student_Transfer
- [ ] Implement grading system with FF_Student_Grading
- [ ] Add database persistence for feature flag settings per tenant

### Phase 3: Advanced
- [ ] Real-time feature flag updates without page refresh
- [ ] Feature flag usage analytics
- [ ] A/B testing framework
- [ ] Gradual rollout (percentage-based enabling)

---

## Related Documentation

- [Feature Flags Complete Guide](./FEATURE_FLAGS.md)
- [Quick Start Guide](./QUICK_START.md)
- [Implementation Status](./IMPLEMENTATION_STATUS.md)
- [Feature Flags Configuration](../lib/featureFlags.ts)
- [School Settings Context](../contexts/SchoolSettingsContext.tsx)

---

## Support

For questions about feature flag integrations:
1. Check the [Feature Flags Guide](./FEATURE_FLAGS.md)
2. Review the [Quick Start Guide](./QUICK_START.md)
3. Inspect the [Feature Flag Admin UI](http://localhost:3000/admin/feature-flags)
4. Consult the [Implementation Status](./IMPLEMENTATION_STATUS.md)
