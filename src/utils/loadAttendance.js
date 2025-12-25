import * as XLSX from "xlsx";

export const loadAttendanceFromExcel = async () => {
  const res = await fetch("/attandance.xlsx");
  if (!res.ok) throw new Error("Excel file not found");

  const buffer = await res.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });

  const allSections = [];

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const raw = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    // 🔹 Total classes
    const totalRow = raw.find((row) =>
      Object.values(row).some(
        (cell) =>
          typeof cell === "string" &&
          cell.toLowerCase().includes("total classes taken")
      )
    );

    const totalClasses = totalRow
      ? Object.values(totalRow).find((v) => typeof v === "number")
      : 0;

    // 🔹 Students
    const students = raw
      .filter(
        (row) =>
          typeof row["RAGHU ENGINEERING COLLEGE (A)"] === "number"
      )
      .map((row) => ({
        sno: row["RAGHU ENGINEERING COLLEGE (A)"],
        regdNo: row["__EMPTY"],
        name: row["__EMPTY_1"],
        attended: row["__EMPTY_2"],
        percentage: row["__EMPTY_3"],
      }));

    allSections.push({
      section: sheetName,
      totalClasses,
      students,
    });
  });

  return allSections;
};
