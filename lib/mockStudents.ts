// Shared mock student data
import { Student } from "@/components/students/StudentCard";

// Timetable interfaces
export interface TimetableEntry {
  day: string;
  periods: Period[];
}

export interface Period {
  time: string;
  subject: string;
  teacher: string;
  teacherAvatar?: string;
  type?: "class" | "break";
}

// Extended student data interface matching the form structure
export interface ExtendedStudentData {
  // Personal Information
  profilePhoto: string | File | null;
  academicYear: string;
  studentNumber?: string;
  admissionNumber: string;
  admissionDate?: string;
  rollNumber: string;
  status: "Active" | "Inactive";

  // NEW: Education Level & Institution Type (PRD Requirements)
  educationLevel?: "Primary" | "Secondary" | "Tertiary";
  institutionType?: "Public" | "Private" | "International";
  schoolType?: string; // For additional school type classification
  branchId?: string; // Multi-campus support

  // NEW: National Exam Numbers (PRD Requirements - varies by education level)
  waecNumber?: string; // West African Examinations Council (Secondary)
  necoNumber?: string; // National Examinations Council (Secondary - Nigeria)
  jambNumber?: string; // Joint Admissions and Matriculation Board (Tertiary entrance - Nigeria)
  matricNumber?: string; // Matriculation number (Tertiary)
  nationalExamNumber?: string; // Generic national exam number (for other countries)

  firstName: string;
  lastName: string;
  middleName?: string;
  class: string;
  section: string;
  gender: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  aadharNumber?: string;
  house?: string;
  religion?: string;
  category?: string;
  primaryContact?: string;
  secondaryContact?: string;
  phone?: string;
  email?: string;
  ethnicGroup?: string;
  motherTongue?: string;
  languagesKnown?: string[];
  caste?: string;
  
  // Primary Address Information
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  addressPhone?: string;
  
  // Secondary Address Information
  secondaryAddressLine1?: string;
  secondaryAddressLine2?: string;
  secondaryCity?: string;
  secondaryState?: string;
  secondaryPostalCode?: string;
  secondaryCountry?: string;
  secondaryAddressPhone?: string;
  
  // Father's Info
  fatherPhoto: string | File | null;
  fatherFirstName?: string;
  fatherLastName?: string;
  fatherMiddleName?: string;
  fatherEmail?: string;
  fatherPhone?: string;
  fatherOccupation?: string;
  fatherEducation?: string;
  fatherAnnualIncome?: string;
  fatherAadhar?: string;
  fatherAddressLine1?: string;
  fatherAddressLine2?: string;
  fatherCity?: string;
  fatherState?: string;
  fatherPostalCode?: string;
  fatherCountry?: string;
  
  // Mother's Info
  motherPhoto: string | File | null;
  motherFirstName?: string;
  motherLastName?: string;
  motherMiddleName?: string;
  motherEmail?: string;
  motherPhone?: string;
  motherOccupation?: string;
  motherEducation?: string;
  motherAnnualIncome?: string;
  motherAadhar?: string;
  motherAddressLine1?: string;
  motherAddressLine2?: string;
  motherCity?: string;
  motherState?: string;
  motherPostalCode?: string;
  motherCountry?: string;
  
  // Guardian Info
  guardianIs?: string;
  guardianPhoto: string | File | null;
  guardianFirstName?: string;
  guardianLastName?: string;
  guardianMiddleName?: string;
  guardianGender?: string;
  guardianRelation?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  guardianOccupation?: string;
  guardianAddress?: string;
  guardianAddressLine1?: string;
  guardianAddressLine2?: string;
  guardianCity?: string;
  guardianState?: string;
  guardianPostalCode?: string;
  guardianCountry?: string;
  
  // Siblings
  siblings?: any[];
  isSiblingStudyingHere?: boolean;
  
  // Address
  currentAddressLine1?: string;
  currentAddressLine2?: string;
  currentCity?: string;
  currentState?: string;
  currentPostalCode?: string;
  currentCountry?: string;
  currentAddressPhone?: string;
  currentPhone?: string;
  sameAsCurrent?: boolean;
  sameAsCurrentAddress?: boolean;
  permanentAddressLine1?: string;
  permanentAddressLine2?: string;
  permanentCity?: string;
  permanentState?: string;
  permanentPostalCode?: string;
  permanentCountry?: string;
  permanentAddressPhone?: string;
  currentAddress?: string;
  permanentAddress?: string;
  
  // Transport
  useTransport?: boolean;
  transportType?: string;
  transportRoute?: string;
  route?: string; // Keep for backward compatibility
  vehicleNumber?: string;
  driverName?: string;
  driverPhone?: string;
  pickupPoint?: string;
  dropoffPoint?: string;
  transportFee?: string;
  
  // Hostel
  useHostel?: boolean;
  hostelName?: string;
  roomNumber?: string;
  bedNumber?: string;
  hostelFee?: string;
  
  // Documents (transcripts, certificates, etc.)
  birthCertificate?: File | null;
  transferCertificate?: File | null;
  immunizationCard?: File | null;
  studentIdProof?: File | null;
  documents?: any[];
  
     // Medical History
   medicalConditions?: string[];
   medicalCondition?: string;
   allergies?: string[];
   medications?: string[];
   currentMedications?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  doctorName?: string;
  doctorPhone?: string;
  hospitalName?: string;
  bloodPressure?: string;
  height?: string;
  weight?: string;
  vision?: string;
  hearing?: string;
  
  // Previous School
  previousSchoolName?: string;
  previousSchoolBoard?: string;
  previousSchoolAddress?: string;
  previousSchoolPhone?: string;
  previousSchoolEmail?: string;
  lastClassAttended?: string;
  lastClassYear?: string;
  lastClassPercentage?: string;
  reasonForLeaving?: string;
  transferCertificateNumber?: string;
  transferCertificateDate?: string;
  
