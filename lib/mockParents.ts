// Mock Parents Data for Admin Portal
// This file contains mock data for the admin view of parents

import type { ParentProfile, ParentChild } from "@/types/parent";

export interface AdminParent extends ParentProfile {
  totalOutstandingFees: number;
  totalPaidFees: number;
  lastPaymentDate?: string;
  lastLoginDate?: string;
  communicationPreference: "email" | "sms" | "both";
  status: "Active" | "Inactive";
}

// Mock Children Data - Using actual student IDs from mockStudents.ts
// The IDs match the sampleStudents array: AD9892434, AD9892433, AD9892432, etc.
const MOCK_CHILDREN_DATA: Record<string, ParentChild[]> = {
  "parent-001": [
    {
      id: "AD9892434",
      studentId: "AD9892434",
      firstName: "Janet",
      lastName: "Daniel",
      fullName: "Janet Daniel",
      admissionNumber: "AD9892434",
      classLevel: "JSS 1",
      section: "A",
      profilePhoto: "https://i.pravatar.cc/150?img=1",
      dateOfBirth: "2011-05-15",
      gender: "Female",
      status: "Active",
      relationship: "Father",
    },
    {
      id: "AD9892433",
      studentId: "AD9892433",
      firstName: "Joann",
      lastName: "Michael",
      fullName: "Joann Michael",
      admissionNumber: "AD9892433",
      classLevel: "JSS 2",
      section: "B",
      profilePhoto: "https://i.pravatar.cc/150?img=2",
      dateOfBirth: "2008-09-22",
      gender: "Male",
      status: "Active",
      relationship: "Father",
    },
  ],
  "parent-002": [
    {
      id: "AD9892432",
      studentId: "AD9892432",
      firstName: "Sharon",
      lastName: "Daniel",
      fullName: "Sharon Daniel",
      admissionNumber: "AD9892432",
      classLevel: "JSS 3",
      section: "A",
      profilePhoto: "https://i.pravatar.cc/150?img=3",
      dateOfBirth: "2012-03-10",
      gender: "Female",
      status: "Active",
      relationship: "Mother",
    },
  ],
  "parent-003": [
    {
      id: "AD9892431",
      studentId: "AD9892431",
      firstName: "Steven",
      lastName: "Paul",
      fullName: "Steven Paul",
      admissionNumber: "AD9892431",
      classLevel: "SS 1",
      section: "A",
      profilePhoto: "https://i.pravatar.cc/150?img=4",
      dateOfBirth: "2007-11-08",
      gender: "Male",
      status: "Active",
      relationship: "Father",
    },
    {
      id: "AD9892430",
      studentId: "AD9892430",
      firstName: "Mary",
      lastName: "Helen",
      fullName: "Mary Helen",
      admissionNumber: "AD9892430",
      classLevel: "SS 2",
      section: "B",
      profilePhoto: "https://i.pravatar.cc/150?img=5",
      dateOfBirth: "2010-07-25",
      gender: "Female",
      status: "Active",
      relationship: "Father",
    },
    {
      id: "AD9892429",
      studentId: "AD9892429",
      firstName: "James",
      lastName: "Brown",
      fullName: "James Brown",
      admissionNumber: "AD9892429",
      classLevel: "SS 3",
      section: "A",
      profilePhoto: "https://i.pravatar.cc/150?img=6",
      dateOfBirth: "2014-02-14",
      gender: "Male",
      status: "Active",
      relationship: "Father",
    },
  ],
  "parent-004": [
    {
      id: "AD9892428",
      studentId: "AD9892428",
      firstName: "Lisa",
      lastName: "Wong",
      fullName: "Lisa Wong",
      admissionNumber: "AD9892428",
      classLevel: "JSS 2",
      section: "B",
      profilePhoto: "https://i.pravatar.cc/150?img=7",
      dateOfBirth: "2011-08-30",
      gender: "Female",
      status: "Active",
      relationship: "Mother",
    },
  ],
  "parent-005": [
    {
      id: "AD9892427",
      studentId: "AD9892427",
      firstName: "David",
      lastName: "Lee",
      fullName: "David Lee",
      admissionNumber: "AD9892427",
      classLevel: "SS 1",
      section: "A",
      profilePhoto: "https://i.pravatar.cc/150?img=8",
      dateOfBirth: "2008-12-05",
      gender: "Male",
      status: "Active",
      relationship: "Father",
    },
  ],
  "parent-006": [
    {
      id: "AD9892426",
      studentId: "AD9892426",
      firstName: "Emily",
      lastName: "Chen",
      fullName: "Emily Chen",
      admissionNumber: "AD9892426",
      classLevel: "JSS 1",
      section: "A",
      profilePhoto: "https://i.pravatar.cc/150?img=9",
      dateOfBirth: "2013-04-18",
      gender: "Female",
      status: "Active",
      relationship: "Mother",
    },
    {
      id: "AD9892425",
      studentId: "AD9892425",
      firstName: "Michael",
      lastName: "Chen",
      fullName: "Michael Chen",
      admissionNumber: "AD9892425",
      classLevel: "JSS 3",
      section: "B",
      profilePhoto: "https://i.pravatar.cc/150?img=10",
      dateOfBirth: "2016-01-22",
      gender: "Male",
      status: "Active",
      relationship: "Mother",
    },
  ],
  "parent-007": [
    {
      id: "AD9892424",
      studentId: "AD9892424",
      firstName: "Robert",
      lastName: "Kim",
      fullName: "Robert Kim",
      admissionNumber: "AD9892424",
      classLevel: "SS 2",
      section: "B",
      profilePhoto: "https://i.pravatar.cc/150?img=11",
      dateOfBirth: "2012-09-14",
      gender: "Male",
      status: "Active",
      relationship: "Father",
    },
  ],
  "parent-008": [
    {
      id: "AD9892422",
      studentId: "AD9892422",
      firstName: "Jennifer",
      lastName: "Obi",
      fullName: "Jennifer Obi",
      admissionNumber: "AD9892422",
      classLevel: "SS 3",
      section: "A",
      profilePhoto: "https://i.pravatar.cc/150?img=12",
      dateOfBirth: "2006-06-30",
      gender: "Female",
      status: "Active",
      relationship: "Guardian",
    },
  ],
  "parent-009": [
    {
      id: "AD9892421",
      studentId: "AD9892421",
      firstName: "Grace",
      lastName: "Williams",
      fullName: "Grace Williams",
      admissionNumber: "AD9892421",
      classLevel: "JSS 3",
      section: "A",
      profilePhoto: "https://i.pravatar.cc/150?img=13",
      dateOfBirth: "2010-11-11",
      gender: "Female",
      status: "Active",
      relationship: "Mother",
    },
    {
      id: "AD9892420",
      studentId: "AD9892420",
      firstName: "Peter",
      lastName: "Williams",
      fullName: "Peter Williams",
      admissionNumber: "AD9892420",
      classLevel: "JSS 1",
      section: "A",
      profilePhoto: "https://i.pravatar.cc/150?img=14",
      dateOfBirth: "2012-05-20",
      gender: "Male",
      status: "Active",
      relationship: "Mother",
    },
  ],
  "parent-010": [
    {
      id: "AD9892419",
      studentId: "AD9892419",
      firstName: "Angela",
      lastName: "Okoro",
      fullName: "Angela Okoro",
      admissionNumber: "AD9892419",
      classLevel: "JSS 2",
      section: "A",
      profilePhoto: "https://i.pravatar.cc/150?img=15",
      dateOfBirth: "2015-03-08",
      gender: "Female",
      status: "Active",
      relationship: "Father",
    },
  ],
  "parent-011": [
    {
      id: "AD9892418",
      studentId: "AD9892418",
      firstName: "Mark",
      lastName: "Uche",
      fullName: "Mark Uche",
      admissionNumber: "AD9892418",
      classLevel: "SS 2",
      section: "B",
      profilePhoto: "https://i.pravatar.cc/150?img=16",
      dateOfBirth: "2007-08-17",
      gender: "Male",
      status: "Active",
      relationship: "Father",
    },
  ],
  "parent-012": [
    {
      id: "AD9892417",
      studentId: "AD9892417",
      firstName: "Sandra",
      lastName: "Adeleke",
      fullName: "Sandra Adeleke",
      admissionNumber: "AD9892417",
      classLevel: "JSS 2",
      section: "A",
      profilePhoto: "https://i.pravatar.cc/150?img=17",
      dateOfBirth: "2011-12-03",
      gender: "Female",
      status: "Active",
      relationship: "Mother",
    },
    {
      id: "AD9892416",
      studentId: "AD9892416",
      firstName: "Daniel",
      lastName: "Adeleke",
      fullName: "Daniel Adeleke",
      admissionNumber: "AD9892416",
      classLevel: "JSS 1",
      section: "A",
      profilePhoto: "https://i.pravatar.cc/150?img=18",
      dateOfBirth: "2013-07-19",
      gender: "Male",
      status: "Active",
      relationship: "Mother",
    },
  ],
};

