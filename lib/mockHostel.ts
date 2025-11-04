// Shared mock hostel data

export interface HostelOption {
  value: string;
  label: string;
}

// Sample hostel names grouped by category
export const sampleHostels: HostelOption[] = [
  // Boys Hostels
  { value: "Mandela House (Boys)", label: "Mandela House (Boys)" },
  { value: "Nyerere Hall (Boys)", label: "Nyerere Hall (Boys)" },
  { value: "Azikiwe Block (Boys)", label: "Azikiwe Block (Boys)" },
  // Girls Hostels
  { value: "Queens Hall (Girls)", label: "Queens Hall (Girls)" },
  { value: "Princess House (Girls)", label: "Princess House (Girls)" },
  { value: "Duchess Block (Girls)", label: "Duchess Block (Girls)" },
  // Mixed/Junior Hostels
  { value: "Junior Block A", label: "Junior Block A" },
  { value: "Junior Block B", label: "Junior Block B" },
];

/**
 * Get all hostels as dropdown options
 */
export function getHostels(): HostelOption[] {
  return sampleHostels;
}

