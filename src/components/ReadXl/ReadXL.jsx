import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const ReadXL = () => {
  const [allData, setAllData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/attandance.xlsx")
      .then((res) => {
        if (!res.ok) throw new Error("Excel file not found");
        return res.arrayBuffer();
      })
      .then((buffer) => {
        const workbook = XLSX.read(buffer, { type: "array" });

        const result = [];

        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          const raw = XLSX.utils.sheet_to_json(sheet, { defval: "" });

          // 🔹 Find total classes row
          const totalRow = raw.find((row) =>
            Object.values(row).some(
              (cell) =>
                typeof cell === "string" &&
                cell.toLowerCase().includes("total classes taken")
            )
          );

          const totalClasses = totalRow
            ? Object.values(totalRow).find((v) => typeof v === "number")
            : null;

          // 🔹 Extract students
          const students = raw
            .filter(
              (row) =>
                typeof row["RAGHU ENGINEERING COLLEGE (A)"] === "number"
            )
            .map((row) => ({
              "S.No": row["RAGHU ENGINEERING COLLEGE (A)"],
              "Regd. No": row["__EMPTY"],
              Name: row["__EMPTY_1"],
              Total: row["__EMPTY_2"],
              Percentage: row["__EMPTY_3"],
            }));

          result.push({
            sheetName,
            totalClasses,
            students,
          });
        });

        setAllData(result);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, []);

  if (error) {
    return <h3 style={{ color: "red" }}>❌ {error}</h3>;
  }

  if (allData.length === 0) {
    return <p>Loading Excel data...</p>;
  }

  return (
    <div>
      <h2>📊 Attendance Data (All Sections)</h2>

      {allData.map((section, idx) => (
        <div key={idx} style={{ marginBottom: "40px" }}>
          <h3>🏫 Section: {section.sheetName}</h3>

          {section.totalClasses !== null && (
            <p>
              📘 Total Classes Taken Till Today:{" "}
              <strong>{section.totalClasses}</strong>
            </p>
          )}

          <table border="1" cellPadding="8" width="100%">
            <thead>
              <tr>
                {section.students.length > 0 &&
                  Object.keys(section.students[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
              </tr>
            </thead>

            <tbody>
              {section.students.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No student data
                  </td>
                </tr>
              ) : (
                section.students.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((val, j) => (
                      <td key={j}>{val}</td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default ReadXL;