// Mock Parents Data
const MOCK_PARENTS: AdminParent[] = [
  {
    id: "parent-001",
    firstName: "Emeka",
    lastName: "Okonkwo",
    middleName: "Chukwudi",
    email: "emeka.okonkwo@email.com",
    phone: "+234 803 456 7890",
    alternatePhone: "+234 809 123 4567",
    occupation: "Software Engineer",
    address: {
      line1: "15 Victoria Island",
      line2: "Block A, Suite 102",
      city: "Lagos",
      state: "Lagos",
      postalCode: "101001",
      country: "Nigeria",
    },
    profilePhoto: "https://i.pravatar.cc/150?u=parent-emeka",
    relationship: "Father",
    isPrimaryContact: true,
    children: MOCK_CHILDREN_DATA["parent-001"],
    createdAt: "2024-01-05T10:30:00Z",
    updatedAt: "2024-12-15T14:22:00Z",
    totalOutstandingFees: 75000,
    totalPaidFees: 250000,
    lastPaymentDate: "2024-12-10",
    lastLoginDate: "2024-12-20",
    communicationPreference: "email",
    status: "Active",
  },
  {
    id: "parent-002",
    firstName: "Folake",
    lastName: "Adeyemi",
    email: "folake.adeyemi@email.com",
    phone: "+234 802 345 6789",
    occupation: "Medical Doctor",
    address: {
      line1: "22 Ikoyi Crescent",
      city: "Lagos",
      state: "Lagos",
      postalCode: "101233",
      country: "Nigeria",
    },
    profilePhoto: "https://i.pravatar.cc/150?u=parent-folake",
    relationship: "Mother",
    isPrimaryContact: true,
    children: MOCK_CHILDREN_DATA["parent-002"],
    createdAt: "2024-02-10T09:15:00Z",
    updatedAt: "2024-12-18T11:45:00Z",
    totalOutstandingFees: 0,
    totalPaidFees: 180000,
    lastPaymentDate: "2024-12-15",
    lastLoginDate: "2024-12-19",
    communicationPreference: "both",
    status: "Active",
  },
  {
    id: "parent-003",
    firstName: "Babatunde",
    lastName: "Johnson",
    middleName: "Oluwaseun",
    email: "babatunde.johnson@email.com",
    phone: "+234 805 678 9012",
    alternatePhone: "+234 701 234 5678",
    occupation: "Bank Manager",
    address: {
      line1: "45 Lekki Phase 1",
      city: "Lagos",
      state: "Lagos",
      postalCode: "105102",
      country: "Nigeria",
    },
    profilePhoto: "https://i.pravatar.cc/150?u=parent-babatunde",
    relationship: "Father",
    isPrimaryContact: true,
    children: MOCK_CHILDREN_DATA["parent-003"],
    createdAt: "2023-09-15T08:00:00Z",
    updatedAt: "2024-12-20T09:30:00Z",
    totalOutstandingFees: 125000,
    totalPaidFees: 450000,
    lastPaymentDate: "2024-11-28",
    lastLoginDate: "2024-12-20",
    communicationPreference: "email",
    status: "Active",
  },
  {
    id: "parent-004",
    firstName: "Chidinma",
    lastName: "Nwosu",
    email: "chidinma.nwosu@email.com",
    phone: "+234 806 789 0123",
    occupation: "Lawyer",
    address: {
      line1: "8 Awolowo Road",
      city: "Ibadan",
      state: "Oyo",
      postalCode: "200001",
      country: "Nigeria",
    },
    profilePhoto: "https://i.pravatar.cc/150?u=parent-chidinma",
    relationship: "Mother",
    isPrimaryContact: true,
    children: MOCK_CHILDREN_DATA["parent-004"],
    createdAt: "2024-03-01T14:20:00Z",
    updatedAt: "2024-12-12T16:00:00Z",
    totalOutstandingFees: 50000,
    totalPaidFees: 120000,
    lastPaymentDate: "2024-12-01",
    lastLoginDate: "2024-12-18",
    communicationPreference: "sms",
    status: "Active",
  },
  {
    id: "parent-005",
    firstName: "Adebayo",
    lastName: "Bakare",
    email: "adebayo.bakare@email.com",
    phone: "+234 807 890 1234",
    occupation: "Business Owner",
    address: {
      line1: "33 Ahmadu Bello Way",
      city: "Abuja",
      state: "FCT",
      postalCode: "900001",
      country: "Nigeria",
    },
    profilePhoto: "https://i.pravatar.cc/150?u=parent-adebayo",
    relationship: "Father",
    isPrimaryContact: true,
    children: MOCK_CHILDREN_DATA["parent-005"],
    createdAt: "2024-01-20T11:00:00Z",
    updatedAt: "2024-12-19T10:15:00Z",
    totalOutstandingFees: 100000,
    totalPaidFees: 200000,
    lastPaymentDate: "2024-11-15",
    lastLoginDate: "2024-12-15",
    communicationPreference: "email",
    status: "Active",
  },
  {
    id: "parent-006",
    firstName: "Ngozi",
    lastName: "Eze",
    email: "ngozi.eze@email.com",
    phone: "+234 808 901 2345",
    occupation: "Teacher",
    address: {
      line1: "12 Trans-Amadi",
      city: "Port Harcourt",
      state: "Rivers",
      postalCode: "500001",
      country: "Nigeria",
    },
    profilePhoto: "https://i.pravatar.cc/150?u=parent-ngozi",
    relationship: "Mother",
    isPrimaryContact: true,
    children: MOCK_CHILDREN_DATA["parent-006"],
    createdAt: "2024-04-05T13:30:00Z",
    updatedAt: "2024-12-17T08:45:00Z",
    totalOutstandingFees: 25000,
    totalPaidFees: 95000,
    lastPaymentDate: "2024-12-05",
    lastLoginDate: "2024-12-20",
    communicationPreference: "both",
    status: "Active",
  },
  {
    id: "parent-007",
    firstName: "Oluwole",
    lastName: "Afolabi",
    email: "oluwole.afolabi@email.com",
    phone: "+234 809 012 3456",
    occupation: "Civil Servant",
    address: {
      line1: "5 Ring Road",
      city: "Benin City",
      state: "Edo",
      postalCode: "300001",
      country: "Nigeria",
    },
    profilePhoto: "https://i.pravatar.cc/150?u=parent-oluwole",
    relationship: "Father",
    isPrimaryContact: true,
    children: MOCK_CHILDREN_DATA["parent-007"],
    createdAt: "2024-02-28T15:00:00Z",
    updatedAt: "2024-12-10T12:30:00Z",
    totalOutstandingFees: 60000,
    totalPaidFees: 80000,
    lastPaymentDate: "2024-11-20",
    lastLoginDate: "2024-12-14",
    communicationPreference: "sms",
    status: "Active",
  },
  {
    id: "parent-008",
    firstName: "Chinedu",
    lastName: "Obi",
    email: "chinedu.obi@email.com",
    phone: "+234 810 123 4567",
    occupation: "Accountant",
    address: {
      line1: "28 New Haven",
      city: "Enugu",
      state: "Enugu",
      postalCode: "400001",
      country: "Nigeria",
    },
    profilePhoto: "https://i.pravatar.cc/150?u=parent-chinedu",
    relationship: "Guardian",
    isPrimaryContact: true,
    children: MOCK_CHILDREN_DATA["parent-008"],
    createdAt: "2023-11-10T10:00:00Z",
    updatedAt: "2024-12-16T14:00:00Z",
    totalOutstandingFees: 150000,
    totalPaidFees: 300000,
    lastPaymentDate: "2024-10-30",
    lastLoginDate: "2024-12-10",
    communicationPreference: "email",
    status: "Active",
  },
  {
    id: "parent-009",
    firstName: "Titilayo",
    lastName: "Williams",
    email: "titilayo.williams@email.com",
    phone: "+234 811 234 5678",
    alternatePhone: "+234 703 456 7890",
    occupation: "Architect",
    address: {
      line1: "17 Calabar Road",
      city: "Calabar",
      state: "Cross River",
      postalCode: "540001",
      country: "Nigeria",
    },
    profilePhoto: "https://i.pravatar.cc/150?u=parent-titilayo",
    relationship: "Mother",
    isPrimaryContact: true,
    children: MOCK_CHILDREN_DATA["parent-009"],
    createdAt: "2024-01-15T09:45:00Z",
    updatedAt: "2024-12-19T16:20:00Z",
    totalOutstandingFees: 0,
    totalPaidFees: 280000,
    lastPaymentDate: "2024-12-18",
    lastLoginDate: "2024-12-20",
    communicationPreference: "both",
    status: "Active",
  },
  {
    id: "parent-010",
    firstName: "Obinna",
    lastName: "Okoro",
    email: "obinna.okoro@email.com",
    phone: "+234 812 345 6789",
    occupation: "Engineer",
    address: {
      line1: "9 Owerri Road",
      city: "Owerri",
      state: "Imo",
      postalCode: "460001",
      country: "Nigeria",
    },
    profilePhoto: "https://i.pravatar.cc/150?u=parent-obinna",
    relationship: "Father",
    isPrimaryContact: true,
    children: MOCK_CHILDREN_DATA["parent-010"],
    createdAt: "2024-05-20T11:30:00Z",
    updatedAt: "2024-12-14T09:00:00Z",
    totalOutstandingFees: 35000,
    totalPaidFees: 65000,
    lastPaymentDate: "2024-12-08",
    lastLoginDate: "2024-12-16",
    communicationPreference: "email",
    status: "Active",
  },
  {
    id: "parent-011",
    firstName: "Uchenna",
    lastName: "Uche",
    email: "uchenna.uche@email.com",
    phone: "+234 813 456 7890",
    occupation: "Pharmacist",
    address: {
      line1: "44 Kaduna Street",
      city: "Kaduna",
      state: "Kaduna",
      postalCode: "800001",
      country: "Nigeria",
    },
    profilePhoto: "https://i.pravatar.cc/150?u=parent-uchenna",
    relationship: "Father",
    isPrimaryContact: true,
    children: MOCK_CHILDREN_DATA["parent-011"],
    createdAt: "2023-08-25T14:15:00Z",
    updatedAt: "2024-12-11T11:00:00Z",
    totalOutstandingFees: 200000,
    totalPaidFees: 350000,
    lastPaymentDate: "2024-09-25",
    lastLoginDate: "2024-12-05",
    communicationPreference: "sms",
    status: "Active",
  },
  {
    id: "parent-012",
    firstName: "Funmilayo",
    lastName: "Adeleke",
    email: "funmilayo.adeleke@email.com",
    phone: "+234 814 567 8901",
    occupation: "Nurse",
    address: {
      line1: "21 Osogbo Road",
      city: "Osogbo",
      state: "Osun",
      postalCode: "230001",
      country: "Nigeria",
    },
    profilePhoto: "https://i.pravatar.cc/150?u=parent-funmilayo",
    relationship: "Mother",
    isPrimaryContact: true,
    children: MOCK_CHILDREN_DATA["parent-012"],
    createdAt: "2024-02-14T12:00:00Z",
    updatedAt: "2024-12-18T15:30:00Z",
    totalOutstandingFees: 45000,
    totalPaidFees: 155000,
    lastPaymentDate: "2024-12-12",
    lastLoginDate: "2024-12-19",
    communicationPreference: "both",
    status: "Active",
  },
];

