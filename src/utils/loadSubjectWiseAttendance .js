import * as XLSX from "xlsx";

export const loadSubjectWiseAttendance = async () => {
  const res = await fetch("/attendance2.xlsx");
  if (!res.ok) throw new Error("Excel file not found");

  const buffer = await res.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });

  const allStudents = [];

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];

    const raw = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: "",
    });

    // 🔹 Header row
    const headerRow = raw.find(row =>
      row.includes("Name of the student")
    );
    if (!headerRow) return;

    // 🔹 Total classes row
    const totalClassesRow = raw.find(row =>
      row.some(cell =>
        typeof cell === "string" &&
        cell.toLowerCase().includes("total classes taken")
      )
    );

    // 🔹 Subjects map
    const subjects = {};
    headerRow.forEach((cell, index) => {
      if (
        typeof cell === "string" &&
        ![
          "S.No",
          "Regd. No",
          "Name of the student",
          "Total",
          "Percentage",
          "others",
          "mid1 + others",
          "updated total",
          "updated percentage",
        ].includes(cell)
      ) {
        subjects[cell] = {
          index,
          total: Number(totalClassesRow?.[index]) || 0,
        };
      }
    });

    // 🔹 Students
    const students = raw
      .filter(row => typeof row[0] === "number")
      .map(row => {
        const subjectData = {};

        Object.entries(subjects).forEach(([subject, meta]) => {
          subjectData[subject] = {
            total: meta.total,
            attended: Number(row[meta.index]) || 0,
            percentage: Number(row[meta.index + 1]) || 0,
          };
        });

        return {
          regdNo: row[1],
          name: row[2],
          subjects: subjectData,
        };
      });

    // 🔥 MERGE into one array
    allStudents.push(...students);
  });

  // 🔥 Final merged output
  console.log("📊 MERGED Attendance (All Sections):", allStudents);

  return allStudents;
};
