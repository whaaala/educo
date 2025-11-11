# Transfer Integration Guide

## Overview
This guide explains how to integrate the Transfer Modal on the student profile page to submit transfer requests that appear in the Transfer Requests table.

## What's Already Set Up

1. **TransferContext** ([contexts/TransferContext.tsx](contexts/TransferContext.tsx))
   - Manages global transfer request state
   - Provides `addTransferRequest()` method
   - Already added to app layout

2. **TransferModal** ([components/shared/TransferModal.tsx](components/shared/TransferModal.tsx))
   - Reusable transfer modal component
   - Uses FormInput (with ModernCalendar), FormDropdown, and FormTextarea
   - Calendar works properly in modals with limited screen height

3. **Transfer Requests Page** ([app/students/transfers/page.tsx](app/students/transfers/page.tsx))
   - Already connected to TransferContext
   - Automatically displays new transfer requests

## How to Integrate on Student Profile Page

### Step 1: Import Required Components and Hooks

```typescript
import { useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import TransferModal, { TransferFormData } from "@/components/shared/TransferModal";
import TransferSuccessModal, { createTransferField } from "@/components/shared/TransferSuccessModal";
import { useTransfers } from "@/contexts/TransferContext";
import { useRouter } from "next/navigation";
```

### Step 2: Add State and Hooks

```typescript
const { addTransferRequest } = useTransfers();
const router = useRouter();
const [showTransferModal, setShowTransferModal] = useState(false);
const [showSuccessModal, setShowSuccessModal] = useState(false);
const [submittedTransferData, setSubmittedTransferData] = useState<TransferFormData | null>(null);
```

### Step 3: Create Submit Handler

```typescript
const handleTransferSubmit = (transferData: TransferFormData) => {
  // Add the transfer request to global state
  addTransferRequest(
    {
      studentId: student.id,
      studentName: student.name,
      studentAdmissionNumber: student.admissionNumber,
      studentClass: student.class,
      studentSection: student.section,
    },
    transferData
  );

  // Close transfer modal and show success modal
  setShowTransferModal(false);
  setSubmittedTransferData(transferData);
  setShowSuccessModal(true);
};
```

### Step 4: Add Transfer Button to UI

```tsx
<button
  onClick={() => setShowTransferModal(true)}
  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors cursor-pointer"
>
  <ArrowRightLeft className="w-4 h-4" />
  Transfer Student
</button>
```

### Step 5: Add Modal Components

```tsx
{/* Transfer Modal */}
<TransferModal
  isOpen={showTransferModal}
  onClose={() => setShowTransferModal(false)}
  onSubmit={handleTransferSubmit}
  currentClass={student.class}
  currentSection={student.section}
  studentName={student.name}
  admissionNumber={student.admissionNumber}
/>

{/* Success Modal */}
{submittedTransferData && (
  <TransferSuccessModal
    isOpen={showSuccessModal}
    onClose={() => {
      setShowSuccessModal(false);
      // Optional: navigate to transfers page
      // router.push("/students/transfers");
    }}
    fields={[
      createTransferField(
        <ArrowRightLeft className="w-4 h-4 text-blue-600" />,
        "Transfer Type",
        submittedTransferData.transferType
      ),
      createTransferField(
        <School className="w-4 h-4 text-green-600" />,
        "Destination",
        `Class ${submittedTransferData.destinationClass}, Section ${submittedTransferData.destinationSection}`
      ),
      createTransferField(
        <Calendar className="w-4 h-4 text-purple-600" />,
        "Effective Date",
        submittedTransferData.effectiveDate
      ),
    ]}
  />
)}
```

## Complete Example

Here's a complete example of how it looks on a student profile page:

```typescript
"use client";

import { useState } from "react";
import { ArrowRightLeft, School, Calendar } from "lucide-react";
import TransferModal, { TransferFormData } from "@/components/shared/TransferModal";
import TransferSuccessModal, { createTransferField } from "@/components/shared/TransferSuccessModal";
import { useTransfers } from "@/contexts/TransferContext";

export default function StudentProfilePage({ params }: { params: { id: string } }) {
  const { addTransferRequest } = useTransfers();
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedTransferData, setSubmittedTransferData] = useState<TransferFormData | null>(null);

  // Mock student data - replace with actual data fetch
  const student = {
    id: params.id,
    name: "John Doe",
    admissionNumber: "AD9892525",
    class: "Primary 5",
    section: "A",
  };

  const handleTransferSubmit = (transferData: TransferFormData) => {
    addTransferRequest(
      {
        studentId: student.id,
        studentName: student.name,
        studentAdmissionNumber: student.admissionNumber,
        studentClass: student.class,
        studentSection: student.section,
      },
      transferData
    );

    setShowTransferModal(false);
    setSubmittedTransferData(transferData);
    setShowSuccessModal(true);
  };

  return (
    <div>
      {/* Student Profile Content */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowTransferModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors cursor-pointer"
        >
          <ArrowRightLeft className="w-4 h-4" />
          Transfer Student
        </button>
      </div>

      {/* Transfer Modal */}
      <TransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        onSubmit={handleTransferSubmit}
        currentClass={student.class}
        currentSection={student.section}
        studentName={student.name}
        admissionNumber={student.admissionNumber}
      />

      {/* Success Modal */}
      {submittedTransferData && (
        <TransferSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          fields={[
            createTransferField(
              <ArrowRightLeft className="w-4 h-4 text-blue-600" />,
              "Transfer Type",
              submittedTransferData.transferType
            ),
            createTransferField(
              <School className="w-4 h-4 text-green-600" />,
              "Destination",
              `Class ${submittedTransferData.destinationClass}, Section ${submittedTransferData.destinationSection}`
            ),
            createTransferField(
              <Calendar className="w-4 h-4 text-purple-600" />,
              "Effective Date",
              submittedTransferData.effectiveDate
            ),
          ]}
        />
      )}
    </div>
  );
}
```

## What Happens When Submit is Clicked

1. User fills out transfer form and clicks "Submit Transfer Request"
2. `handleTransferSubmit()` is called with the transfer data
3. `addTransferRequest()` adds the request to global TransferContext
4. Transfer modal closes, success modal opens
5. Request immediately appears in the Transfer Requests table ([/students/transfers](http://localhost:3000/students/transfers))
6. Request has status "pending" and can be approved/rejected from the table

## Key Features

- **Real-time updates**: Transfer requests appear immediately in the table
- **Persistent state**: Requests persist during the session (add API integration for permanent storage)
- **Modal calendar**: Works properly even with limited screen height
- **Form validation**: Smart validation based on transfer type
- **Success feedback**: Shows confirmation modal after submission

## Next Steps

1. Add the integration code to your student profile page (`app/students/[id]/page.tsx`)
2. Test by creating a transfer request
3. Navigate to [/students/transfers](http://localhost:3000/students/transfers) to see the new request
4. Add API integration to persist transfer requests to your database
