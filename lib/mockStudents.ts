// Shared mock student data
// In production, this should be replaced with actual database queries

export interface MockStudent {
  id: string;
  name: string;
  rollNo: string;
  class: string;
  gender: string;
  joinedOn: string;
  status: string;
  avatar?: string;
  leftOn?: string;
}

// This extracts the student data structure from the main students page
// In production, replace this with actual database queries
export const getAllMockStudents = (): MockStudent[] => {
  // For now, return a sample that matches the main table format
  // In production, this would fetch from your database
  return [
    {
      id: "AD9892313",
      name: "Aaliyah Griffin",
      rollNo: "34013",
      class: "V, B",
      gender: "Female",
      joinedOn: "1 Feb 2021",
      status: "Active",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
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
      joinedOn: "20 Jun 20215",
      status: "Active",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    {
      id: "AD9892429",
      name: "Ralph Claudia",
      rollNo: "35008",
      class: "II, B",
      gender: "Male",
      joinedOn: "20 Jun 20215",
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
      id: "AD9892411",
      name: "Addison Reed",
      rollNo: "35011",
      class: "III, A",
      gender: "Female",
      joinedOn: "20 Jan 2023",
      status: "Active",
      avatar: "https://i.pravatar.cc/150?img=41",
    },
    {
      id: "AD9892358",
      name: "Aaron Watson",
      rollNo: "34508",
      class: "VII, B",
      gender: "Male",
      joinedOn: "15 Oct 2021",
      status: "Active",
      avatar: "https://i.pravatar.cc/150?img=54",
    },
    // Add more students as needed - this is just a sample
    // In production, this would fetch from your actual database
  ];
};

