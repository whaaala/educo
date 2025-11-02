"use client";

import { useState, useEffect, useRef } from "react";
import MainLayout from "@/components/layout/MainLayout";
import StudentCard, { Student } from "@/components/students/StudentCard";
import StudentTable from "@/components/students/StudentTable";
import LoadMoreButton from "@/components/shared/LoadMoreButton";
import DateRangePicker from "@/components/shared/DateRangePicker";
import FilterButton, { FilterField, FilterValues } from "@/components/shared/FilterButton";
import SortButton from "@/components/shared/SortButton";
import ViewToggle from "@/components/shared/ViewToggle";
import PageHeader from "@/components/shared/PageHeader";
import PageActions from "@/components/shared/PageActions";
import PageSpinner from "@/components/shared/PageSpinner";
import { useAcademicYear } from "@/contexts/AcademicYearContext";
import { filterStudentsByAcademicYear } from "@/utils/academicYear";
import { exportStudentsToPDF } from "@/utils/pdfExport";
import { exportStudentsToExcel } from "@/utils/excelExport";

// Sample data
const sampleStudents: Student[] = [
  {
    id: "AD9892434",
    name: "Janet Daniel",
    rollNo: "35013",
    class: "III, A",
    gender: "Female",
    joinedOn: "10 Jan 2017",
    status: "Active",
  },
  {
    id: "AD9892433",
    name: "Joann Michael",
    rollNo: "35012",
    class: "IV, B",
    gender: "Male",
    joinedOn: "19 Aug 2014",
    status: "Active",
  },
  {
    id: "AD9892432",
    name: "Kathleen Dison",
    rollNo: "35011",
    class: "III, A",
    gender: "Female",
    joinedOn: "5 Dec 2017",
    status: "Active",
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
  },
  {
    id: "AD9892430",
    name: "Ralph Claudia",
    rollNo: "35009",
    class: "II, B",
    gender: "Male",
    joinedOn: "20 Jun 20215",
    status: "Active",
  },
  {
    id: "AD9892429",
    name: "Ralph Claudia",
    rollNo: "35008",
    class: "II, B",
    gender: "Male",
    joinedOn: "20 Jun 20215",
    status: "Active",
  },
  {
    id: "AD9892428",
    name: "Julie Scott",
    rollNo: "35007",
    class: "V, A",
    gender: "Female",
    joinedOn: "18 Jan 2023",
    status: "Active",
  },
  {
    id: "AD9892427",
    name: "Susan Boswell",
    rollNo: "35006",
    class: "II, A",
    gender: "Female",
    joinedOn: "26 May 2020",
    status: "Active",
  },
  {
    id: "AD9892426",
    name: "David Johnson",
    rollNo: "35005",
    class: "VIII, A",
    gender: "Male",
    joinedOn: "15 Mar 2019",
    status: "Active",
  },
  {
    id: "AD9892425",
    name: "Emily Brown",
    rollNo: "35004",
    class: "VII, B",
    gender: "Female",
    joinedOn: "22 Jul 2018",
    status: "Active",
  },
  {
    id: "AD9892424",
    name: "Michael Davis",
    rollNo: "35003",
    class: "VI, A",
    gender: "Male",
    joinedOn: "10 Sep 2019",
    status: "Active",
  },
  {
    id: "AD9892423",
    name: "Sarah Wilson",
    rollNo: "35002",
    class: "V, B",
    gender: "Female",
    joinedOn: "5 Nov 2020",
    status: "Active",
  },
  {
    id: "AD9892422",
    name: "James Martinez",
    rollNo: "35001",
    class: "III, B",
    gender: "Male",
    joinedOn: "18 Feb 2018",
    status: "Active",
  },
  {
    id: "AD9892421",
    name: "Jessica Taylor",
    rollNo: "35000",
    class: "II, B",
    gender: "Female",
    joinedOn: "30 Apr 2021",
    status: "Active",
  },
  {
    id: "AD9892420",
    name: "Christopher Anderson",
    rollNo: "34999",
    class: "VI, B",
    gender: "Male",
    joinedOn: "12 Aug 2019",
    status: "Active",
  },
  {
    id: "AD9892419",
    name: "Amanda Thomas",
    rollNo: "34998",
    class: "IV, A",
    gender: "Female",
    joinedOn: "25 Jan 2020",
    status: "Active",
  },

  // Additional students for Academic Year 2024/2025 (Sep 2024 onwards)
  {
    id: "AD9892520",
    name: "Oliver Martinez",
    rollNo: "36000",
    class: "I, A",
    gender: "Male",
    joinedOn: "5 Sep 2024",
    status: "Active",
  },
  {
    id: "AD9892521",
    name: "Emma Thompson",
    rollNo: "36001",
    class: "I, B",
    gender: "Female",
    joinedOn: "10 Sep 2024",
    status: "Active",
  },
  {
    id: "AD9892522",
    name: "Liam Anderson",
    rollNo: "36002",
    class: "II, A",
    gender: "Male",
    joinedOn: "15 Sep 2024",
    status: "Active",
  },
  {
    id: "AD9892523",
    name: "Sophia Williams",
    rollNo: "36003",
    class: "I, A",
    gender: "Female",
    joinedOn: "20 Sep 2024",
    status: "Active",
  },
  {
    id: "AD9892524",
    name: "Noah Johnson",
    rollNo: "36004",
    class: "III, B",
    gender: "Male",
    joinedOn: "25 Sep 2024",
    status: "Active",
  },
  {
    id: "AD9892525",
    name: "Ava Davis",
    rollNo: "36005",
    class: "I, B",
    gender: "Female",
    joinedOn: "1 Oct 2024",
    status: "Active",
  },
  {
    id: "AD9892526",
    name: "Ethan Brown",
    rollNo: "36006",
    class: "II, A",
    gender: "Male",
    joinedOn: "5 Oct 2024",
    status: "Active",
  },
  {
    id: "AD9892527",
    name: "Isabella Garcia",
    rollNo: "36007",
    class: "I, A",
    gender: "Female",
    joinedOn: "10 Oct 2024",
    status: "Active",
  },
  {
    id: "AD9892528",
    name: "Mason Miller",
    rollNo: "36008",
    class: "IV, B",
    gender: "Male",
    joinedOn: "15 Oct 2024",
    status: "Active",
  },
  {
    id: "AD9892529",
    name: "Mia Wilson",
    rollNo: "36009",
    class: "I, B",
    gender: "Female",
    joinedOn: "20 Oct 2024",
    status: "Active",
  },
  {
    id: "AD9892530",
    name: "Lucas Moore",
    rollNo: "36010",
    class: "II, A",
    gender: "Male",
    joinedOn: "25 Oct 2024",
    status: "Active",
  },
  {
    id: "AD9892531",
    name: "Charlotte Taylor",
    rollNo: "36011",
    class: "I, A",
    gender: "Female",
    joinedOn: "1 Nov 2024",
    status: "Active",
  },
  {
    id: "AD9892532",
    name: "Benjamin Anderson",
    rollNo: "36012",
    class: "III, B",
    gender: "Male",
    joinedOn: "5 Nov 2024",
    status: "Active",
  },
  {
    id: "AD9892533",
    name: "Amelia Jackson",
    rollNo: "36013",
    class: "I, B",
    gender: "Female",
    joinedOn: "10 Nov 2024",
    status: "Active",
  },
  {
    id: "AD9892534",
    name: "Elijah White",
    rollNo: "36014",
    class: "II, A",
    gender: "Male",
    joinedOn: "15 Nov 2024",
    status: "Active",
  },
  {
    id: "AD9892535",
    name: "Harper Harris",
    rollNo: "36015",
    class: "I, A",
    gender: "Female",
    joinedOn: "20 Nov 2024",
    status: "Active",
  },

  // Additional students for Academic Year 2023/2024 (Sep 2023 - Aug 2024)
  {
    id: "AD9892450",
    name: "Daniel Rodriguez",
    rollNo: "35500",
    class: "II, A",
    gender: "Male",
    joinedOn: "5 Sep 2023",
    status: "Active",
  },
  {
    id: "AD9892451",
    name: "Emily Lewis",
    rollNo: "35501",
    class: "II, B",
    gender: "Female",
    joinedOn: "10 Sep 2023",
    status: "Active",
  },
  {
    id: "AD9892452",
    name: "Matthew Lee",
    rollNo: "35502",
    class: "III, A",
    gender: "Male",
    joinedOn: "15 Sep 2023",
    status: "Active",
  },
  {
    id: "AD9892453",
    name: "Grace Walker",
    rollNo: "35503",
    class: "II, A",
    gender: "Female",
    joinedOn: "20 Sep 2023",
    status: "Active",
  },
  {
    id: "AD9892454",
    name: "Henry Hall",
    rollNo: "35504",
    class: "IV, B",
    gender: "Male",
    joinedOn: "25 Sep 2023",
    status: "Active",
  },
  {
    id: "AD9892455",
    name: "Chloe Allen",
    rollNo: "35505",
    class: "II, B",
    gender: "Female",
    joinedOn: "1 Oct 2023",
    status: "Active",
  },
  {
    id: "AD9892456",
    name: "Samuel Young",
    rollNo: "35506",
    class: "III, A",
    gender: "Male",
    joinedOn: "5 Oct 2023",
    status: "Active",
  },
  {
    id: "AD9892457",
    name: "Victoria King",
    rollNo: "35507",
    class: "II, A",
    gender: "Female",
    joinedOn: "10 Oct 2023",
    status: "Active",
  },
  {
    id: "AD9892458",
    name: "Joseph Wright",
    rollNo: "35508",
    class: "V, B",
    gender: "Male",
    joinedOn: "15 Oct 2023",
    status: "Active",
  },
  {
    id: "AD9892459",
    name: "Lily Lopez",
    rollNo: "35509",
    class: "II, B",
    gender: "Female",
    joinedOn: "20 Oct 2023",
    status: "Active",
  },
  {
    id: "AD9892460",
    name: "David Hill",
    rollNo: "35510",
    class: "III, A",
    gender: "Male",
    joinedOn: "15 Jan 2024",
    status: "Active",
  },
  {
    id: "AD9892461",
    name: "Zoey Scott",
    rollNo: "35511",
    class: "II, A",
    gender: "Female",
    joinedOn: "20 Jan 2024",
    status: "Active",
  },
  {
    id: "AD9892462",
    name: "Jackson Green",
    rollNo: "35512",
    class: "IV, B",
    gender: "Male",
    joinedOn: "25 Jan 2024",
    status: "Active",
  },
  {
    id: "AD9892463",
    name: "Penelope Adams",
    rollNo: "35513",
    class: "II, B",
    gender: "Female",
    joinedOn: "1 Feb 2024",
    status: "Active",
  },
  {
    id: "AD9892464",
    name: "Sebastian Baker",
    rollNo: "35514",
    class: "III, A",
    gender: "Male",
    joinedOn: "5 Feb 2024",
    status: "Active",
  },
  {
    id: "AD9892465",
    name: "Scarlett Nelson",
    rollNo: "35515",
    class: "II, A",
    gender: "Female",
    joinedOn: "10 Feb 2024",
    status: "Active",
  },

  // Additional students for Academic Year 2022/2023 (Sep 2022 - Aug 2023)
  {
    id: "AD9892400",
    name: "William Turner",
    rollNo: "35000",
    class: "III, A",
    gender: "Male",
    joinedOn: "5 Sep 2022",
    status: "Active",
  },
  {
    id: "AD9892401",
    name: "Sofia Phillips",
    rollNo: "35001",
    class: "III, B",
    gender: "Female",
    joinedOn: "10 Sep 2022",
    status: "Active",
  },
  {
    id: "AD9892402",
    name: "Ryan Campbell",
    rollNo: "35002",
    class: "IV, A",
    gender: "Male",
    joinedOn: "15 Sep 2022",
    status: "Active",
  },
  {
    id: "AD9892403",
    name: "Ella Parker",
    rollNo: "35003",
    class: "III, A",
    gender: "Female",
    joinedOn: "20 Sep 2022",
    status: "Active",
  },
  {
    id: "AD9892404",
    name: "Nathan Evans",
    rollNo: "35004",
    class: "V, B",
    gender: "Male",
    joinedOn: "25 Sep 2022",
    status: "Active",
  },
  {
    id: "AD9892405",
    name: "Layla Edwards",
    rollNo: "35005",
    class: "III, B",
    gender: "Female",
    joinedOn: "1 Oct 2022",
    status: "Active",
  },
  {
    id: "AD9892406",
    name: "Caleb Collins",
    rollNo: "35006",
    class: "IV, A",
    gender: "Male",
    joinedOn: "5 Oct 2022",
    status: "Active",
  },
  {
    id: "AD9892407",
    name: "Nora Stewart",
    rollNo: "35007",
    class: "III, A",
    gender: "Female",
    joinedOn: "10 Oct 2022",
    status: "Active",
  },
  {
    id: "AD9892408",
    name: "Isaac Sanchez",
    rollNo: "35008",
    class: "VI, B",
    gender: "Male",
    joinedOn: "15 Oct 2022",
    status: "Active",
  },
  {
    id: "AD9892409",
    name: "Hannah Morris",
    rollNo: "35009",
    class: "III, B",
    gender: "Female",
    joinedOn: "20 Oct 2022",
    status: "Active",
  },
  {
    id: "AD9892410",
    name: "Gabriel Rogers",
    rollNo: "35010",
    class: "IV, A",
    gender: "Male",
    joinedOn: "15 Jan 2023",
    status: "Active",
  },
  {
    id: "AD9892411",
    name: "Addison Reed",
    rollNo: "35011",
    class: "III, A",
    gender: "Female",
    joinedOn: "20 Jan 2023",
    status: "Active",
  },
  {
    id: "AD9892412",
    name: "Dylan Cook",
    rollNo: "35012",
    class: "V, B",
    gender: "Male",
    joinedOn: "25 Jan 2023",
    status: "Active",
  },
  {
    id: "AD9892413",
    name: "Aubrey Morgan",
    rollNo: "35013",
    class: "III, B",
    gender: "Female",
    joinedOn: "1 Feb 2023",
    status: "Active",
  },
  {
    id: "AD9892414",
    name: "Christian Bell",
    rollNo: "35014",
    class: "IV, A",
    gender: "Male",
    joinedOn: "5 Feb 2023",
    status: "Active",
  },
  {
    id: "AD9892415",
    name: "Savannah Murphy",
    rollNo: "35015",
    class: "III, A",
    gender: "Female",
    joinedOn: "10 Feb 2023",
    status: "Active",
  },

  // Additional students for Academic Year 2021/2022 (Sep 2021 - Aug 2022)
  {
    id: "AD9892350",
    name: "Luke Cox",
    rollNo: "34500",
    class: "IV, A",
    gender: "Male",
    joinedOn: "5 Sep 2021",
    status: "Active",
  },
  {
    id: "AD9892351",
    name: "Natalie Howard",
    rollNo: "34501",
    class: "IV, B",
    gender: "Female",
    joinedOn: "10 Sep 2021",
    status: "Active",
  },
  {
    id: "AD9892352",
    name: "Wyatt Ward",
    rollNo: "34502",
    class: "V, A",
    gender: "Male",
    joinedOn: "15 Sep 2021",
    status: "Active",
  },
  {
    id: "AD9892353",
    name: "Samantha Torres",
    rollNo: "34503",
    class: "IV, A",
    gender: "Female",
    joinedOn: "20 Sep 2021",
    status: "Active",
  },
  {
    id: "AD9892354",
    name: "Grayson Peterson",
    rollNo: "34504",
    class: "VI, B",
    gender: "Male",
    joinedOn: "25 Sep 2021",
    status: "Active",
  },
  {
    id: "AD9892355",
    name: "Bella Gray",
    rollNo: "34505",
    class: "IV, B",
    gender: "Female",
    joinedOn: "1 Oct 2021",
    status: "Active",
  },
  {
    id: "AD9892356",
    name: "Zachary Ramirez",
    rollNo: "34506",
    class: "V, A",
    gender: "Male",
    joinedOn: "5 Oct 2021",
    status: "Active",
  },
  {
    id: "AD9892357",
    name: "Audrey James",
    rollNo: "34507",
    class: "IV, A",
    gender: "Female",
    joinedOn: "10 Oct 2021",
    status: "Active",
  },
  {
    id: "AD9892358",
    name: "Aaron Watson",
    rollNo: "34508",
    class: "VII, B",
    gender: "Male",
    joinedOn: "15 Oct 2021",
    status: "Active",
  },
  {
    id: "AD9892359",
    name: "Leah Brooks",
    rollNo: "34509",
    class: "IV, B",
    gender: "Female",
    joinedOn: "20 Oct 2021",
    status: "Active",
  },
  {
    id: "AD9892360",
    name: "Charles Kelly",
    rollNo: "34510",
    class: "V, A",
    gender: "Male",
    joinedOn: "15 Jan 2022",
    status: "Active",
  },
  {
    id: "AD9892361",
    name: "Anna Sanders",
    rollNo: "34511",
    class: "IV, A",
    gender: "Female",
    joinedOn: "20 Jan 2022",
    status: "Active",
  },
  {
    id: "AD9892362",
    name: "Thomas Price",
    rollNo: "34512",
    class: "VI, B",
    gender: "Male",
    joinedOn: "25 Jan 2022",
    status: "Active",
  },
  {
    id: "AD9892363",
    name: "Madison Bennett",
    rollNo: "34513",
    class: "IV, B",
    gender: "Female",
    joinedOn: "1 Feb 2022",
    status: "Active",
  },
  {
    id: "AD9892364",
    name: "Eli Wood",
    rollNo: "34514",
    class: "V, A",
    gender: "Male",
    joinedOn: "5 Feb 2022",
    status: "Active",
  },
  {
    id: "AD9892365",
    name: "Eleanor Barnes",
    rollNo: "34515",
    class: "IV, A",
    gender: "Female",
    joinedOn: "10 Feb 2022",
    status: "Active",
  },

  // Additional students for Academic Year 2020/2021 (Sep 2020 - Aug 2021)
  {
    id: "AD9892300",
    name: "Cameron Perry",
    rollNo: "34000",
    class: "V, A",
    gender: "Male",
    joinedOn: "5 Sep 2020",
    status: "Active",
  },
  {
    id: "AD9892301",
    name: "Paisley Powell",
    rollNo: "34001",
    class: "V, B",
    gender: "Female",
    joinedOn: "10 Sep 2020",
    status: "Active",
  },
  {
    id: "AD9892302",
    name: "Adrian Long",
    rollNo: "34002",
    class: "VI, A",
    gender: "Male",
    joinedOn: "15 Sep 2020",
    status: "Active",
  },
  {
    id: "AD9892303",
    name: "Skylar Patterson",
    rollNo: "34003",
    class: "V, A",
    gender: "Female",
    joinedOn: "20 Sep 2020",
    status: "Active",
  },
  {
    id: "AD9892304",
    name: "Hudson Hughes",
    rollNo: "34004",
    class: "VII, B",
    gender: "Male",
    joinedOn: "25 Sep 2020",
    status: "Active",
  },
  {
    id: "AD9892305",
    name: "Kennedy Flores",
    rollNo: "34005",
    class: "V, B",
    gender: "Female",
    joinedOn: "1 Oct 2020",
    status: "Active",
  },
  {
    id: "AD9892306",
    name: "Colton Washington",
    rollNo: "34006",
    class: "VI, A",
    gender: "Male",
    joinedOn: "5 Oct 2020",
    status: "Active",
  },
  {
    id: "AD9892307",
    name: "Genesis Butler",
    rollNo: "34007",
    class: "V, A",
    gender: "Female",
    joinedOn: "10 Oct 2020",
    status: "Active",
  },
  {
    id: "AD9892308",
    name: "Jordan Simmons",
    rollNo: "34008",
    class: "VIII, B",
    gender: "Male",
    joinedOn: "15 Oct 2020",
    status: "Active",
  },
  {
    id: "AD9892309",
    name: "Kinsley Foster",
    rollNo: "34009",
    class: "V, B",
    gender: "Female",
    joinedOn: "20 Oct 2020",
    status: "Active",
  },
  {
    id: "AD9892310",
    name: "Landon Bryant",
    rollNo: "34010",
    class: "VI, A",
    gender: "Male",
    joinedOn: "15 Jan 2021",
    status: "Active",
  },
  {
    id: "AD9892311",
    name: "Naomi Alexander",
    rollNo: "34011",
    class: "V, A",
    gender: "Female",
    joinedOn: "20 Jan 2021",
    status: "Active",
  },
  {
    id: "AD9892312",
    name: "Asher Russell",
    rollNo: "34012",
    class: "VII, B",
    gender: "Male",
    joinedOn: "25 Jan 2021",
    status: "Active",
  },
  {
    id: "AD9892313",
    name: "Aaliyah Griffin",
    rollNo: "34013",
    class: "V, B",
    gender: "Female",
    joinedOn: "1 Feb 2021",
    status: "Active",
  },
  {
    id: "AD9892314",
    name: "Carson Diaz",
    rollNo: "34014",
    class: "VI, A",
    gender: "Male",
    joinedOn: "5 Feb 2021",
    status: "Active",
  },
  {
    id: "AD9892315",
    name: "Quinn Hayes",
    rollNo: "34015",
    class: "V, A",
    gender: "Female",
    joinedOn: "10 Feb 2021",
    status: "Active",
  },

  // Additional students for Academic Year 2019/2020 (Sep 2019 - Aug 2020)
  {
    id: "AD9892250",
    name: "Maverick Sullivan",
    rollNo: "33500",
    class: "VI, A",
    gender: "Male",
    joinedOn: "5 Sep 2019",
    status: "Active",
  },
  {
    id: "AD9892251",
    name: "Ivy Wallace",
    rollNo: "33501",
    class: "VI, B",
    gender: "Female",
    joinedOn: "10 Sep 2019",
    status: "Active",
  },
  {
    id: "AD9892252",
    name: "Silas West",
    rollNo: "33502",
    class: "VII, A",
    gender: "Male",
    joinedOn: "15 Sep 2019",
    status: "Active",
  },
  {
    id: "AD9892253",
    name: "Willow Gardner",
    rollNo: "33503",
    class: "VI, A",
    gender: "Female",
    joinedOn: "20 Sep 2019",
    status: "Active",
  },
  {
    id: "AD9892254",
    name: "Miles Webb",
    rollNo: "33504",
    class: "VIII, B",
    gender: "Male",
    joinedOn: "25 Sep 2019",
    status: "Active",
  },
  {
    id: "AD9892255",
    name: "Everly Greene",
    rollNo: "33505",
    class: "VI, B",
    gender: "Female",
    joinedOn: "1 Oct 2019",
    status: "Active",
  },
  {
    id: "AD9892256",
    name: "Sawyer Newman",
    rollNo: "33506",
    class: "VII, A",
    gender: "Male",
    joinedOn: "5 Oct 2019",
    status: "Active",
  },
  {
    id: "AD9892257",
    name: "Ellie Castillo",
    rollNo: "33507",
    class: "VI, A",
    gender: "Female",
    joinedOn: "10 Oct 2019",
    status: "Active",
  },
  {
    id: "AD9892258",
    name: "Bryson Mendoza",
    rollNo: "33508",
    class: "VIII, B",
    gender: "Male",
    joinedOn: "15 Oct 2019",
    status: "Active",
  },
  {
    id: "AD9892259",
    name: "Isla Valdez",
    rollNo: "33509",
    class: "VI, B",
    gender: "Female",
    joinedOn: "20 Oct 2019",
    status: "Active",
  },
  {
    id: "AD9892260",
    name: "Brayden Castillo",
    rollNo: "33510",
    class: "VII, A",
    gender: "Male",
    joinedOn: "15 Jan 2020",
    status: "Active",
  },
  {
    id: "AD9892261",
    name: "Aurora Reeves",
    rollNo: "33511",
    class: "VI, A",
    gender: "Female",
    joinedOn: "20 Jan 2020",
    status: "Active",
  },
  {
    id: "AD9892262",
    name: "Jameson Hunt",
    rollNo: "33512",
    class: "VIII, B",
    gender: "Male",
    joinedOn: "25 Jan 2020",
    status: "Active",
  },
  {
    id: "AD9892263",
    name: "Nova Tucker",
    rollNo: "33513",
    class: "VI, B",
    gender: "Female",
    joinedOn: "1 Feb 2020",
    status: "Active",
  },
  {
    id: "AD9892264",
    name: "Declan Wheeler",
    rollNo: "33514",
    class: "VII, A",
    gender: "Male",
    joinedOn: "5 Feb 2020",
    status: "Active",
  },
  {
    id: "AD9892265",
    name: "Emilia Cross",
    rollNo: "33515",
    class: "VI, A",
    gender: "Female",
    joinedOn: "10 Feb 2020",
    status: "Active",
  },

  // Students who left/graduated (with leftOn dates)
  {
    id: "AD9892600",
    name: "Thomas Bennett",
    rollNo: "32001",
    class: "XII, A",
    gender: "Male",
    joinedOn: "5 Sep 2018",
    leftOn: "20 Jun 2020",
    status: "Inactive",
  },
  {
    id: "AD9892601",
    name: "Rachel Foster",
    rollNo: "32002",
    class: "XII, B",
    gender: "Female",
    joinedOn: "10 Sep 2019",
    leftOn: "25 Jun 2021",
    status: "Inactive",
  },
  {
    id: "AD9892602",
    name: "Kevin Hughes",
    rollNo: "32003",
    class: "X, A",
    gender: "Male",
    joinedOn: "15 Sep 2017",
    leftOn: "15 Jul 2019",
    status: "Inactive",
  },
  {
    id: "AD9892603",
    name: "Monica Price",
    rollNo: "32004",
    class: "XI, B",
    gender: "Female",
    joinedOn: "20 Sep 2020",
    leftOn: "30 Jun 2022",
    status: "Inactive",
  },
  {
    id: "AD9892604",
    name: "Brandon Russell",
    rollNo: "32005",
    class: "IX, A",
    gender: "Male",
    joinedOn: "5 Sep 2021",
    leftOn: "20 Aug 2023",
    status: "Inactive",
  },
  {
    id: "AD9892605",
    name: "Stephanie Griffin",
    rollNo: "32006",
    class: "VIII, B",
    gender: "Female",
    joinedOn: "10 Sep 2022",
    leftOn: "15 Jul 2024",
    status: "Inactive",
  },
];