  // Other Details
  notes?: string;
  remarks?: string;
  extraCurricularActivities?: string;
  achievements?: string;
  hobbies?: string;
  bankName?: string;
  branch?: string;
  ifscNumber?: string;
  otherInformation?: string;

  // Timetable
  timetable?: TimetableEntry[];

  // Subject Enrollment
  enrolledSubjects?: string[]; // List of subjects the student is enrolled in
}

// Helper function to parse date string like "10 Jan 2017" to "2017-01-10"
function parseDate(dateStr: string): string {
  try {
    const parts = dateStr.split(' ');
    if (parts.length >= 3) {
      const day = parts[0].padStart(2, '0');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = (monthNames.indexOf(parts[1]) + 1).toString().padStart(2, '0');
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
  } catch (e) {
    // Fallback to current date if parsing fails
  }
  return new Date().toISOString().split("T")[0];
}

// Helper function to generate profile pictures
function getProfilePicture(type: "student" | "father" | "mother" | "guardian", gender: "Male" | "Female", index: number): string {
  // pravatar.cc supports img parameters from 1-70
  // Use modulo to ensure we stay within valid range
  const baseIndex = (index % 70) + 1;
  
  if (type === "father") {
    // For fathers, use range 31-50 (30 + 1 to 30 + 20)
    const imgNum = 30 + ((baseIndex - 1) % 20) + 1;
    return `https://i.pravatar.cc/400?img=${imgNum}`;
  } else if (type === "mother") {
    // For mothers, use range 21-40 (20 + 1 to 20 + 20)
    const imgNum = 20 + ((baseIndex - 1) % 20) + 1;
    return `https://i.pravatar.cc/400?img=${imgNum}`;
  } else if (type === "guardian") {
    return gender === "Male" 
      ? `https://i.pravatar.cc/400?img=${30 + ((baseIndex - 1) % 20) + 1}`
      : `https://i.pravatar.cc/400?img=${20 + ((baseIndex - 1) % 20) + 1}`;
  } else {
    // Student profile picture - use range 1-30 for variety
    return gender === "Female"
      ? `https://i.pravatar.cc/400?img=${((baseIndex - 1) % 30) + 1}`
      : `https://i.pravatar.cc/400?img=${((baseIndex - 1) % 30) + 31}`; // 31-60 for males
  }
}

// Generate realistic data based on student info
function generateExtendedStudentData(student: Student, academicYear: string = "2024/2025"): ExtendedStudentData {
  // Parse class and section from "III, A" format
  const [classNum, section] = student.class.split(", ").map(s => s.trim());
  
  // Parse name into first, middle, last
  const nameParts = student.name.split(' ');
  const firstName = nameParts[0] || "";
  const lastName = nameParts[nameParts.length - 1] || "";
  const middleName = nameParts.slice(1, -1).join(' ') || "";
  
  // Generate index for consistent data - use more digits from ID for better uniqueness
  // Extract last 2-3 digits from student ID for more variation
  const idDigits = student.id.match(/\d+$/)?.[0] || "0";
  const studentIndex = parseInt(idDigits.slice(-3)) % 50; // Use last 3 digits, mod 50 for array bounds
  const gender = student.gender;
  
  // Generate email
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
  
  // Generate parent names based on student name
  const fatherLastName = lastName;
  const fatherFirstName = ["Michael", "James", "David", "John", "Robert", "William", "Richard", "Joseph", "Thomas", "Christopher"][studentIndex % 10];
  const fatherMiddleName = ["James", "Michael", "David", "John"][studentIndex % 4];
  const motherLastName = lastName;
  const motherFirstName = ["Sarah", "Emily", "Jessica", "Amanda", "Jennifer", "Lisa", "Michelle", "Patricia", "Linda", "Elizabeth"][studentIndex % 10];
  const motherMiddleName = ["Mary", "Jane", "Elizabeth", "Anne"][studentIndex % 4];
  
  // Generate realistic addresses
  const addresses = [
    { line1: "123 Main Street", line2: "Apt 4B", city: "Lagos", state: "Lagos", postal: "100001" },
    { line1: "456 Victoria Island", line2: "Suite 200", city: "Lagos", state: "Lagos", postal: "101241" },
    { line1: "789 Ikeja Road", line2: "Block C", city: "Lagos", state: "Lagos", postal: "100271" },
    { line1: "321 Lekki Phase 1", line2: "House 15", city: "Lagos", state: "Lagos", postal: "105102" },
    { line1: "654 Surulere", line2: "Flat 8", city: "Lagos", state: "Lagos", postal: "101283" },
  ];
  const address = addresses[studentIndex % addresses.length];
  
  // Generate phone numbers
  const phoneBase = `+234 80${1 + (studentIndex % 9)} ${100 + studentIndex} ${5000 + studentIndex}`;
  
  // Generate occupations
  const occupations = ["Engineer", "Teacher", "Doctor", "Lawyer", "Business Owner", "Accountant", "Nurse", "Architect", "Banker", "Consultant"];
  const fatherOccupation = occupations[studentIndex % occupations.length];
  const motherOccupation = occupations[(studentIndex + 5) % occupations.length];
  
  // Generate blood groups
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const bloodGroup = bloodGroups[studentIndex % bloodGroups.length];
  
  // Generate religions
  const religions = ["Christian", "Muslim", "Traditional", "Other"];
  const religion = religions[studentIndex % religions.length];
  
        // Generate houses (must match the form's house options)
   const houses = ["Mandela House", "Nyerere House", "Azikiwe House", "Lumumba House"];
   const house = houses[studentIndex % houses.length];
   
   // Generate languages (always ensure it's an array)
   const allLanguages = ["English", "Yoruba", "Hausa", "Igbo", "French", "Spanish"];
   const languagesKnown: string[] = [allLanguages[0], allLanguages[1 + (studentIndex % 3)]].filter(Boolean);
  
  // Calculate approximate date of birth based on class
  const classToAge: Record<string, number> = {
    "I": 5, "II": 6, "III": 7, "IV": 8, "V": 9, "VI": 10, 
    "VII": 11, "VIII": 12, "JSS 1": 11, "JSS 2": 12, "JSS 3": 13,
    "SSS 1": 14, "SSS 2": 15, "SSS 3": 16
  };
  const approximateAge = classToAge[classNum] || 10;
  const currentYear = new Date().getFullYear();
  const birthYear = currentYear - approximateAge;
  const dateOfBirth = `${birthYear}-${String(5 + (studentIndex % 7)).padStart(2, '0')}-${String(10 + (studentIndex % 20)).padStart(2, '0')}`;
  
  return {
    // Personal Information
    profilePhoto: student.avatar || getProfilePicture("student", gender, studentIndex),
    academicYear: academicYear,
    admissionNumber: student.id,
    admissionDate: student.joinedOn ? parseDate(student.joinedOn) : new Date().toISOString().split("T")[0],
    rollNumber: student.rollNo,
    status: student.status,
    firstName,
    lastName,
    middleName: middleName || undefined,
    class: classNum || "",
    section: section || "",
    gender,
    dateOfBirth,
    bloodGroup,
    aadharNumber: `XXXX XXXX ${String(5000 + studentIndex).padStart(4, '0')}`,
    house,
    religion,
    category: "General",
    primaryContact: phoneBase,
    secondaryContact: phoneBase.replace(/\d{4}$/, String(6000 + studentIndex)),
    phone: phoneBase,
    email,
              ethnicGroup: ["Yoruba", "Hausa", "Igbo", "Fulani", "Kanuri"][studentIndex % 5],
     motherTongue: languagesKnown[1] || "English",
     languagesKnown: languagesKnown || [],
     caste: "",
     
     // Primary Address Information
     addressLine1: address.line1,
    addressLine2: address.line2,
    city: address.city,
    state: address.state,
    postalCode: address.postal,
    country: "Nigeria",
    addressPhone: phoneBase,
    
    // Secondary Address Information (optional, same as primary for most)
    secondaryAddressLine1: studentIndex % 3 === 0 ? `456 ${address.city} Road` : undefined,
    secondaryAddressLine2: studentIndex % 3 === 0 ? "Suite 100" : undefined,
    secondaryCity: studentIndex % 3 === 0 ? address.city : undefined,
    secondaryState: studentIndex % 3 === 0 ? address.state : undefined,
    secondaryPostalCode: studentIndex % 3 === 0 ? address.postal : undefined,
    secondaryCountry: studentIndex % 3 === 0 ? "Nigeria" : undefined,
    secondaryAddressPhone: studentIndex % 3 === 0 ? phoneBase.replace(/\d{4}$/, String(7000 + studentIndex)) : undefined,
    
    // Father's Info
    fatherPhoto: getProfilePicture("father", "Male", studentIndex),
    fatherFirstName,
    fatherLastName,
    fatherMiddleName,
    fatherEmail: `${fatherFirstName.toLowerCase()}.${fatherLastName.toLowerCase()}@example.com`,
    fatherPhone: phoneBase.replace(/\d{4}$/, String(8000 + studentIndex)),
    fatherOccupation,
    fatherEducation: ["Bachelor's Degree", "Master's Degree", "Doctorate", "High School", "Diploma"][studentIndex % 5],
    fatherAnnualIncome: [`₦${(5 + studentIndex) * 1000000}`, `₦${(10 + studentIndex) * 1000000}`, `₦${(15 + studentIndex) * 1000000}`][studentIndex % 3],
    fatherAadhar: `XXXX XXXX ${String(1000 + studentIndex).padStart(4, '0')}`,
    fatherAddressLine1: address.line1,
    fatherAddressLine2: address.line2,
    fatherCity: address.city,
    fatherState: address.state,
    fatherPostalCode: address.postal,
    fatherCountry: "Nigeria",
    
    // Mother's Info
    motherPhoto: getProfilePicture("mother", "Female", studentIndex),
    motherFirstName,
    motherLastName,
    motherMiddleName,
    motherEmail: `${motherFirstName.toLowerCase()}.${motherLastName.toLowerCase()}@example.com`,
    motherPhone: phoneBase.replace(/\d{4}$/, String(9000 + studentIndex)),
    motherOccupation,
    motherEducation: ["Bachelor's Degree", "Master's Degree", "High School", "Diploma", "PhD"][studentIndex % 5],
    motherAnnualIncome: [`₦${(3 + studentIndex) * 800000}`, `₦${(8 + studentIndex) * 800000}`, `₦${(12 + studentIndex) * 800000}`][studentIndex % 3],
    motherAadhar: `XXXX XXXX ${String(2000 + studentIndex).padStart(4, '0')}`,
    motherAddressLine1: address.line1,
    motherAddressLine2: address.line2,
    motherCity: address.city,
    motherState: address.state,
    motherPostalCode: address.postal,
    motherCountry: "Nigeria",
    
    // Guardian Info (default to Father)
    guardianIs: "Father",
    guardianPhoto: getProfilePicture("guardian", "Male", studentIndex),
    guardianFirstName: fatherFirstName,
    guardianLastName: fatherLastName,
    guardianMiddleName: fatherMiddleName,
    guardianGender: "Male",
    guardianRelation: "Father",
    guardianPhone: phoneBase.replace(/\d{4}$/, String(8000 + studentIndex)),
    guardianEmail: `${fatherFirstName.toLowerCase()}.${fatherLastName.toLowerCase()}@example.com`,
    guardianOccupation: fatherOccupation,
    guardianAddress: `${address.line1}, ${address.line2}, ${address.city}, ${address.state} State, ${address.postal}, Nigeria`,
    guardianAddressLine1: address.line1,
    guardianAddressLine2: address.line2,
    guardianCity: address.city,
    guardianState: address.state,
    guardianPostalCode: address.postal,
    guardianCountry: "Nigeria",
    
              // Siblings (about 50% of students have siblings - always ensure it's an array)
     siblings: studentIndex % 2 === 0 ? (() => {
       const siblingNames = ["David", "Mary", "John", "Sarah", "Emma", "Michael", "Sophia", "James", "Olivia", "William", "Ava", "Benjamin", "Isabella", "Lucas", "Mia", "Henry"];
       const siblingSections = ["A", "B", "C", "D"];
       const siblingClasses = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
       
       // Some students have 1 sibling, some have 2
       const numSiblings = studentIndex % 5 === 0 ? 2 : 1;
       const siblings = [];
       
       for (let i = 0; i < numSiblings; i++) {
         const siblingIndex = (studentIndex + i) % siblingNames.length;
         const siblingName = siblingNames[siblingIndex];
         const siblingGender: "Male" | "Female" = ["David", "John", "Michael", "James", "William", "Benjamin", "Lucas", "Henry"].includes(siblingName) ? "Male" : "Female";
         const siblingClassIndex = (studentIndex + i) % siblingClasses.length;
         const siblingClass = siblingClasses[siblingClassIndex];
         const siblingSection = siblingSections[(studentIndex + i) % siblingSections.length];
         const siblingAge = approximateAge + (i % 2 === 0 ? 1 : -1);
         
         siblings.push({
           name: `${siblingName} ${lastName}`,
           relationship: siblingGender === "Male" ? "Brother" : "Sister",
           age: siblingAge,
           class: siblingClass,
           section: siblingSection,
           photo: getProfilePicture("student", siblingGender, studentIndex + i),
           classNum: siblingClass,
           school: studentIndex % 3 === 0 ? "Same School" : "Different School"
         });
       }
       
       return siblings;
     })() : ([] as any[]),
     isSiblingStudyingHere: studentIndex % 2 === 0 && studentIndex % 3 === 0,
    
    // Address
    currentAddressLine1: address.line1,
    currentAddressLine2: address.line2,
    currentCity: address.city,
    currentState: address.state,
    currentPostalCode: address.postal,
    currentCountry: "Nigeria",
    currentAddressPhone: phoneBase,
    currentPhone: phoneBase,
    sameAsCurrent: studentIndex % 3 !== 0,
    sameAsCurrentAddress: studentIndex % 3 !== 0,
    permanentAddressLine1: studentIndex % 3 === 0 ? address.line1 : undefined,
    permanentAddressLine2: studentIndex % 3 === 0 ? address.line2 : undefined,
    permanentCity: studentIndex % 3 === 0 ? address.city : undefined,
    permanentState: studentIndex % 3 === 0 ? address.state : undefined,
    permanentPostalCode: studentIndex % 3 === 0 ? address.postal : undefined,
    permanentCountry: studentIndex % 3 === 0 ? "Nigeria" : undefined,
    permanentAddressPhone: studentIndex % 3 === 0 ? phoneBase : undefined,
    currentAddress: `${address.line1}, ${address.line2}, ${address.city}, ${address.state} State, ${address.postal}, Nigeria`,
    permanentAddress: studentIndex % 3 === 0 ? `${address.line1}, ${address.line2}, ${address.city}, ${address.state} State, ${address.postal}, Nigeria` : undefined,
    
    // Transport (some students use transport)
    useTransport: studentIndex % 3 === 0,
    transportType: studentIndex % 3 === 0 ? "School Bus" : undefined,
    transportRoute: studentIndex % 3 === 0 ? `Route ${String.fromCharCode(65 + (studentIndex % 5))} - ${address.city}` : undefined,
    route: studentIndex % 3 === 0 ? `Route ${String.fromCharCode(65 + (studentIndex % 5))} - ${address.city}` : undefined, // Keep for backward compatibility
    vehicleNumber: studentIndex % 3 === 0 ? `${address.state.substring(0, 3).toUpperCase()}-${100 + studentIndex}-ABC` : undefined,
    driverName: studentIndex % 3 === 0 ? `Driver ${["John", "Mike", "David", "James"][studentIndex % 4]}` : undefined,
    driverPhone: studentIndex % 3 === 0 ? phoneBase.replace(/\d{4}$/, String(3000 + studentIndex)) : undefined,
    pickupPoint: studentIndex % 3 === 0 ? `${address.city} Bus Stop` : undefined,
    dropoffPoint: studentIndex % 3 === 0 ? `School Main Gate` : undefined,
    transportFee: studentIndex % 3 === 0 ? "₦15,000" : undefined,
    
    // Hostel (some students use hostel)
    useHostel: studentIndex % 4 === 0,
    hostelName: studentIndex % 4 === 0 ? `${gender === "Female" ? "Girls" : "Boys"} Hostel Block ${String.fromCharCode(65 + (studentIndex % 4))}` : undefined,
    roomNumber: studentIndex % 4 === 0 ? `Room ${200 + (studentIndex % 50)}` : undefined,
    bedNumber: studentIndex % 4 === 0 ? `Bed ${(studentIndex % 4) + 1}` : undefined,
    hostelFee: studentIndex % 4 === 0 ? "₦50,000" : undefined,
    
                   // Documents (these would be file objects in production, using URLs for mock - always ensure it's an array)
     birthCertificate: null,
     transferCertificate: null,
     immunizationCard: null,
     studentIdProof: null,
     documents: studentIndex % 5 === 0 ? [
       { name: "Birth Certificate", type: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
       { name: "Medical Certificate", type: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
       { name: "Previous School Transcript", type: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
     ] : ([] as any[]),
     
          // Medical History (ensure all array fields are always arrays)
     medicalCondition: studentIndex % 10 === 0 ? "Asthma (mild)" : "Good",
     medicalConditions: studentIndex % 10 === 0 ? ["Asthma (mild)"] : ([] as string[]),
     allergies: studentIndex % 10 === 0 ? ["Peanuts", "Dust"] : ([] as string[]),
     medications: studentIndex % 10 === 0 ? ["Inhaler (as needed)"] : ([] as string[]),
          currentMedications: studentIndex % 10 === 0 ? "Inhaler (as needed)" : "",
     emergencyContactName: studentIndex % 10 === 0 ? `${fatherFirstName} ${lastName}` : `${fatherFirstName} ${lastName}`,
     emergencyContactPhone: studentIndex % 10 === 0 ? phoneBase.replace(/\d{4}$/, String(8000 + studentIndex)) : phoneBase.replace(/\d{4}$/, String(8000 + studentIndex)),
     emergencyContactRelation: "Father",
     doctorName: studentIndex % 10 === 0 ? "Dr. Adebayo Okafor" : undefined,
     doctorPhone: studentIndex % 10 === 0 ? "+234 801 234 5678" : undefined,
     hospitalName: studentIndex % 10 === 0 ? "Lagos General Hospital" : undefined,
     bloodPressure: studentIndex % 10 === 0 ? "120/80" : undefined,
     height: `${150 + (studentIndex % 30)} cm`,
     weight: `${45 + (studentIndex % 20)} kg`,
     vision: "Normal",
     hearing: "Normal",
    
    // Previous School
    previousSchoolName: studentIndex % 2 === 0 ? `St. ${lastName}'s Primary School` : undefined,
    previousSchoolBoard: studentIndex % 2 === 0 ? "WAEC" : undefined,
    previousSchoolAddress: studentIndex % 2 === 0 ? `${address.city} Education Road, ${address.state}` : undefined,
    previousSchoolPhone: studentIndex % 2 === 0 ? phoneBase.replace(/\d{4}$/, String(7000 + studentIndex)) : undefined,
    previousSchoolEmail: studentIndex % 2 === 0 ? `info@st${lastName.toLowerCase()}school.edu.ng` : undefined,
    lastClassAttended: studentIndex % 2 === 0 ? classNum === "I" ? "Kindergarten" : `Class ${classNum}` : undefined,
    lastClassYear: studentIndex % 2 === 0 ? String(parseInt(academicYear.split("/")[0]) - 1) : undefined,
    lastClassPercentage: studentIndex % 2 === 0 ? `${75 + (studentIndex % 20)}%` : undefined,
    reasonForLeaving: studentIndex % 2 === 0 ? "Relocation" : undefined,
    transferCertificateNumber: studentIndex % 2 === 0 ? `TC/${academicYear.split("/")[0]}/${String(100 + studentIndex)}` : undefined,
    transferCertificateDate: studentIndex % 2 === 0 ? parseDate(student.joinedOn || "15 Jan 2024") : undefined,
    
    // Other Details
    notes: studentIndex % 5 === 0 ? `Student shows great potential in ${gender === "Male" ? "mathematics and science" : "literature and arts"}.` : undefined,
    remarks: studentIndex % 5 === 0 ? "Active participant in school activities." : undefined,
    extraCurricularActivities: studentIndex % 5 === 0 ? (gender === "Male" ? "Football, Chess Club" : "Debate Team, Art Club") : undefined,
    achievements: studentIndex % 5 === 0 ? `Winner of ${gender === "Male" ? "Inter-school Science Fair 2023" : "Creative Writing Competition 2023"}` : undefined,
    hobbies: studentIndex % 5 === 0 ? (gender === "Male" ? "Reading, Playing football, Video games" : "Reading, Dancing, Drawing") : undefined,
    bankName: studentIndex % 3 === 0 ? "First Bank of Nigeria" : undefined,
    branch: studentIndex % 3 === 0 ? `${address.city} Branch` : undefined,
    ifscNumber: studentIndex % 3 === 0 ? `FIRSTNGA${100 + studentIndex}` : undefined,
    otherInformation: studentIndex % 5 === 0 ? `Excellent student with good academic performance. Participates actively in ${gender === "Male" ? "sports" : "cultural activities"}.` : undefined,

    // Generate enrolled subjects first
    enrolledSubjects: generateEnrolledSubjects(studentIndex, ALL_SUBJECTS.length),
  };
}

// Update the return to include timetable after enrolledSubjects is defined
function generateExtendedStudentDataWithTimetable(student: Student, academicYear: string = "2024/2025"): ExtendedStudentData {
  const baseData = generateExtendedStudentData(student, academicYear);

  // Generate timetable based on enrolled subjects
  return {
    ...baseData,
    timetable: generateTimetable(
      parseInt(student.id.match(/\d+$/)?.[0] || "0") % 50,
      baseData.enrolledSubjects || []
    ),
  };
}

// All available subjects (same as in AttendanceByClass DEFAULT_SUBJECTS)
const ALL_SUBJECTS = [
  "Mathematics",
  "English",
  "Science",
  "History",
  "Physical Education",
  "Art",
  "Music",
  "Geography",
  "Computer Science",
  "Chemistry",
  "Physics",
  "Biology",
  "Literature",
  "Spanish",
  "French",
];

// Helper function to generate student-specific enrolled subjects
function generateEnrolledSubjects(studentIndex: number, numSubjects: number): string[] {
  // Students are enrolled in 5-10 subjects based on their index
  const minSubjects = 5;
  const maxSubjects = Math.min(10, numSubjects);
  const enrolledCount = minSubjects + (studentIndex % (maxSubjects - minSubjects + 1));

  // Create a deterministic but varied selection based on studentIndex
  const selectedSubjects: string[] = [];
  const startIndex = studentIndex % ALL_SUBJECTS.length;

  for (let i = 0; i < enrolledCount; i++) {
    const subjectIndex = (startIndex + i) % ALL_SUBJECTS.length;
    selectedSubjects.push(ALL_SUBJECTS[subjectIndex]);
  }

  return selectedSubjects;
}

// Attendance status types
export type AttendanceStatus = "present" | "absent" | "late" | "excused";

// Attendance data structure
export interface ClassAttendanceData {
  date: string;
  day: string;
  [key: `period${number}`]: AttendanceStatus | string;
}

// Helper function to generate deterministic student-specific attendance data
function generateStudentAttendance(
  studentId: string,
  periodsPerDay: number,
  numberOfDays: number = 31,
  startYear: number = 2024
): ClassAttendanceData[] {
  const data: ClassAttendanceData[] = [];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Use studentId to create a consistent seed for this student's attendance
  const studentSeed = studentId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Simple deterministic random number generator using student seed
  let seed = studentSeed;
  const deterministicRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  // Start from January 1st of the selected year and generate sequential dates
  const currentDate = new Date(startYear, 0, 1); // Jan 1

  for (let i = 0; i < numberOfDays; i++) {
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayName = days[dayOfWeek === 0 ? 6 : dayOfWeek - 1]; // Adjust: Mon-Fri (skip weekends for display)

    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = months[currentDate.getMonth()];
    const year = currentDate.getFullYear();

    const row: any = {
      date: `${day} ${month} ${year}`,
      day: dayName,
    };

    // Generate attendance for each period
    // This student's attendance pattern is deterministic but realistic
    for (let p = 1; p <= periodsPerDay; p++) {
      const rand = deterministicRandom();
      let status: AttendanceStatus;

      // 85% present, 8% absent, 4% late, 3% excused
      if (rand > 0.92) status = "absent";
      else if (rand > 0.88) status = "late";
      else if (rand > 0.85) status = "excused";
      else status = "present";

      row[`period${p}`] = status;
    }

    data.push(row as ClassAttendanceData);

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
}

// Helper function to generate timetable with enrolled subjects only
function generateTimetable(studentIndex: number, enrolledSubjects: string[]): TimetableEntry[] {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const subjects = enrolledSubjects.length > 0 ? enrolledSubjects : ALL_SUBJECTS.slice(0, 7);
  const teachers = ["Jacquelin", "Erickson", "Daniel", "Teresa", "Hellana", "Morgan", "Aaron"];
  const teacherAvatars = [
    "https://i.pravatar.cc/150?img=11",
    "https://i.pravatar.cc/150?img=12",
    "https://i.pravatar.cc/150?img=13",
    "https://i.pravatar.cc/150?img=14",
    "https://i.pravatar.cc/150?img=15",
    "https://i.pravatar.cc/150?img=16",
    "https://i.pravatar.cc/150?img=17",
  ];

  const timeSlots = [
    { time: "09:00 - 09:45 AM", isBreak: false },
    { time: "09:45 - 10:30 AM", isBreak: false },
    { time: "10:45 - 11:30 AM", isBreak: false },
    { time: "11:30 - 12:15 PM", isBreak: false },
    { time: "01:30 - 02:15 PM", isBreak: false },
    { time: "02:15 - 03:00 PM", isBreak: false },
    { time: "03:15 - 04:00 PM", isBreak: false },
  ];

  const breaks = [
    { time: "10:30 to 10:45 AM", label: "Morning Break" },
    { time: "10:30 to 10:45 AM", label: "Lunch" },
    { time: "03:30 PM to 03:45 PM", label: "Evening Break" },
  ];

  return days.map((day, dayIndex) => {
    const periods: Period[] = timeSlots.map((slot, slotIndex) => {
      // Add breaks at specific positions
      if (dayIndex < 6 && slotIndex === 1) {
        return {
          time: breaks[0].time,
          subject: breaks[0].label,
          teacher: "",
          type: "break" as const,
        };
      }
      if (dayIndex < 6 && slotIndex === 3) {
        return {
          time: breaks[1].time,
          subject: breaks[1].label,
          teacher: "",
          type: "break" as const,
        };
      }
      if (dayIndex < 6 && slotIndex === 6) {
        return {
          time: breaks[2].time,
          subject: breaks[2].label,
          teacher: "",
          type: "break" as const,
        };
      }

      // Rotate subjects and teachers based on day and slot
      const subjectIndex = (dayIndex + slotIndex + studentIndex) % subjects.length;
      const teacherIndex = (dayIndex + slotIndex + studentIndex) % teachers.length;

      return {
        time: slot.time,
        subject: subjects[subjectIndex],
        teacher: teachers[teacherIndex],
        teacherAvatar: teacherAvatars[teacherIndex],
        type: "class" as const,
      };
    });

    return {
      day,
      periods: periods.filter((p) => p.type === "class" || p.type === "break"),
    };
  });
}

// Basic student list - matches the students page
export const sampleStudents: Student[] = [
  {
    id: "AD9892434",
    name: "Janet Daniel",
    rollNo: "35013",
    class: "JSS 1, A",
    gender: "Female",
    joinedOn: "10 Jan 2017",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=1",
    tenantId: "educo-default", // Educo v4.0 Multi-Tenant
    branch: "Main Campus", // PRD: Multi-branch support
  },
  {
    id: "AD9892433",
    name: "Joann Michael",
    rollNo: "35012",
    class: "JSS 2, B",
    gender: "Male",
    joinedOn: "19 Aug 2014",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=2",
    tenantId: "educo-default",
    branch: "North Campus",
  },
  {
    id: "AD9892432",
    name: "Kathleen Dison",
    rollNo: "35011",
    class: "JSS 1, A",
    gender: "Female",
    joinedOn: "5 Dec 2017",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=3",
    tenantId: "educo-default",
    branch: "South Campus",
  },
  {
    id: "AD9892431",
    name: "Lisa Gourley",
    rollNo: "35010",
    class: "II, B",
    gender: "Female",
    joinedOn: "13 May 2017",
    leftOn: "15 Jun 2019",
    status: "Inactive",
    avatar: "https://i.pravatar.cc/150?img=4",
    tenantId: "greenfield-international",
    branch: "East Campus",
  },
  {
    id: "AD9892430",
    name: "Ralph Claudia",
    rollNo: "35009",
    class: "II, B",
    gender: "Male",
    joinedOn: "20 Jun 2015",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=5",
    branch: "West Campus",
  },
  {
    id: "AD9892429",
    name: "Ralph Claudia",
    rollNo: "35008",
    class: "II, B",
    gender: "Male",
    joinedOn: "20 Jun 2015",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=6",
    branch: "Main Campus",
  },
  {
    id: "AD9892428",
    name: "Julie Scott",
    rollNo: "35007",
    class: "V, A",
    gender: "Female",
    joinedOn: "18 Jan 2023",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=7",
    branch: "North Campus",
  },
  {
    id: "AD9892427",
    name: "Susan Boswell",
    rollNo: "35006",
    class: "II, A",
    gender: "Female",
    joinedOn: "26 May 2020",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=8",
    branch: "South Campus",
  },
  {
    id: "AD9892426",
    name: "David Johnson",
    rollNo: "35005",
    class: "JSS 3, A",
    gender: "Male",
    joinedOn: "15 Mar 2019",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=9",
    branch: "Main Campus",
  },
  {
    id: "AD9892425",
    name: "Emily Brown",
    rollNo: "35004",
    class: "JSS 2, B",
    gender: "Female",
    joinedOn: "22 Jul 2018",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=10",
    branch: "East Campus",
  },
  {
    id: "AD9892424",
    name: "Michael Davis",
    rollNo: "35003",
    class: "VI, A",
    gender: "Male",
    joinedOn: "10 Sep 2019",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=11",
    branch: "West Campus",
  },
  {
    id: "AD9892423",
    name: "Sarah Wilson",
    rollNo: "35002",
    class: "V, B",
    gender: "Female",
    joinedOn: "5 Nov 2020",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=12",
    branch: "North Campus",
  },
  {
    id: "AD9892422",
    name: "James Martinez",
    rollNo: "35001",
    class: "JSS 1, B",
    gender: "Male",
    joinedOn: "18 Feb 2018",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=13",
    branch: "Main Campus",
  },
  {
    id: "AD9892421",
    name: "Jessica Taylor",
    rollNo: "35000",
    class: "II, B",
    gender: "Female",
    joinedOn: "30 Apr 2021",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=14",
    branch: "South Campus",
  },
  {
    id: "AD9892420",
    name: "Christopher Anderson",
    rollNo: "34999",
    class: "SSS 1, B",
    gender: "Male",
    joinedOn: "12 Aug 2019",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=15",
    branch: "East Campus",
  },
  {
    id: "AD9892419",
    name: "Amanda Thomas",
    rollNo: "34998",
    class: "SSS 2, A",
    gender: "Female",
    joinedOn: "25 Jan 2020",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=16",
    branch: "West Campus",
  },
  {
    id: "AD9892520",
    name: "Oliver Martinez",
    rollNo: "36000",
    class: "I, A",
    gender: "Male",
    joinedOn: "5 Sep 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=17",
    branch: "Main Campus",
  },
  {
    id: "AD9892521",
    name: "Emma Thompson",
    rollNo: "36001",
    class: "I, B",
    gender: "Female",
    joinedOn: "10 Sep 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=18",
    branch: "North Campus",
  },
  {
    id: "AD9892522",
    name: "Liam Anderson",
    rollNo: "36002",
    class: "II, A",
    gender: "Male",
    joinedOn: "15 Sep 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=19",
    branch: "South Campus",
  },
  {
    id: "AD9892523",
    name: "Sophia Williams",
    rollNo: "36003",
    class: "I, A", // Primary
    gender: "Female",
    joinedOn: "20 Sep 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=20",
    branch: "East Campus",
  },
  {
    id: "AD9892524",
    name: "Noah Johnson",
    rollNo: "36004",
    class: "JSS 1, B", // Secondary
    gender: "Male",
    joinedOn: "25 Sep 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=21",
    branch: "West Campus",
  },
  {
    id: "AD9892525",
    name: "Ava Davis",
    rollNo: "36005",
    class: "I, B", // Primary
    gender: "Female",
    joinedOn: "1 Oct 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=22",
    branch: "Main Campus",
  },
  {
    id: "AD9892526",
    name: "Ethan Brown",
    rollNo: "36006",
    class: "II, A", // Primary
    gender: "Male",
    joinedOn: "5 Oct 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=23",
    branch: "North Campus",
  },
  {
    id: "AD9892527",
    name: "Isabella Garcia",
    rollNo: "36007",
    class: "I, A", // Primary
    gender: "Female",
    joinedOn: "10 Oct 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=24",
    branch: "South Campus",
  },
  {
    id: "AD9892528",
    name: "Mason Miller",
    rollNo: "36008",
    class: "IV, B", // Primary
    gender: "Male",
    joinedOn: "15 Oct 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=25",
    branch: "East Campus",
  },
  {
    id: "AD9892529",
    name: "Mia Wilson",
    rollNo: "36009",
    class: "I, B", // Primary
    gender: "Female",
    joinedOn: "20 Oct 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=26",
    branch: "West Campus",
  },
  {
    id: "AD9892530",
    name: "Lucas Moore",
    rollNo: "36010",
    class: "II, A", // Primary
    gender: "Male",
    joinedOn: "25 Oct 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=27",
    branch: "Main Campus",
  },
  {
    id: "AD9892531",
    name: "Charlotte Taylor",
    rollNo: "36011",
    class: "I, A", // Primary
    gender: "Female",
    joinedOn: "1 Nov 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=28",
    branch: "North Campus",
  },
  {
    id: "AD9892532",
    name: "Benjamin Anderson",
    rollNo: "36012",
    class: "JSS 1, B", // Secondary
    gender: "Male",
    joinedOn: "5 Nov 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=29",
    branch: "South Campus",
  },
  {
    id: "AD9892533",
    name: "Amelia Jackson",
    rollNo: "36013",
    class: "I, B", // Primary
    gender: "Female",
    joinedOn: "10 Nov 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=30",
    branch: "East Campus",
  },
  {
    id: "AD9892534",
    name: "Elijah White",
    rollNo: "36014",
    class: "II, A", // Primary
    gender: "Male",
    joinedOn: "15 Nov 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=31",
    branch: "West Campus",
  },
  {
    id: "AD9892535",
    name: "Harper Harris",
    rollNo: "36015",
    class: "I, A", // Primary
    gender: "Female",
    joinedOn: "20 Nov 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=32",
    branch: "Main Campus",
  },
  {
    id: "AD9892600",
    name: "Alex Thompson",
    rollNo: "37001",
    class: "100 Level, A", // Tertiary
    gender: "Male",
    joinedOn: "2 Nov 2025",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=33",
    branch: "Main Campus",
  },
  {
    id: "AD9892601",
    name: "Maya Rodriguez",
    rollNo: "37002",
    class: "200 Level, B", // Tertiary
    gender: "Female",
    joinedOn: "2 Nov 2025",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=34",
    branch: "North Campus",
  },
  {
    id: "AD9892302",
    name: "Aaliyah Griffin",
    rollNo: "35020",
    class: "JSS 1, A", // Secondary
    gender: "Female",
    joinedOn: "15 Jan 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=35",
    branch: "South Campus",
  },
  {
    id: "AD9892700",
    name: "Daniel Okonkwo",
    rollNo: "38001",
    class: "300 Level, A", // Tertiary
    gender: "Male",
    joinedOn: "5 Sep 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=36",
    branch: "East Campus",
  },
  {
    id: "AD9892701",
    name: "Chioma Adeyemi",
    rollNo: "38002",
    class: "SSS 3, A", // Secondary (Senior)
    gender: "Female",
    joinedOn: "10 Sep 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=37",
    branch: "West Campus",
  },
  {
    id: "AD9892702",
    name: "Kwame Asante",
    rollNo: "38003",
    class: "400 Level, B", // Tertiary
    gender: "Male",
    joinedOn: "15 Sep 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=38",
    branch: "Main Campus",
  },
];

// Pre-generate extended data for all students with the default academic year
let cachedExtendedStudents: ExtendedStudentData[] | null = null;
let cachedAcademicYear: string | null = null;

function getExtendedStudentsArray(academicYear: string = "2024/2025"): ExtendedStudentData[] {
  // Return cached data if academic year hasn't changed
  if (cachedExtendedStudents && cachedAcademicYear === academicYear) {
    return cachedExtendedStudents;
  }

  // Generate extended data for all students with timetable
  cachedExtendedStudents = sampleStudents.map((student) =>
    generateExtendedStudentDataWithTimetable(student, academicYear)
  );
  cachedAcademicYear = academicYear;

  return cachedExtendedStudents;
}

// Helper function to get student by ID
export function getStudentById(id: string): Student | undefined {
  return sampleStudents.find(s => s.id === id);
}

// Helper function to get extended student data by ID (includes all form data)
export function getExtendedStudentDataById(id: string, academicYear?: string): ExtendedStudentData | undefined {
  const year = academicYear || "2024/2025";
  const extendedStudents = getExtendedStudentsArray(year);
  return extendedStudents.find(s => s.admissionNumber === id);
}

// Helper function to get all students
export function getAllStudents(): Student[] {
  return sampleStudents;
}

// Helper function to get all extended student data (pre-generated)
export function getAllExtendedStudentData(academicYear?: string): ExtendedStudentData[] {
  const year = academicYear || "2024/2025";
  return getExtendedStudentsArray(year);
}

// Export pre-generated extended students array for direct access
export function getSampleExtendedStudents(academicYear: string = "2024/2025"): ExtendedStudentData[] {
  return getExtendedStudentsArray(academicYear);
}

// Helper function to get enrolled subjects for a student by ID
export function getStudentEnrolledSubjects(studentId: string): string[] {
  const student = getExtendedStudentDataById(studentId);
  return student?.enrolledSubjects || [];
}

// Helper function to get student-specific attendance data
export function getStudentAttendanceData(
  studentId: string,
  periodsPerDay: number,
  numberOfDays: number = 31,
  startYear: number = 2024
): ClassAttendanceData[] {
  return generateStudentAttendance(studentId, periodsPerDay, numberOfDays, startYear);
}

