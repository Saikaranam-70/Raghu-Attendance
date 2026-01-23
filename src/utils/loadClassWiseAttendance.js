import * as XLSX from "xlsx";

export const loadClassWiseAttendanceFromExcel = async () => {
  const res = await fetch("/attendance2.xlsx");
  if (!res.ok) throw new Error("Excel file not found");

  const buffer = await res.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });

  const classWiseData = [];

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const raw = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    // 🔹 Total classes row
    const totalRow = raw.find((row) =>
      Object.values(row).some(
        (cell) =>
          typeof cell === "string" &&
          cell.toLowerCase().includes("total classes taken")
      )
    );

    const totalClasses = {
      dmgt: totalRow?.["DM&GT"] || 0,
      uhv: totalRow?.["UHV"] || 0,
      dlco: totalRow?.["DL&CO"] || 0,
      adsa: totalRow?.["ADSA"] || 0,
      java: totalRow?.["JAVA"] || 0,
      foss: totalRow?.["FOSS LAB"] || 0,
      pp: totalRow?.["PP"] || 0,
      nptel: totalRow?.["NPTEL"] || 0,
      crt: totalRow?.["CRT"] || 0,
      total: totalRow?.["Total"] || 0,
    };

    // 🔹 Students data
    const students = raw
      .filter((row) => typeof row["S.No"] === "number")
      .map((row) => ({
        sno: row["S.No"],
        regdNo: row["Regd. No"],
        name: row["Name of the student"],

        subjects: {
          dmgt: {
            attended: row["DM&GT"],
            percentage: row["__EMPTY"],
          },
          uhv: {
            attended: row["UHV"],
            percentage: row["__EMPTY_1"],
          },
          dlco: {
            attended: row["DL&CO"],
            percentage: row["__EMPTY_2"],
          },
          adsa: {
            attended: row["ADSA"],
            percentage: row["__EMPTY_3"],
          },
          java: {
            attended: row["JAVA"],
            percentage: row["__EMPTY_4"],
          },
          fossLab: {
            attended: row["FOSS LAB"],
            percentage: row["__EMPTY_5"],
          },
          pp: {
            attended: row["PP"],
            percentage: row["__EMPTY_6"],
          },
          nptel: {
            attended: row["NPTEL"],
            percentage: row["__EMPTY_7"],
          },
          crt: {
            attended: row["CRT"],
            percentage: row["__EMPTY_8"],
          },
        },

        totalAttended: row["Total"],
        totalPercentage: row["Percentage"],
        others: row["others"],
        mid1PlusOthers: row["mid1 + others"],
        updatedTotal: row["updated total"],
        updatedPercentage: row["updated percentage"],
      }));

    classWiseData.push({
      section: sheetName,
      totalClasses,
      students,
    });
  });

  return classWiseData;
};
