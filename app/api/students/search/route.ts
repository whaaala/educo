import { NextRequest, NextResponse } from "next/server";
import { getAllStudents, type StudentData } from "@/lib/mockStudents";

// This is a placeholder API route
// In production, replace this with actual database queries (e.g., Supabase)
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") || "";
    const excludeIds = searchParams.get("excludeIds")?.split(",").filter(Boolean) || [];
    const currentStudentId = searchParams.get("currentStudentId") || "";
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // TODO: Replace with actual database query
    // Example with Supabase:
    // const { data, error } = await supabase
    //   .from('students')
    //   .select('id, first_name, last_name, class_name, academic_year')
    //   .neq('id', currentStudentId)
    //   .not('id', 'in', `(${excludeIds.join(',')})`)
    //   .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,student_id.ilike.%${query}%`)
    //   .order('first_name')
    //   .range(offset, offset + limit - 1);

    // Get students from shared mock data (same source as main table)
    const allStudents = getAllStudents();

    // Filter and transform students
    let filteredStudents = allStudents.filter((student: StudentData) => {
      // Exclude current student
      if (currentStudentId && student.id === currentStudentId) return false;
      
      // Exclude already selected siblings
      if (excludeIds.includes(student.id)) return false;

      // Only include active students
      if (student.status !== "Active") return false;

      // Filter by search query
      if (query) {
        const searchLower = query.toLowerCase().trim();
        const nameLower = student.name.toLowerCase();
        const idLower = student.id.toLowerCase();
        const classLower = student.class.toLowerCase();
        const rollNoLower = student.rollNo.toLowerCase();
        
        // Split name into first and last for better searching
        const nameParts = student.name.split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";
        
        return (
          nameLower.includes(searchLower) ||
          firstName.toLowerCase().includes(searchLower) ||
          lastName.toLowerCase().includes(searchLower) ||
          idLower.includes(searchLower) ||
          classLower.includes(searchLower) ||
          rollNoLower.includes(searchLower)
        );
      }

      // If no query, return all (but this shouldn't happen as we require 2+ chars)
      return false; // Don't return all students when query is empty
    });

    // Apply pagination
    const paginatedStudents = filteredStudents.slice(offset, offset + limit);

    // Format response - transform to match expected format
    const results = paginatedStudents.map((student: StudentData) => {
      // Split name into first and last
      const nameParts = student.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      
      // Convert class format from "V, B" to "Class V-B" or keep as is
      const classDisplay = student.class.includes(",") 
        ? student.class.replace(", ", "-") 
        : student.class;

      return {
        value: student.id,
        label: `${student.name} - ${classDisplay}`,
        firstName: firstName,
        lastName: lastName,
        class: classDisplay,
      };
    });

    return NextResponse.json({
      students: results,
      total: filteredStudents.length,
      hasMore: offset + limit < filteredStudents.length,
    });
  } catch (error) {
    console.error("Error searching students:", error);
    return NextResponse.json(
      { error: "Failed to search students" },
      { status: 500 }
    );
  }
}

