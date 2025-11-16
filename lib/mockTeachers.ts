// Mock data for teachers/lecturers and staff
// Based on PRD Section 7.3: Staff Management

export type StaffRole = "Teacher" | "Lecturer" | "Admin" | "Support" | "Management";
export type EmploymentType = "Full-Time" | "Part-Time" | "Contract" | "Temporary";
export type EmploymentStatus = "Active" | "On Leave" | "Suspended" | "Terminated";

export interface Teacher {
  id: string;
  staffId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: StaffRole;
  subjects: string[];
  classes: string[];
  department: string;
  employmentType: EmploymentType;
  employmentStatus: EmploymentStatus;
  joinDate: string;
  dateOfBirth: string;
  gender: "Male" | "Female";
  address: string;
  qualification: string;
  experience: number; // years
  salary: number;
  imageUrl?: string;
  branch?: string;
  specialization?: string;
}

// Mock teachers data
const mockTeachers: Teacher[] = [
  {
    id: "1",
    staffId: "TCH-001",
    firstName: "John",
    lastName: "Adebayo",
    email: "j.adebayo@school.edu",
    phone: "+234 801 234 5678",
    role: "Teacher",
    subjects: ["Mathematics", "Further Mathematics"],
    classes: ["SS 1", "SS 2", "SS 3"],
    department: "Mathematics",
    employmentType: "Full-Time",
    employmentStatus: "Active",
    joinDate: "2020-09-01",
    dateOfBirth: "1985-03-15",
    gender: "Male",
    address: "15 Ikeja Road, Lagos",
    qualification: "B.Ed Mathematics, M.Sc Mathematics",
    experience: 8,
    salary: 150000,
    branch: "Main Campus",
    specialization: "Algebra & Calculus",
  },
  {
    id: "2",
    staffId: "TCH-002",
    firstName: "Mary",
    lastName: "Okonkwo",
    email: "m.okonkwo@school.edu",
    phone: "+234 802 345 6789",
    role: "Teacher",
    subjects: ["English Language", "Literature"],
    classes: ["JSS 3", "SS 1", "SS 2"],
    department: "Languages",
    employmentType: "Full-Time",
    employmentStatus: "Active",
    joinDate: "2019-01-15",
    dateOfBirth: "1982-07-22",
    gender: "Female",
    address: "42 Allen Avenue, Lagos",
    qualification: "B.A English, M.Ed English Language",
    experience: 12,
    salary: 180000,
    branch: "Main Campus",
    specialization: "Literature & Composition",
  },
  {
    id: "3",
    staffId: "TCH-003",
    firstName: "Ahmed",
    lastName: "Ibrahim",
    email: "a.ibrahim@school.edu",
    phone: "+234 803 456 7890",
    role: "Teacher",
    subjects: ["Chemistry", "Biology"],
    classes: ["SS 1", "SS 2", "SS 3"],
    department: "Sciences",
    employmentType: "Full-Time",
    employmentStatus: "Active",
    joinDate: "2021-09-01",
    dateOfBirth: "1988-11-30",
    gender: "Male",
    address: "78 Ahmadu Bello Way, Kano",
    qualification: "B.Sc Chemistry, PGDE",
    experience: 5,
    salary: 140000,
    branch: "Science Block",
    specialization: "Organic Chemistry",
  },
  {
    id: "4",
    staffId: "LEC-001",
    firstName: "Dr. Chioma",
    lastName: "Nwankwo",
    email: "c.nwankwo@university.edu",
    phone: "+234 804 567 8901",
    role: "Lecturer",
    subjects: ["Computer Science", "Software Engineering"],
    classes: ["Year 2", "Year 3", "Year 4"],
    department: "Computer Science",
    employmentType: "Full-Time",
    employmentStatus: "Active",
    joinDate: "2018-08-01",
    dateOfBirth: "1980-05-18",
    gender: "Female",
    address: "12 University Road, Nsukka",
    qualification: "PhD Computer Science",
    experience: 15,
    salary: 350000,
    branch: "Faculty of Science",
    specialization: "Artificial Intelligence & Machine Learning",
  },
  {
    id: "5",
    staffId: "TCH-004",
    firstName: "Grace",
    lastName: "Musa",
    email: "g.musa@school.edu",
    phone: "+234 805 678 9012",
    role: "Teacher",
    subjects: ["Physics"],
    classes: ["SS 1", "SS 2", "SS 3"],
    department: "Sciences",
    employmentType: "Full-Time",
    employmentStatus: "Active",
    joinDate: "2020-01-10",
    dateOfBirth: "1987-09-05",
    gender: "Female",
    address: "34 Station Road, Port Harcourt",
    qualification: "B.Sc Physics, M.Sc Applied Physics",
    experience: 7,
    salary: 155000,
    branch: "Main Campus",
    specialization: "Mechanics & Thermodynamics",
  },
  {
    id: "6",
    staffId: "TCH-005",
    firstName: "David",
    lastName: "Eze",
    email: "d.eze@school.edu",
    phone: "+234 806 789 0123",
    role: "Teacher",
    subjects: ["Geography", "Economics"],
    classes: ["JSS 2", "JSS 3", "SS 1"],
    department: "Social Sciences",
    employmentType: "Full-Time",
    employmentStatus: "Active",
    joinDate: "2022-09-05",
    dateOfBirth: "1990-02-28",
    gender: "Male",
    address: "56 Enugu Road, Enugu",
    qualification: "B.Sc Geography, PGDE",
    experience: 3,
    salary: 125000,
    branch: "Main Campus",
    specialization: "Environmental Geography",
  },
  {
    id: "7",
    staffId: "LEC-002",
    firstName: "Prof. Oluwaseun",
    lastName: "Ajayi",
    email: "o.ajayi@university.edu",
    phone: "+234 807 890 1234",
    role: "Lecturer",
    subjects: ["Civil Engineering", "Structural Analysis"],
    classes: ["Year 3", "Year 4", "Masters"],
    department: "Civil Engineering",
    employmentType: "Full-Time",
    employmentStatus: "Active",
    joinDate: "2015-02-01",
    dateOfBirth: "1975-08-12",
    gender: "Male",
    address: "23 Academic Staff Quarters, Ile-Ife",
    qualification: "PhD Civil Engineering, COREN Registered",
    experience: 20,
    salary: 450000,
    branch: "Faculty of Engineering",
    specialization: "Structural Engineering & Design",
  },
  {
    id: "8",
    staffId: "TCH-006",
    firstName: "Blessing",
    lastName: "Okoro",
    email: "b.okoro@school.edu",
    phone: "+234 808 901 2345",
    role: "Teacher",
    subjects: ["History", "Government"],
    classes: ["JSS 1", "JSS 2", "JSS 3"],
    department: "Social Sciences",
    employmentType: "Part-Time",
    employmentStatus: "Active",
    joinDate: "2023-01-15",
    dateOfBirth: "1992-06-20",
    gender: "Female",
    address: "89 New Layout, Owerri",
    qualification: "B.A History, PGDE (in progress)",
    experience: 2,
    salary: 80000,
    branch: "Main Campus",
    specialization: "African History",
  },
  {
    id: "9",
    staffId: "TCH-007",
    firstName: "Emmanuel",
    lastName: "Okafor",
    email: "e.okafor@school.edu",
    phone: "+234 809 012 3456",
    role: "Teacher",
    subjects: ["Computer Science", "ICT"],
    classes: ["JSS 1", "JSS 2", "JSS 3", "SS 1"],
    department: "Technology",
    employmentType: "Full-Time",
    employmentStatus: "Active",
    joinDate: "2021-02-01",
    dateOfBirth: "1989-12-08",
    gender: "Male",
    address: "67 Computer Village, Lagos",
    qualification: "B.Sc Computer Science, CCNA",
    experience: 6,
    salary: 145000,
    branch: "ICT Center",
    specialization: "Programming & Networking",
  },
  {
    id: "10",
    staffId: "LEC-003",
    firstName: "Dr. Fatima",
    lastName: "Bello",
    email: "f.bello@university.edu",
    phone: "+234 810 123 4567",
    role: "Lecturer",
    subjects: ["Medicine", "Anatomy"],
    classes: ["Year 1", "Year 2"],
    department: "Medicine",
    employmentType: "Full-Time",
    employmentStatus: "Active",
    joinDate: "2019-07-01",
    dateOfBirth: "1983-04-25",
    gender: "Female",
    address: "45 Teaching Hospital Road, Kano",
    qualification: "MBBS, PhD Anatomy",
    experience: 12,
    salary: 400000,
    branch: "Faculty of Medicine",
    specialization: "Human Anatomy & Physiology",
  },
  {
    id: "11",
    staffId: "TCH-008",
    firstName: "Samuel",
    lastName: "Williams",
    email: "s.williams@school.edu",
    phone: "+234 811 234 5678",
    role: "Teacher",
    subjects: ["Fine Arts", "Creative Arts"],
    classes: ["JSS 1", "JSS 2", "JSS 3"],
    department: "Creative Arts",
    employmentType: "Full-Time",
    employmentStatus: "Active",
    joinDate: "2020-09-01",
    dateOfBirth: "1986-01-14",
    gender: "Male",
    address: "12 Artists Colony, Abuja",
    qualification: "B.A Fine Arts, PGDE",
    experience: 9,
    salary: 135000,
    branch: "Arts Block",
    specialization: "Painting & Sculpture",
  },
  {
    id: "12",
    staffId: "TCH-009",
    firstName: "Patience",
    lastName: "Adamu",
    email: "p.adamu@school.edu",
    phone: "+234 812 345 6789",
    role: "Teacher",
    subjects: ["Music", "Cultural Studies"],
    classes: ["Primary 4", "Primary 5", "Primary 6"],
    department: "Creative Arts",
    employmentType: "Part-Time",
    employmentStatus: "Active",
    joinDate: "2022-01-10",
    dateOfBirth: "1991-10-03",
    gender: "Female",
    address: "90 Music Center, Calabar",
    qualification: "Diploma in Music, B.A Music (in progress)",
    experience: 4,
    salary: 75000,
    branch: "Primary Section",
    specialization: "Traditional Music & Dance",
  },
];

// Export functions
export function getAllTeachers(): Teacher[] {
  return mockTeachers;
}

export function getTeacherById(id: string): Teacher | undefined {
  return mockTeachers.find((teacher) => teacher.id === id);
}

export function getTeachersByRole(role: StaffRole): Teacher[] {
  return mockTeachers.filter((teacher) => teacher.role === role);
}

export function getTeachersByDepartment(department: string): Teacher[] {
  return mockTeachers.filter((teacher) => teacher.department === department);
}

export function getTeachersByStatus(status: EmploymentStatus): Teacher[] {
  return mockTeachers.filter((teacher) => teacher.employmentStatus === status);
}