// Helper function to get all parents
export function getAllParents(): AdminParent[] {
  return MOCK_PARENTS;
}

// Helper function to get a parent by ID
export function getParentById(id: string): AdminParent | undefined {
  return MOCK_PARENTS.find((parent) => parent.id === id);
}

// Helper function to get parents by status
export function getParentsByStatus(status: "Active" | "Inactive"): AdminParent[] {
  return MOCK_PARENTS.filter((parent) => parent.status === status);
}

// Helper function to get parents with outstanding fees
export function getParentsWithOutstandingFees(): AdminParent[] {
  return MOCK_PARENTS.filter((parent) => parent.totalOutstandingFees > 0);
}

// Helper function to search parents
export function searchParents(query: string): AdminParent[] {
  const lowerQuery = query.toLowerCase();
  return MOCK_PARENTS.filter(
    (parent) =>
      parent.firstName.toLowerCase().includes(lowerQuery) ||
      parent.lastName.toLowerCase().includes(lowerQuery) ||
      parent.email.toLowerCase().includes(lowerQuery) ||
      parent.phone.includes(query) ||
      parent.children.some(
        (child) =>
          child.fullName.toLowerCase().includes(lowerQuery) ||
          child.admissionNumber.toLowerCase().includes(lowerQuery)
      )
  );
}

