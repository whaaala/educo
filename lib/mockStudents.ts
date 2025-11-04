// Shared mock student data
import { Student } from "@/components/students/StudentCard";

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
  const baseIndex = index % 50; // Cycle through 50 different images
  
  if (type === "father") {
    return `https://i.pravatar.cc/400?img=${30 + baseIndex}`;
  } else if (type === "mother") {
    return `https://i.pravatar.cc/400?img=${20 + baseIndex}`;
  } else if (type === "guardian") {
    return gender === "Male" 
      ? `https://i.pravatar.cc/400?img=${30 + baseIndex}`
      : `https://i.pravatar.cc/400?img=${20 + baseIndex}`;
  } else {
    // Student profile picture
    return gender === "Female"
      ? `https://i.pravatar.cc/400?img=${10 + baseIndex}`
      : `https://i.pravatar.cc/400?img=${40 + baseIndex}`;
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
    
              // Siblings (some students have siblings - always ensure it's an array)
     siblings: studentIndex % 4 === 0 ? [
       {
         name: `${["David", "Mary", "John", "Sarah"][studentIndex % 4]} ${lastName}`,
         relationship: gender === "Male" ? "Brother" : "Sister",
         age: approximateAge + (studentIndex % 3) - 1,
         class: classNum === "I" ? "II" : classNum,
         school: studentIndex % 2 === 0 ? "Same School" : "Different School"
       }
     ] : ([] as any[]),
     isSiblingStudyingHere: studentIndex % 4 === 0 && studentIndex % 2 === 0,
    
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
       { name: "Birth Certificate", type: "pdf", url: "#" },
       { name: "Medical Certificate", type: "pdf", url: "#" },
       { name: "Previous School Transcript", type: "pdf", url: "#" }
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
  };
}

// Basic student list - matches the students page
export const sampleStudents: Student[] = [
  {
    id: "AD9892434",
    name: "Janet Daniel",
    rollNo: "35013",
    class: "III, A",
    gender: "Female",
    joinedOn: "10 Jan 2017",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "AD9892433",
    name: "Joann Michael",
    rollNo: "35012",
    class: "IV, B",
    gender: "Male",
    joinedOn: "19 Aug 2014",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "AD9892432",
    name: "Kathleen Dison",
    rollNo: "35011",
    class: "III, A",
    gender: "Female",
    joinedOn: "5 Dec 2017",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=3",
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
  },
  {
    id: "AD9892426",
    name: "David Johnson",
    rollNo: "35005",
    class: "VIII, A",
    gender: "Male",
    joinedOn: "15 Mar 2019",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=9",
  },
  {
    id: "AD9892425",
    name: "Emily Brown",
    rollNo: "35004",
    class: "VII, B",
    gender: "Female",
    joinedOn: "22 Jul 2018",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=10",
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
  },
  {
    id: "AD9892422",
    name: "James Martinez",
    rollNo: "35001",
    class: "III, B",
    gender: "Male",
    joinedOn: "18 Feb 2018",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=13",
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
  },
  {
    id: "AD9892420",
    name: "Christopher Anderson",
    rollNo: "34999",
    class: "VI, B",
    gender: "Male",
    joinedOn: "12 Aug 2019",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=15",
  },
  {
    id: "AD9892419",
    name: "Amanda Thomas",
    rollNo: "34998",
    class: "IV, A",
    gender: "Female",
    joinedOn: "25 Jan 2020",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=16",
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
  },
  {
    id: "AD9892523",
    name: "Sophia Williams",
    rollNo: "36003",
    class: "I, A",
    gender: "Female",
    joinedOn: "20 Sep 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=20",
  },
  {
    id: "AD9892524",
    name: "Noah Johnson",
    rollNo: "36004",
    class: "III, B",
    gender: "Male",
    joinedOn: "25 Sep 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=21",
  },
  {
    id: "AD9892525",
    name: "Ava Davis",
    rollNo: "36005",
    class: "I, B",
    gender: "Female",
    joinedOn: "1 Oct 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=22",
  },
  {
    id: "AD9892526",
    name: "Ethan Brown",
    rollNo: "36006",
    class: "II, A",
    gender: "Male",
    joinedOn: "5 Oct 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=23",
  },
  {
    id: "AD9892527",
    name: "Isabella Garcia",
    rollNo: "36007",
    class: "I, A",
    gender: "Female",
    joinedOn: "10 Oct 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=24",
  },
  {
    id: "AD9892528",
    name: "Mason Miller",
    rollNo: "36008",
    class: "IV, B",
    gender: "Male",
    joinedOn: "15 Oct 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=25",
  },
  {
    id: "AD9892529",
    name: "Mia Wilson",
    rollNo: "36009",
    class: "I, B",
    gender: "Female",
    joinedOn: "20 Oct 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=26",
  },
  {
    id: "AD9892530",
    name: "Lucas Moore",
    rollNo: "36010",
    class: "II, A",
    gender: "Male",
    joinedOn: "25 Oct 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=27",
  },
  {
    id: "AD9892531",
    name: "Charlotte Taylor",
    rollNo: "36011",
    class: "I, A",
    gender: "Female",
    joinedOn: "1 Nov 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=28",
  },
  {
    id: "AD9892532",
    name: "Benjamin Anderson",
    rollNo: "36012",
    class: "III, B",
    gender: "Male",
    joinedOn: "5 Nov 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=29",
  },
  {
    id: "AD9892533",
    name: "Amelia Jackson",
    rollNo: "36013",
    class: "I, B",
    gender: "Female",
    joinedOn: "10 Nov 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=30",
  },
  {
    id: "AD9892534",
    name: "Elijah White",
    rollNo: "36014",
    class: "II, A",
    gender: "Male",
    joinedOn: "15 Nov 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=31",
  },
  {
    id: "AD9892535",
    name: "Harper Harris",
    rollNo: "36015",
    class: "I, A",
    gender: "Female",
    joinedOn: "20 Nov 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    id: "AD9892600",
    name: "Alex Thompson",
    rollNo: "37001",
    class: "I, A",
    gender: "Male",
    joinedOn: "2 Nov 2025",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=33",
  },
  {
    id: "AD9892601",
    name: "Maya Rodriguez",
    rollNo: "37002",
    class: "I, B",
    gender: "Female",
    joinedOn: "2 Nov 2025",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=34",
  },
  {
    id: "AD9892302",
    name: "Aaliyah Griffin",
    rollNo: "35020",
    class: "JSS 1, A",
    gender: "Female",
    joinedOn: "15 Jan 2024",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=35",
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
  
  // Generate extended data for all students
  cachedExtendedStudents = sampleStudents.map((student) => 
    generateExtendedStudentData(student, academicYear)
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