export default function AllStudentsPage() {
  const academicYearContext = useAcademicYear();
  const { selectedYear } = academicYearContext;

  const [students] = useState<Student[]>(sampleStudents);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(8); // 8 for grid, 10 for table
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const previousCountRef = useRef(8);

  // Filter fields configuration
  const filterFields: FilterField[] = [
    {
      id: "class",
      label: "Class",
      options: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"],
      width: "half",
    },
    {
      id: "section",
      label: "Section",
      options: ["A", "B"],
      width: "half",
    },
    {
      id: "name",
      label: "Name",
      options: ["A-E", "F-J", "K-O", "P-T", "U-Z"],
      width: "full",
    },
    {
      id: "gender",
      label: "Gender",
      options: ["Male", "Female"],
      width: "half",
    },
    {
      id: "status",
      label: "Status",
      options: ["Active", "Inactive"],
      width: "half",
    },
  ];

  // Filter state
  const [filters, setFilters] = useState<FilterValues>({});
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string } | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);

  // Sort state
  const [sortOption, setSortOption] = useState<string>("ascending");
  const [isSorting, setIsSorting] = useState(false);

  // Refresh state
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sort options
  const sortOptions = [
    { label: "Ascending", value: "ascending" },
    { label: "Descending", value: "descending" },
    { label: "Recently Viewed", value: "recently_viewed" },
    { label: "Recently Added", value: "recently_added" },
  ];

  // Parse date string in format "DD MMM YYYY" to Date object
  const parseJoinedOnDate = (dateStr: string): Date | null => {
    try {
      // Handle format like "10 Jan 2017" or "25 May 2024"
      const months: { [key: string]: number } = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
      };

      const parts = dateStr.trim().split(" ");
      if (parts.length !== 3) return null;

      const day = parseInt(parts[0]);
      const month = months[parts[1]];
      const year = parseInt(parts[2]);

      if (isNaN(day) || month === undefined || isNaN(year)) return null;

      return new Date(year, month, day);
    } catch {
      return null;
    }
  };

  // Parse date string in format "MM/DD/YYYY" to Date object
  const parseDateRangeDate = (dateStr: string): Date | null => {
    try {
      const parts = dateStr.split("/");
      if (parts.length !== 3) return null;

      const month = parseInt(parts[0]) - 1; // 0-indexed
      const day = parseInt(parts[1]);
      const year = parseInt(parts[2]);

      if (isNaN(month) || isNaN(day) || isNaN(year)) return null;

      return new Date(year, month, day);
    } catch {
      return null;
    }
  };

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setIsFiltering(true);
    // Delay to allow exit animation
    setTimeout(() => {
      setDateRange({ startDate, endDate });
      const initialCount = viewMode === "grid" ? 8 : 10;
      setDisplayedCount(initialCount); // Reset to first page when date range changes
      setTimeout(() => {
        setIsFiltering(false);
      }, 100);
    }, 300);
  };

  const handleFilterChange = (updatedFilters: FilterValues) => {
    setIsFiltering(true);
    // Delay to allow exit animation
    setTimeout(() => {
      setFilters(updatedFilters);
      const initialCount = viewMode === "grid" ? 8 : 10;
      setDisplayedCount(initialCount); // Reset to first page when filters change
      setTimeout(() => {
        setIsFiltering(false);
      }, 100);
    }, 300);
  };

  const handleClearFilters = () => {
    setIsFiltering(true);
    setTimeout(() => {
      setFilters({});
      setDateRange(null);
      const initialCount = viewMode === "grid" ? 8 : 10;
      setDisplayedCount(initialCount);
      setTimeout(() => {
        setIsFiltering(false);
      }, 100);
    }, 300);
  };

  // Check if there are active filters
  const hasActiveFilters =
    Object.values(filters).some((values) => values && values.length > 0) ||
    dateRange !== null;

  const handleSortChange = (sortValue: string) => {
    setIsSorting(true);
    // Delay to allow exit animation
    setTimeout(() => {
      setSortOption(sortValue);
      setTimeout(() => {
        setIsSorting(false);
      }, 100);
    }, 300);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Delay to allow exit animation
    setTimeout(() => {
      // Reset to first page when refreshing
      const initialCount = viewMode === "grid" ? 8 : 10;
      setDisplayedCount(initialCount);
      setTimeout(() => {
        setIsRefreshing(false);
      }, 100);
    }, 300);
  };

  const handlePrint = () => {
    // Create a print window with the current data
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Get current date and time
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Use filtered students (all of them, not just displayed)
    const studentsToPrint = filteredStudents;

    // Build the HTML content
    let htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Student Records - ${dateStr}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 20px;
              color: #1f2937;
            }

            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #3b82f6;
            }

            .header h1 {
              font-size: 28px;
              color: #1f2937;
              margin-bottom: 8px;
            }

            .header .subtitle {
              font-size: 14px;
              color: #6b7280;
              margin-bottom: 4px;
            }

            .meta-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
              font-size: 12px;
              color: #6b7280;
            }

            ${viewMode === 'grid' ? `
              .grid-container {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 16px;
                margin-bottom: 20px;
              }

              .student-card {
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                padding: 16px;
                break-inside: avoid;
              }

              .student-header {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 12px;
              }

              .student-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 16px;
              }

              .student-name {
                font-weight: 600;
                font-size: 14px;
                color: #1f2937;
              }

              .student-id {
                font-size: 11px;
                color: #3b82f6;
              }

              .student-info {
                display: grid;
                gap: 8px;
                font-size: 12px;
              }

              .info-row {
                display: flex;
                justify-content: space-between;
              }

              .info-label {
                color: #6b7280;
                font-weight: 500;
              }

              .info-value {
                color: #1f2937;
              }

              .status {
                display: inline-block;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 600;
              }

              .status-active {
                background-color: #dcfce7;
                color: #166534;
              }

              .status-inactive {
                background-color: #fee2e2;
                color: #991b1b;
              }
            ` : `
              table {
                width: 100%;
                border-collapse: collapse;
                font-size: 11px;
              }

              thead {
                background-color: #f3f4f6;
              }

              th {
                padding: 12px 8px;
                text-align: left;
                font-weight: 600;
                color: #374151;
                border-bottom: 2px solid #d1d5db;
              }

              td {
                padding: 10px 8px;
                border-bottom: 1px solid #e5e7eb;
              }

              tbody tr:hover {
                background-color: #f9fafb;
              }

              .student-name-cell {
                display: flex;
                align-items: center;
                gap: 8px;
              }

              .table-avatar {
                width: 28px;
                height: 28px;
                border-radius: 50%;
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 12px;
                flex-shrink: 0;
              }

              .admission-no {
                color: #3b82f6;
                font-weight: 600;
              }

              .status {
                display: inline-block;
                padding: 3px 10px;
                border-radius: 12px;
                font-size: 10px;
                font-weight: 600;
              }

              .status-active {
                background-color: #dcfce7;
                color: #166534;
              }

              .status-inactive {
                background-color: #fee2e2;
                color: #991b1b;
              }
            `}

            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              font-size: 11px;
              color: #6b7280;
            }

            @media print {
              body {
                padding: 10px;
              }

              .no-print {
                display: none;
              }

              @page {
                margin: 1cm;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Student Records</h1>
            <div class="subtitle">Educo - School ERP System</div>
            <div class="subtitle">View: ${viewMode === 'grid' ? 'Grid View' : 'Table View'}</div>
          </div>

          <div class="meta-info">
            <div>
              <strong>Date:</strong> ${dateStr} | <strong>Time:</strong> ${timeStr}
            </div>
            <div>
              <strong>Total Students:</strong> ${studentsToPrint.length}
            </div>
          </div>
    `;

    if (viewMode === 'grid') {
      // Grid view HTML
      htmlContent += '<div class="grid-container">';
      studentsToPrint.forEach((student) => {
        htmlContent += `
          <div class="student-card">
            <div class="student-header">
              <div class="student-avatar">${student.name.charAt(0)}</div>
              <div>
                <div class="student-name">${student.name}</div>
                <div class="student-id">${student.id}</div>
              </div>
            </div>
            <div class="student-info">
              <div class="info-row">
                <span class="info-label">Roll No:</span>
                <span class="info-value">${student.rollNo}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Class:</span>
                <span class="info-value">${student.class}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Gender:</span>
                <span class="info-value">${student.gender}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Status:</span>
                <span class="status ${student.status === 'Active' ? 'status-active' : 'status-inactive'}">${student.status}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Joined:</span>
                <span class="info-value">${student.joinedOn}</span>
              </div>
            </div>
          </div>
        `;
      });
      htmlContent += '</div>';
    } else {
      // Table view HTML
      htmlContent += `
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Admission No</th>
              <th>Roll No</th>
              <th>Name</th>
              <th>Class</th>
              <th>Section</th>
              <th>Gender</th>
              <th>Status</th>
              <th>Date of Join</th>
            </tr>
          </thead>
          <tbody>
      `;

      studentsToPrint.forEach((student, index) => {
        const [classNum, section] = student.class.split(", ");
        htmlContent += `
          <tr>
            <td>${index + 1}</td>
            <td class="admission-no">${student.id}</td>
            <td>${student.rollNo}</td>
            <td>
              <div class="student-name-cell">
                <div class="table-avatar">${student.name.charAt(0)}</div>
                <span>${student.name}</span>
              </div>
            </td>
            <td>${classNum}</td>
            <td>${section}</td>
            <td>${student.gender}</td>
            <td><span class="status ${student.status === 'Active' ? 'status-active' : 'status-inactive'}">${student.status}</span></td>
            <td>${student.joinedOn}</td>
          </tr>
        `;
      });

      htmlContent += `
          </tbody>
        </table>
      `;
    }

    htmlContent += `
          <div class="footer">
            <p>Generated on ${dateStr} at ${timeStr}</p>
            <p style="margin-top: 4px;">Educo School ERP System - Student Records Report</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  };

  const handleExportPDF = () => {
    // Export all filtered students to PDF
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
    const filename = `students_${dateStr}.pdf`;

    exportStudentsToPDF(filteredStudents, filename);
  };

  const handleExportExcel = () => {
    // Export all filtered students to Excel
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
    const filename = `students_${dateStr}.xlsx`;

    exportStudentsToExcel(filteredStudents, filename);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Reset displayedCount when view mode changes
  useEffect(() => {
    if (isMounted) {
      const initialCount = viewMode === "grid" ? 8 : 10;
      setDisplayedCount(initialCount);
      previousCountRef.current = initialCount;
    }
  }, [viewMode, isMounted]);

  // Handle academic year changes
  useEffect(() => {
    if (isMounted) {
      setIsFiltering(true);
      setTimeout(() => {
        // Reset to initial count based on view mode when academic year changes
        const initialCount = viewMode === "grid" ? 8 : 10;
        setDisplayedCount(initialCount);
        setTimeout(() => {
          setIsFiltering(false);
        }, 100);
      }, 300);
    }
  }, [selectedYear, isMounted, viewMode]);


  useEffect(() => {
    // Scroll to newly loaded content after displayedCount increases
    if (displayedCount > previousCountRef.current && gridRef.current) {
      // Find the first newly loaded card
      const cards = gridRef.current.children;
      const firstNewCardIndex = previousCountRef.current;

      if (cards[firstNewCardIndex]) {
        // Smooth scroll to the first new card
        setTimeout(() => {
          (cards[firstNewCardIndex] as HTMLElement).scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      }

      previousCountRef.current = displayedCount;
    }
  }, [displayedCount]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    // Simulate loading delay
    setTimeout(() => {
      // Load 8 more cards
      setDisplayedCount((prev) => prev + 8);
      setIsLoadingMore(false);
    }, 500);
  };

  // Filter students by academic year first
  const academicYearFilteredStudents = filterStudentsByAcademicYear(students, selectedYear);

  // Apply sorting to academically filtered students
  const sortedStudents = [...academicYearFilteredStudents].sort((a, b) => {
    switch (sortOption) {
      case "ascending":
        // Sort by name A-Z
        return a.name.localeCompare(b.name);
      case "descending":
        // Sort by name Z-A
        return b.name.localeCompare(a.name);
      case "recently_viewed":
        // Sort by ID descending (simulating recently viewed)
        return b.id.localeCompare(a.id);
      case "recently_added":
        // Sort by joined date descending (most recent first)
        const dateA = parseJoinedOnDate(a.joinedOn);
        const dateB = parseJoinedOnDate(b.joinedOn);
        if (!dateA || !dateB) return 0;
        return dateB.getTime() - dateA.getTime();
      default:
        // Default: Sort by joined date ascending (oldest first)
        const defaultDateA = parseJoinedOnDate(a.joinedOn);
        const defaultDateB = parseJoinedOnDate(b.joinedOn);
        if (!defaultDateA || !defaultDateB) return 0;
        return defaultDateA.getTime() - defaultDateB.getTime();
    }
  });

  // Apply additional filters to students
  const filteredStudents = sortedStudents.filter((student) => {
    // Check date range filter
    if (dateRange) {
      const joinedDate = parseJoinedOnDate(student.joinedOn);
      const startDate = parseDateRangeDate(dateRange.startDate);
      const endDate = parseDateRangeDate(dateRange.endDate);

      if (joinedDate && startDate && endDate) {
        // Normalize dates to start of day for comparison
        const joinedDateNormalized = new Date(joinedDate.getFullYear(), joinedDate.getMonth(), joinedDate.getDate());
        const startDateNormalized = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const endDateNormalized = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

        if (joinedDateNormalized < startDateNormalized || joinedDateNormalized > endDateNormalized) {
          return false;
        }
      }
    }

    // If no filters are active, show all students
    const hasFilters = Object.values(filters).some((values) => values && values.length > 0);
    if (!hasFilters) return true;

    // Check each filter type (AND logic between types, OR within type)
    const matchesClass = !filters.class || filters.class.length === 0 || filters.class.some((cls) => {
      return student.class.startsWith(cls);
    });

    const matchesSection = !filters.section || filters.section.length === 0 || filters.section.some((section) => {
      return student.class.includes(section);
    });

    const matchesName = !filters.name || filters.name.length === 0 || filters.name.some((range) => {
      const firstLetter = student.name.charAt(0).toUpperCase();
      // Map ranges like "A-E" to check if first letter is in range
      if (range === "A-E") return firstLetter >= "A" && firstLetter <= "E";
      if (range === "F-J") return firstLetter >= "F" && firstLetter <= "J";
      if (range === "K-O") return firstLetter >= "K" && firstLetter <= "O";
      if (range === "P-T") return firstLetter >= "P" && firstLetter <= "T";
      if (range === "U-Z") return firstLetter >= "U" && firstLetter <= "Z";
      return false;
    });

    const matchesGender = !filters.gender || filters.gender.length === 0 || filters.gender.includes(student.gender);

    const matchesStatus = !filters.status || filters.status.length === 0 || filters.status.includes(student.status);

    return matchesClass && matchesSection && matchesName && matchesGender && matchesStatus;
  });

  const displayedStudents = filteredStudents.slice(0, displayedCount);
  const hasMore = displayedCount < filteredStudents.length;

  // Check if we're in a loading state
  const isLoading = isFiltering || isSorting || isRefreshing;

  if (!isMounted) {
    return null;
  }

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center lg:justify-between py-4 mb-0 gap-4 animate-in fade-in slide-in-from-top-2 duration-700 ease-out">
        {/* Left Section - Title and Breadcrumb */}
        <PageHeader
          title="Students"
          breadcrumbs={[
            { label: "Dashboard" },
            { label: "Peoples" },
            { label: viewMode === "grid" ? "Students Grid" : "Students Table", isActive: true },
          ]}
        />

        {/* Right Section - Action Buttons */}
        <PageActions
          addButtonLabel="Add Student"
          onRefresh={handleRefresh}
          onPrint={handlePrint}
          onExportPDF={handleExportPDF}
          onExportExcel={handleExportExcel}
        />
      </div>

      {/* Filters Bar */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-150 ease-out mb-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
          {/* Left Section - Date and Filter */}
          <div className="flex items-center gap-3 lg:flex-1">
            {/* Date Range Picker */}
            <DateRangePicker onChange={handleDateRangeChange} />

            {/* Filter */}
            <FilterButton fields={filterFields} onFilterChange={handleFilterChange} />

            {/* Student Count Badge (Grid View Only) - Shown on all screens */}
            {viewMode === "grid" && (
              <div className="flex items-center px-3 lg:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900">
                <span className="text-xs lg:text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap">
                  1 to {Math.min(displayedCount, filteredStudents.length)} of {filteredStudents.length}
                </span>
              </div>
            )}
          </div>

          {/* Right Section - View Toggle and Sort */}
          <div className="flex items-center justify-end gap-3 lg:flex-1">
            {/* View Toggle */}
            <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />

            {/* Sort */}
            <SortButton
              options={sortOptions}
              defaultOption="ascending"
              onSortChange={handleSortChange}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-150 ease-out" style={{ overflow: 'visible' }}>
        {/* Students Grid or Table */}
        <div className="relative min-h-[400px]" style={{ overflow: 'visible' }}>
          {viewMode === "grid" ? (
            <div
              key={`grid-view-${isFiltering ? 'filtering' : 'filtered'}-${isSorting ? 'sorting' : 'sorted'}-${isRefreshing ? 'refreshing' : 'refreshed'}-${sortOption}`}
              className="opacity-100 scale-100 translate-y-0 animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-[450ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{ overflow: 'visible' }}
            >
              {isLoading ? (
                <PageSpinner message={isRefreshing ? "Refreshing..." : isSorting ? "Sorting..." : "Filtering..."} size="md" />
              ) : displayedStudents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  {/* Icon with gradient background */}
                  <div className="relative mb-4">
                    {/* Gradient background circle */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/20 dark:to-gray-800/20 midnight:from-cyan-500/5 midnight:to-cyan-600/5 purple:from-pink-500/5 purple:to-pink-600/5 animate-pulse" />
                    </div>

                    {/* Icon */}
                    <div className="relative z-10 flex items-center justify-center w-16 h-16">
                      <svg className="w-8 h-8 text-gray-400 dark:text-gray-500 midnight:text-cyan-400/50 purple:text-pink-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-1">
                    No data available
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
                    {hasActiveFilters
                      ? 'No results match the current filters. Try adjusting your filters.'
                      : 'No students found'}
                  </p>

                  {/* Clear filters link */}
                  {hasActiveFilters && (
                    <button
                      onClick={handleClearFilters}
                      className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:underline cursor-pointer transition-colors duration-200"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2 pr-2 md:pr-0" style={{ overflow: 'visible' }}>
                    {displayedStudents.map((student, index) => {
                      // Check if student matches current search/filters
                      const matchesSearch = searchQuery.trim() === "" ||
                        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        student.class.toLowerCase().includes(searchQuery.toLowerCase());

                      const shouldHide = searchQuery.trim() !== "" && !matchesSearch;

                      return (
                        <div
                          key={student.id}
                          style={{
                            opacity: shouldHide ? 0 : 1,
                            height: shouldHide ? '0' : 'auto',
                            overflow: shouldHide ? 'hidden' : 'visible',
                            transition: 'opacity 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                            transitionDelay: `${index / 40}s`,
                          } as React.CSSProperties}
                        >
                          <StudentCard student={student} colorIndex={index} />
                        </div>
                      );
                    })}
                  </div>

                  {/* Load More Button */}
                  {hasMore && (
                    <LoadMoreButton
                      onClick={handleLoadMore}
                      isLoading={isLoadingMore}
                      text="Load More"
                      loadingText="Loading..."
                    />
                  )}
                </>
              )}
            </div>
          ) : (
            <div
              key={`list-view-${isFiltering ? 'filtering' : 'filtered'}-${isSorting ? 'sorting' : 'sorted'}-${isRefreshing ? 'refreshing' : 'refreshed'}-${sortOption}`}
              className="opacity-100 scale-100 translate-y-0 animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-[450ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            >
              <StudentTable
                students={filteredStudents}
                isLoading={isLoading}
                loadingMessage={isRefreshing ? "Refreshing..." : isSorting ? "Sorting..." : "Filtering..."}
                onClearFilters={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
                totalStudentsCount={students.length}
              />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