// Stats for dashboard
export function getParentStats() {
  const totalParents = MOCK_PARENTS.length;
  const activeParents = MOCK_PARENTS.filter((p) => p.status === "Active").length;
  const totalChildren = MOCK_PARENTS.reduce((acc, p) => acc + p.children.length, 0);
  const totalOutstanding = MOCK_PARENTS.reduce((acc, p) => acc + p.totalOutstandingFees, 0);
  const totalPaid = MOCK_PARENTS.reduce((acc, p) => acc + p.totalPaidFees, 0);
  const parentsWithOutstanding = MOCK_PARENTS.filter((p) => p.totalOutstandingFees > 0).length;

  return {
    totalParents,
    activeParents,
    inactiveParents: totalParents - activeParents,
    totalChildren,
    totalOutstanding,
    totalPaid,
    parentsWithOutstanding,
    collectionRate: totalPaid > 0 ? Math.round((totalPaid / (totalPaid + totalOutstanding)) * 100) : 0,
  };
}

// Admin Fee Record Interface
export interface AdminFeeRecord {
  id: string;
  parentId: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  childId: string;
  childName: string;
  childClass: string;
  feeType: "School Fees" | "Bus Fee" | "Exam Fee" | "Library Fee" | "Lab Fee" | "Sports Fee" | "Uniform Fee";
  term: "1st Term" | "2nd Term" | "3rd Term";
  academicYear: string;
  amount: number;
  paidAmount: number;
  balance: number;
  dueDate: string;
  status: "paid" | "partial" | "pending" | "overdue";
  paymentHistory: {
    id: string;
    date: string;
    amount: number;
    method: "Bank Transfer" | "Card" | "Cash" | "USSD" | "POS";
    reference: string;
    receiptNumber: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

// Generate mock fee records for admin view
const generateFeeRecords = (): AdminFeeRecord[] => {
  const feeRecords: AdminFeeRecord[] = [];
  const feeTypes: AdminFeeRecord["feeType"][] = ["School Fees", "Bus Fee", "Exam Fee", "Library Fee", "Lab Fee", "Sports Fee", "Uniform Fee"];
  const terms: AdminFeeRecord["term"][] = ["1st Term", "2nd Term", "3rd Term"];
  const paymentMethods: AdminFeeRecord["paymentHistory"][0]["method"][] = ["Bank Transfer", "Card", "Cash", "USSD", "POS"];

  let recordId = 1;
  let paymentId = 1;

  MOCK_PARENTS.forEach((parent) => {
    parent.children.forEach((child) => {
      // Generate 2-4 fee records per child
      const numRecords = Math.floor(Math.random() * 3) + 2;
      const usedCombinations = new Set<string>();

      for (let i = 0; i < numRecords; i++) {
        // Randomly select fee type and term
        let feeType = feeTypes[Math.floor(Math.random() * feeTypes.length)];
        let term = terms[Math.floor(Math.random() * terms.length)];
        const combo = `${feeType}-${term}`;

        // Ensure unique combination per child
        if (usedCombinations.has(combo)) {
          feeType = feeTypes[(feeTypes.indexOf(feeType) + 1) % feeTypes.length];
        }
        usedCombinations.add(`${feeType}-${term}`);

        // Generate fee amount based on type
        const feeAmounts: Record<string, number> = {
          "School Fees": [120000, 150000, 180000, 200000][Math.floor(Math.random() * 4)],
          "Bus Fee": [25000, 30000, 35000][Math.floor(Math.random() * 3)],
          "Exam Fee": [15000, 20000, 25000][Math.floor(Math.random() * 3)],
          "Library Fee": [5000, 8000, 10000][Math.floor(Math.random() * 3)],
          "Lab Fee": [10000, 15000, 20000][Math.floor(Math.random() * 3)],
          "Sports Fee": [8000, 12000, 15000][Math.floor(Math.random() * 3)],
          "Uniform Fee": [20000, 25000, 30000][Math.floor(Math.random() * 3)],
        };

        const amount = feeAmounts[feeType];

        // Randomly determine payment status
        const statusRoll = Math.random();
        let status: AdminFeeRecord["status"];
        let paidAmount: number;

        if (statusRoll < 0.4) {
          // 40% fully paid
          status = "paid";
          paidAmount = amount;
        } else if (statusRoll < 0.65) {
          // 25% partial
          status = "partial";
          paidAmount = Math.floor(amount * (0.3 + Math.random() * 0.5)); // 30-80% paid
        } else if (statusRoll < 0.85) {
          // 20% pending
          status = "pending";
          paidAmount = 0;
        } else {
          // 15% overdue
          status = "overdue";
          paidAmount = Math.random() < 0.5 ? 0 : Math.floor(amount * Math.random() * 0.3); // 0-30% paid
        }

        const balance = amount - paidAmount;

        // Generate due date
        const termMonths = { "1st Term": 9, "2nd Term": 1, "3rd Term": 4 };
        const dueDate = new Date(2024, termMonths[term], 15);

        // Generate payment history if paid or partial
        const paymentHistory: AdminFeeRecord["paymentHistory"] = [];
        if (paidAmount > 0) {
          const numPayments = status === "paid" ? (Math.random() < 0.7 ? 1 : 2) : (Math.random() < 0.6 ? 1 : 2);
          let remainingPaid = paidAmount;

          for (let j = 0; j < numPayments && remainingPaid > 0; j++) {
            const paymentAmount = j === numPayments - 1 ? remainingPaid : Math.floor(remainingPaid * (0.4 + Math.random() * 0.3));
            remainingPaid -= paymentAmount;

            const paymentDate = new Date(dueDate);
            paymentDate.setDate(paymentDate.getDate() - Math.floor(Math.random() * 30) - (j * 15));

            paymentHistory.push({
              id: `pay-${String(paymentId++).padStart(4, "0")}`,
              date: paymentDate.toISOString().split("T")[0],
              amount: paymentAmount,
              method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
              reference: `REF-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`,
              receiptNumber: `RCP-2024-${String(paymentId).padStart(5, "0")}`,
            });
          }
        }

        feeRecords.push({
          id: `fee-${String(recordId++).padStart(4, "0")}`,
          parentId: parent.id,
          parentName: `${parent.firstName} ${parent.lastName}`,
          parentEmail: parent.email,
          parentPhone: parent.phone,
          childId: child.id,
          childName: child.fullName,
          childClass: `${child.classLevel}${child.section ? `, ${child.section}` : ""}`,
          feeType,
          term,
          academicYear: "2024/2025",
          amount,
          paidAmount,
          balance,
          dueDate: dueDate.toISOString().split("T")[0],
          status,
          paymentHistory: paymentHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
          createdAt: new Date(2024, 7, 1).toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    });
  });

  return feeRecords;
};

// Cached fee records
const MOCK_FEE_RECORDS = generateFeeRecords();

// Get all fee records
export function getAllFeeRecords(): AdminFeeRecord[] {
  return MOCK_FEE_RECORDS;
}

// Get fee records by parent ID
export function getFeeRecordsByParentId(parentId: string): AdminFeeRecord[] {
  return MOCK_FEE_RECORDS.filter((record) => record.parentId === parentId);
}

// Get fee records by child ID
export function getFeeRecordsByChildId(childId: string): AdminFeeRecord[] {
  return MOCK_FEE_RECORDS.filter((record) => record.childId === childId);
}

// Get fee records by status
export function getFeeRecordsByStatus(status: AdminFeeRecord["status"]): AdminFeeRecord[] {
  return MOCK_FEE_RECORDS.filter((record) => record.status === status);
}

// Get overdue fee records
export function getOverdueFeeRecords(): AdminFeeRecord[] {
  return MOCK_FEE_RECORDS.filter((record) => record.status === "overdue");
}

// Get fee stats for admin dashboard
export function getFeeStats() {
  const totalFees = MOCK_FEE_RECORDS.reduce((acc, r) => acc + r.amount, 0);
  const totalCollected = MOCK_FEE_RECORDS.reduce((acc, r) => acc + r.paidAmount, 0);
  const totalOutstanding = MOCK_FEE_RECORDS.reduce((acc, r) => acc + r.balance, 0);
  const paidCount = MOCK_FEE_RECORDS.filter((r) => r.status === "paid").length;
  const partialCount = MOCK_FEE_RECORDS.filter((r) => r.status === "partial").length;
  const pendingCount = MOCK_FEE_RECORDS.filter((r) => r.status === "pending").length;
  const overdueCount = MOCK_FEE_RECORDS.filter((r) => r.status === "overdue").length;

  return {
    totalFees,
    totalCollected,
    totalOutstanding,
    collectionRate: totalFees > 0 ? Math.round((totalCollected / totalFees) * 100) : 0,
    totalRecords: MOCK_FEE_RECORDS.length,
    paidCount,
    partialCount,
    pendingCount,
    overdueCount,
  };
}

// Search fee records
export function searchFeeRecords(query: string): AdminFeeRecord[] {
  const lowerQuery = query.toLowerCase();
  return MOCK_FEE_RECORDS.filter(
    (record) =>
      record.parentName.toLowerCase().includes(lowerQuery) ||
      record.childName.toLowerCase().includes(lowerQuery) ||
      record.parentEmail.toLowerCase().includes(lowerQuery) ||
      record.feeType.toLowerCase().includes(lowerQuery) ||
      record.id.toLowerCase().includes(lowerQuery)
  );
}

// ===== PAYMENT HISTORY =====
export interface PaymentRecord {
  id: string;
  parentId: string;
  childId: string;
  childName: string;
  amount: number;
  feeType: string;
  paymentMethod: "Bank Transfer" | "Card" | "Cash" | "USSD" | "POS";
  reference: string;
  receiptNumber: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

const generatePaymentHistory = (): PaymentRecord[] => {
  const payments: PaymentRecord[] = [];
  const methods: PaymentRecord["paymentMethod"][] = ["Bank Transfer", "Card", "Cash", "USSD", "POS"];
  const feeTypes = ["School Fees", "Bus Fee", "Exam Fee", "Library Fee", "Lab Fee", "Sports Fee", "Uniform Fee"];

  let paymentId = 1;

  MOCK_PARENTS.forEach((parent) => {
    const numPayments = Math.floor(Math.random() * 6) + 3; // 3-8 payments per parent
    parent.children.forEach((child) => {
      for (let i = 0; i < Math.ceil(numPayments / parent.children.length); i++) {
        const date = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
        payments.push({
          id: `pmt-${String(paymentId++).padStart(4, "0")}`,
          parentId: parent.id,
          childId: child.id,
          childName: child.fullName,
          amount: [25000, 50000, 75000, 100000, 150000, 180000][Math.floor(Math.random() * 6)],
          feeType: feeTypes[Math.floor(Math.random() * feeTypes.length)],
          paymentMethod: methods[Math.floor(Math.random() * methods.length)],
          reference: `REF-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`,
          receiptNumber: `RCP-2024-${String(paymentId).padStart(5, "0")}`,
          date: date.toISOString().split("T")[0],
          status: Math.random() < 0.9 ? "completed" : (Math.random() < 0.5 ? "pending" : "failed"),
        });
      }
    });
  });

  return payments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const MOCK_PAYMENT_HISTORY = generatePaymentHistory();

export function getPaymentsByParentId(parentId: string): PaymentRecord[] {
  return MOCK_PAYMENT_HISTORY.filter((p) => p.parentId === parentId);
}

// ===== COMMUNICATIONS / COMPLAINTS =====
export interface CommunicationRecord {
  id: string;
  parentId: string;
  type: "complaint" | "inquiry" | "feedback" | "request" | "meeting_request";
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  resolvedAt?: string;
  assignedTo?: string;
  responses: {
    id: string;
    from: "parent" | "admin";
    message: string;
    date: string;
  }[];
}

const generateCommunications = (): CommunicationRecord[] => {
  const communications: CommunicationRecord[] = [];
  const types: CommunicationRecord["type"][] = ["complaint", "inquiry", "feedback", "request", "meeting_request"];
  const subjects = [
    "Issue with school bus pickup time",
    "Question about exam schedule",
    "Feedback on teaching methods",
    "Request for fee payment plan",
    "Meeting request with class teacher",
    "Concern about cafeteria food quality",
    "Question about extra-curricular activities",
    "Request for academic transcript",
    "Complaint about bullying incident",
    "Inquiry about uniform policy",
  ];
  const statuses: CommunicationRecord["status"][] = ["open", "in_progress", "resolved", "closed"];
  const priorities: CommunicationRecord["priority"][] = ["low", "medium", "high"];

  let commId = 1;

  MOCK_PARENTS.forEach((parent) => {
    const numComms = Math.floor(Math.random() * 4) + 1; // 1-4 communications per parent
    for (let i = 0; i < numComms; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const createdDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);

      const responses: CommunicationRecord["responses"] = [];
      if (status !== "open") {
        responses.push({
          id: `resp-${commId}-1`,
          from: "admin",
          message: "Thank you for reaching out. We are looking into this matter.",
          date: new Date(createdDate.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        });
        if (status === "resolved" || status === "closed") {
          responses.push({
            id: `resp-${commId}-2`,
            from: "admin",
            message: "This issue has been resolved. Please let us know if you need further assistance.",
            date: new Date(createdDate.getTime() + 72 * 60 * 60 * 1000).toISOString(),
          });
        }
      }

      communications.push({
        id: `comm-${String(commId++).padStart(4, "0")}`,
        parentId: parent.id,
        type,
        subject,
        message: `Dear Admin, I would like to bring to your attention regarding ${subject.toLowerCase()}. Please look into this matter at your earliest convenience.`,
        status,
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        createdAt: createdDate.toISOString(),
        resolvedAt: status === "resolved" || status === "closed" ? new Date(createdDate.getTime() + 72 * 60 * 60 * 1000).toISOString() : undefined,
        assignedTo: status !== "open" ? ["Mr. Adeyemi", "Mrs. Okonkwo", "Mr. Johnson", "Mrs. Bakare"][Math.floor(Math.random() * 4)] : undefined,
        responses,
      });
    }
  });

  return communications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

const MOCK_COMMUNICATIONS = generateCommunications();

export function getCommunicationsByParentId(parentId: string): CommunicationRecord[] {
  return MOCK_COMMUNICATIONS.filter((c) => c.parentId === parentId);
}

// ===== PARENT EVENT ATTENDANCE =====
export interface ParentEventAttendance {
  id: string;
  parentId: string;
  childId: string;
  childName: string;
  eventName: string;
  eventType: "parent_teacher_meeting" | "open_day" | "result_collection" | "workshop" | "sports_day" | "graduation";
  eventDate: string;
  attended: boolean;
  notes?: string;
}

const generateEventAttendance = (): ParentEventAttendance[] => {
  const attendance: ParentEventAttendance[] = [];
  const events = [
    { name: "1st Term Parent-Teacher Meeting", type: "parent_teacher_meeting" as const },
    { name: "2nd Term Parent-Teacher Meeting", type: "parent_teacher_meeting" as const },
    { name: "3rd Term Parent-Teacher Meeting", type: "parent_teacher_meeting" as const },
    { name: "Open Day 2024", type: "open_day" as const },
    { name: "1st Term Result Collection", type: "result_collection" as const },
    { name: "2nd Term Result Collection", type: "result_collection" as const },
    { name: "Parenting Workshop", type: "workshop" as const },
    { name: "Annual Sports Day", type: "sports_day" as const },
    { name: "Graduation Ceremony", type: "graduation" as const },
  ];

  let attId = 1;

  MOCK_PARENTS.forEach((parent) => {
    parent.children.forEach((child) => {
      events.forEach((event) => {
        const eventDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
        const attended = Math.random() < 0.7; // 70% attendance rate

        attendance.push({
          id: `att-${String(attId++).padStart(4, "0")}`,
          parentId: parent.id,
          childId: child.id,
          childName: child.fullName,
          eventName: event.name,
          eventType: event.type,
          eventDate: eventDate.toISOString().split("T")[0],
          attended,
          notes: !attended ? ["Sent representative", "Called to apologize", "No response", "Work conflict"][Math.floor(Math.random() * 4)] : undefined,
        });
      });
    });
  });

  return attendance.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
};

const MOCK_EVENT_ATTENDANCE = generateEventAttendance();

export function getEventAttendanceByParentId(parentId: string): ParentEventAttendance[] {
  return MOCK_EVENT_ATTENDANCE.filter((a) => a.parentId === parentId);
}

// ===== LIBRARY PAYMENTS =====
export interface LibraryPayment {
  id: string;
  parentId: string;
  childId: string;
  childName: string;
  bookTitle: string;
  bookId: string;
  paymentType: "book_purchase" | "late_fee" | "damage_fee" | "lost_book";
  amount: number;
  date: string;
  status: "paid" | "pending";
}

const generateLibraryPayments = (): LibraryPayment[] => {
  const payments: LibraryPayment[] = [];
  const books = [
    "Mathematics Textbook Grade 10",
    "English Literature Anthology",
    "Physics Practical Guide",
    "Chemistry Lab Manual",
    "History of Nigeria",
    "Biology for Beginners",
    "French Language Course",
    "Computer Science Fundamentals",
  ];
  const paymentTypes: LibraryPayment["paymentType"][] = ["book_purchase", "late_fee", "damage_fee", "lost_book"];

  let libId = 1;

  MOCK_PARENTS.forEach((parent) => {
    parent.children.forEach((child) => {
      const numPayments = Math.floor(Math.random() * 3) + 1; // 1-3 library payments per child
      for (let i = 0; i < numPayments; i++) {
        const paymentType = paymentTypes[Math.floor(Math.random() * paymentTypes.length)];
        const amounts = {
          book_purchase: [3500, 4500, 5500, 6500][Math.floor(Math.random() * 4)],
          late_fee: [500, 1000, 1500][Math.floor(Math.random() * 3)],
          damage_fee: [2000, 3000, 4000][Math.floor(Math.random() * 3)],
          lost_book: [5000, 7500, 10000][Math.floor(Math.random() * 3)],
        };

        payments.push({
          id: `lib-${String(libId++).padStart(4, "0")}`,
          parentId: parent.id,
          childId: child.id,
          childName: child.fullName,
          bookTitle: books[Math.floor(Math.random() * books.length)],
          bookId: `BK-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`,
          paymentType,
          amount: amounts[paymentType],
          date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split("T")[0],
          status: Math.random() < 0.8 ? "paid" : "pending",
        });
      }
    });
  });

  return payments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const MOCK_LIBRARY_PAYMENTS = generateLibraryPayments();

export function getLibraryPaymentsByParentId(parentId: string): LibraryPayment[] {
  return MOCK_LIBRARY_PAYMENTS.filter((p) => p.parentId === parentId);
}

// ===== LEAVE REQUESTS =====
export interface LeaveRequest {
  id: string;
  parentId: string;
  childId: string;
  childName: string;
  childClass: string;
  leaveType: "sick" | "family_emergency" | "vacation" | "religious" | "other";
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  processedAt?: string;
  processedBy?: string;
  adminNotes?: string;
  documents?: string[];
}

const generateLeaveRequests = (): LeaveRequest[] => {
  const requests: LeaveRequest[] = [];
  const leaveTypes: LeaveRequest["leaveType"][] = ["sick", "family_emergency", "vacation", "religious", "other"];
  const reasons = {
    sick: ["Child is unwell with fever", "Hospital appointment for checkup", "Recovering from surgery", "Dental procedure scheduled"],
    family_emergency: ["Family bereavement", "Urgent family matter", "Relative in hospital"],
    vacation: ["Family vacation abroad", "Visit to hometown", "Cultural event participation"],
    religious: ["Religious observance", "Pilgrimage travel", "Religious festival celebration"],
    other: ["Passport renewal appointment", "Embassy interview", "Participation in national competition"],
  };
  const statuses: LeaveRequest["status"][] = ["pending", "approved", "rejected"];

  let reqId = 1;

  MOCK_PARENTS.forEach((parent) => {
    parent.children.forEach((child) => {
      const numRequests = Math.floor(Math.random() * 3) + 1; // 1-3 leave requests per child
      for (let i = 0; i < numRequests; i++) {
        const leaveType = leaveTypes[Math.floor(Math.random() * leaveTypes.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const startDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
        const endDate = new Date(startDate.getTime() + (Math.floor(Math.random() * 5) + 1) * 24 * 60 * 60 * 1000);
        const requestedDate = new Date(startDate.getTime() - (Math.floor(Math.random() * 7) + 1) * 24 * 60 * 60 * 1000);

        requests.push({
          id: `leave-${String(reqId++).padStart(4, "0")}`,
          parentId: parent.id,
          childId: child.id,
          childName: child.fullName,
          childClass: child.classLevel,
          leaveType,
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
          reason: reasons[leaveType][Math.floor(Math.random() * reasons[leaveType].length)],
          status,
          requestedAt: requestedDate.toISOString(),
          processedAt: status !== "pending" ? new Date(requestedDate.getTime() + 24 * 60 * 60 * 1000).toISOString() : undefined,
          processedBy: status !== "pending" ? ["Principal Adeyemi", "VP Okonkwo", "Dean Johnson"][Math.floor(Math.random() * 3)] : undefined,
          adminNotes: status === "rejected" ? "Request does not meet school leave policy requirements." : undefined,
        });
      }
    });
  });

  return requests.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
};

const MOCK_LEAVE_REQUESTS = generateLeaveRequests();

export function getLeaveRequestsByParentId(parentId: string): LeaveRequest[] {
  return MOCK_LEAVE_REQUESTS.filter((r) => r.parentId === parentId);
}

export function updateLeaveRequestStatus(
  requestId: string,
  status: "approved" | "rejected",
  processedBy: string,
  adminNotes?: string
): LeaveRequest | undefined {
  const request = MOCK_LEAVE_REQUESTS.find((r) => r.id === requestId);
  if (request) {
    request.status = status;
    request.processedAt = new Date().toISOString();
    request.processedBy = processedBy;
    if (adminNotes) request.adminNotes = adminNotes;
  }
  return request;
}

// ===== PARENT-TEACHER MEETINGS =====
export interface ParentTeacherMeeting {
  id: string;
  parentId: string;
  childId: string;
  childName: string;
  childClass: string;
  teacherName: string;
  teacherRole: string;
  meetingType: "scheduled" | "requested" | "follow_up" | "emergency" | "custom";
  customMeetingType?: string;
  meetingFormat?: "in_person" | "virtual";
  virtualType?: "video" | "audio";
  meetingLink?: string;
  subject: string;
  date: string;
  time: string;
  duration: number; // in minutes
  status: "upcoming" | "completed" | "cancelled" | "no_show";
  location: string;
  notes?: string;
  outcome?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
}

const generateMeetings = (): ParentTeacherMeeting[] => {
  const meetings: ParentTeacherMeeting[] = [];
  const teachers = [
    { name: "Mr. Adeyemi Olumide", role: "Class Teacher" },
    { name: "Mrs. Okonkwo Chioma", role: "Mathematics Teacher" },
    { name: "Mr. Johnson Babatunde", role: "English Teacher" },
    { name: "Mrs. Bakare Folake", role: "Science Teacher" },
    { name: "Mr. Eze Chukwuemeka", role: "Principal" },
    { name: "Mrs. Nwosu Adaeze", role: "Vice Principal" },
    { name: "Mr. Afolabi Dayo", role: "Guidance Counselor" },
  ];
  const meetingTypes: ParentTeacherMeeting["meetingType"][] = ["scheduled", "requested", "follow_up", "emergency"];
  const subjects = [
    "Academic Progress Review",
    "Behavioral Concern Discussion",
    "Term Results Discussion",
    "Subject Performance Review",
    "Attendance Discussion",
    "Extra-curricular Activities",
    "Career Guidance Session",
    "Learning Support Plan",
    "Disciplinary Matter",
    "General Check-in",
  ];
  const locations = ["Room 101", "Conference Room A", "Principal's Office", "Staff Room", "Virtual (Zoom)", "Library Meeting Room"];
  const times = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

  let meetId = 1;

  MOCK_PARENTS.forEach((parent) => {
    parent.children.forEach((child) => {
      const numMeetings = Math.floor(Math.random() * 5) + 2; // 2-6 meetings per child
      for (let i = 0; i < numMeetings; i++) {
        const teacher = teachers[Math.floor(Math.random() * teachers.length)];
        const meetingType = meetingTypes[Math.floor(Math.random() * meetingTypes.length)];
        const isPast = Math.random() < 0.6; // 60% past meetings

        let meetingDate: Date;
        let status: ParentTeacherMeeting["status"];

        if (isPast) {
          meetingDate = new Date(2024, Math.floor(Math.random() * 11), Math.floor(Math.random() * 28) + 1);
          const statusRoll = Math.random();
          if (statusRoll < 0.7) {
            status = "completed";
          } else if (statusRoll < 0.85) {
            status = "cancelled";
          } else {
            status = "no_show";
          }
        } else {
          // Future meetings
          meetingDate = new Date(2025, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1);
          status = "upcoming";
        }

        const meeting: ParentTeacherMeeting = {
          id: `meet-${String(meetId++).padStart(4, "0")}`,
          parentId: parent.id,
          childId: child.id,
          childName: child.fullName,
          childClass: child.classLevel,
          teacherName: teacher.name,
          teacherRole: teacher.role,
          meetingType,
          subject: subjects[Math.floor(Math.random() * subjects.length)],
          date: meetingDate.toISOString().split("T")[0],
          time: times[Math.floor(Math.random() * times.length)],
          duration: [15, 30, 45, 60][Math.floor(Math.random() * 4)],
          status,
          location: locations[Math.floor(Math.random() * locations.length)],
        };

        if (status === "completed") {
          meeting.notes = "Meeting conducted successfully. Key points discussed and action items agreed upon.";
          meeting.outcome = ["Positive progress noted", "Areas of improvement identified", "Support plan established", "Follow-up recommended"][Math.floor(Math.random() * 4)];
          meeting.followUpRequired = Math.random() < 0.3;
          if (meeting.followUpRequired) {
            const followUp = new Date(meetingDate.getTime() + 30 * 24 * 60 * 60 * 1000);
            meeting.followUpDate = followUp.toISOString().split("T")[0];
          }
        } else if (status === "cancelled") {
          meeting.notes = ["Rescheduled by parent", "Teacher unavailable", "School holiday", "Emergency closure"][Math.floor(Math.random() * 4)];
        } else if (status === "no_show") {
          meeting.notes = "Parent did not attend. Follow-up contact required.";
        }

        meetings.push(meeting);
      }
    });
  });

  return meetings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const MOCK_MEETINGS = generateMeetings();

export function getMeetingsByParentId(parentId: string): ParentTeacherMeeting[] {
  return MOCK_MEETINGS.filter((m) => m.parentId === parentId);
}

export function getUpcomingMeetingsByParentId(parentId: string): ParentTeacherMeeting[] {
  return MOCK_MEETINGS.filter((m) => m.parentId === parentId && m.status === "upcoming");
}

export function getPastMeetingsByParentId(parentId: string): ParentTeacherMeeting[] {
  return MOCK_MEETINGS.filter((m) => m.parentId === parentId && m.status !== "upcoming");
}

// ===== FEE REMINDERS =====
export type ReminderChannel = "email" | "sms" | "push" | "whatsapp";

export interface ReminderAttachment {
  id: string;
  name: string;
  type: "pdf" | "image" | "document";
  size: string;
  url?: string;
}

export interface FeeReminderRecord {
  id: string;
  feeRecordId: string;
  parentId: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  childId: string;
  childName: string;
  feeType: string;
  amount: number;
  balance: number;
  channels: ReminderChannel[];
  status: "sent" | "scheduled" | "failed" | "delivered";
  sentAt: string;
  scheduledFor?: string;
  deliveredAt?: string;
  messages: Record<string, {
    subject?: string;
    message: string;
    attachmentCount?: number;
    attachments?: ReminderAttachment[];
  }>;
  sentBy: string;
}

// In-memory storage for reminders (in a real app, this would be in a database)
const MOCK_FEE_REMINDERS: FeeReminderRecord[] = [];

// Generate some initial mock reminders for existing fee records
const generateInitialReminders = () => {
  const sampleFees = MOCK_FEE_RECORDS.slice(0, 15).filter(f => f.status !== "paid");
  const channelOptions: ReminderChannel[][] = [
    ["email"],
    ["sms"],
    ["email", "sms"],
    ["email", "whatsapp"],
    ["push"],
    ["email", "sms", "push"],
  ];

  sampleFees.forEach((fee, index) => {
    const channels = channelOptions[index % channelOptions.length];
    const daysAgo = Math.floor(Math.random() * 14) + 1;
    const sentDate = new Date();
    sentDate.setDate(sentDate.getDate() - daysAgo);

    const messages: Record<string, { subject?: string; message: string; attachmentCount?: number; attachments?: ReminderAttachment[] }> = {};
    channels.forEach(channel => {
      if (channel === "email") {
        const hasAttachment = Math.random() > 0.7;
        const attachments: ReminderAttachment[] = hasAttachment ? [
          {
            id: `att-${index}-email-1`,
            name: `Fee_Statement_${fee.childName.replace(/\s/g, "_")}.pdf`,
            type: "pdf",
            size: "125 KB",
          },
        ] : [];
        messages[channel] = {
          subject: `Payment Reminder: ${fee.feeType}`,
          message: `Dear ${fee.parentName}, this is a reminder about the outstanding balance of ${fee.balance} for ${fee.childName}.`,
          attachmentCount: attachments.length,
          attachments,
        };
      } else if (channel === "sms") {
        messages[channel] = {
          message: `Hi ${fee.parentName.split(" ")[0]}, reminder: Outstanding balance for ${fee.childName}. Please pay soon.`,
        };
      } else if (channel === "push") {
        messages[channel] = {
          subject: `Payment Due`,
          message: `${fee.feeType} for ${fee.childName} is due. Tap to view details.`,
        };
      } else if (channel === "whatsapp") {
        const hasAttachment = Math.random() > 0.8;
        const attachments: ReminderAttachment[] = hasAttachment ? [
          {
            id: `att-${index}-whatsapp-1`,
            name: `Payment_Receipt_${fee.feeType.replace(/\s/g, "_")}.pdf`,
            type: "pdf",
            size: "89 KB",
          },
        ] : [];
        messages[channel] = {
          message: `Hello ${fee.parentName}, this is a reminder about your outstanding fee balance.`,
          attachmentCount: attachments.length,
          attachments,
        };
      }
    });

    MOCK_FEE_REMINDERS.push({
      id: `reminder-${String(index + 1).padStart(4, "0")}`,
      feeRecordId: fee.id,
      parentId: fee.parentId,
      parentName: fee.parentName,
      parentEmail: fee.parentEmail,
      parentPhone: fee.parentPhone,
      childId: fee.childId,
      childName: fee.childName,
      feeType: fee.feeType,
      amount: fee.amount,
      balance: fee.balance,
      channels,
      status: Math.random() > 0.1 ? "delivered" : "sent",
      sentAt: sentDate.toISOString(),
      deliveredAt: Math.random() > 0.2 ? new Date(sentDate.getTime() + 60000).toISOString() : undefined,
      messages,
      sentBy: "Admin",
    });

    // Add a second reminder for some records
    if (Math.random() > 0.6 && daysAgo > 5) {
      const secondDaysAgo = daysAgo - Math.floor(Math.random() * 4) - 1;
      const secondSentDate = new Date();
      secondSentDate.setDate(secondSentDate.getDate() - secondDaysAgo);

      MOCK_FEE_REMINDERS.push({
        id: `reminder-${String(MOCK_FEE_REMINDERS.length + 1).padStart(4, "0")}`,
        feeRecordId: fee.id,
        parentId: fee.parentId,
        parentName: fee.parentName,
        parentEmail: fee.parentEmail,
        parentPhone: fee.parentPhone,
        childId: fee.childId,
        childName: fee.childName,
        feeType: fee.feeType,
        amount: fee.amount,
        balance: fee.balance,
        channels: ["email"],
        status: "delivered",
        sentAt: secondSentDate.toISOString(),
        deliveredAt: new Date(secondSentDate.getTime() + 30000).toISOString(),
        messages: {
          email: {
            subject: `Follow-up: ${fee.feeType} Payment`,
            message: `Dear ${fee.parentName}, this is a follow-up reminder about your outstanding balance.`,
          },
        },
        sentBy: "Admin",
      });
    }
  });
};

// Initialize mock reminders
generateInitialReminders();

// Get all reminders
export function getAllFeeReminders(): FeeReminderRecord[] {
  return MOCK_FEE_REMINDERS.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
}

// Get reminders by fee record ID
export function getRemindersByFeeRecordId(feeRecordId: string): FeeReminderRecord[] {
  return MOCK_FEE_REMINDERS.filter(r => r.feeRecordId === feeRecordId)
    .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
}

// Get reminders by parent ID
export function getRemindersByParentId(parentId: string): FeeReminderRecord[] {
  return MOCK_FEE_REMINDERS.filter(r => r.parentId === parentId)
    .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
}

// Get reminder count by fee record ID
export function getReminderCountByFeeRecordId(feeRecordId: string): number {
  return MOCK_FEE_REMINDERS.filter(r => r.feeRecordId === feeRecordId).length;
}

// Get reminder count by parent ID
export function getReminderCountByParentId(parentId: string): number {
  return MOCK_FEE_REMINDERS.filter(r => r.parentId === parentId).length;
}

// Get reminder stats by parent ID
export function getReminderStatsByParentId(parentId: string): {
  total: number;
  byChannel: Record<ReminderChannel, number>;
  lastSentAt?: string;
} {
  const parentReminders = MOCK_FEE_REMINDERS.filter(r => r.parentId === parentId);
  const byChannel: Record<ReminderChannel, number> = {
    email: 0,
    sms: 0,
    push: 0,
    whatsapp: 0,
  };

  parentReminders.forEach(reminder => {
    reminder.channels.forEach(channel => {
      byChannel[channel]++;
    });
  });

  const sorted = parentReminders.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());

  return {
    total: parentReminders.length,
    byChannel,
    lastSentAt: sorted[0]?.sentAt,
  };
}

// Add a new reminder
export function addFeeReminder(reminder: Omit<FeeReminderRecord, "id">): FeeReminderRecord {
  const newReminder: FeeReminderRecord = {
    ...reminder,
    id: `reminder-${String(MOCK_FEE_REMINDERS.length + 1).padStart(4, "0")}-${Date.now()}`,
  };
  MOCK_FEE_REMINDERS.push(newReminder);
  return newReminder;
}
