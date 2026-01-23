// import React, { useEffect, useState } from "react";
// import * as XLSX from "xlsx";

// const ReadXL = () => {
//   const [students, setStudents] = useState([]);
//   const [totalClasses, setTotalClasses] = useState(null);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetch("/attandance2.xlsx")
//       .then((res) => {
//         if (!res.ok) throw new Error("Excel file not found");
//         return res.arrayBuffer();
//       })
//       .then((buffer) => {
//         const workbook = XLSX.read(buffer, { type: "array" });
//         const sheetName = workbook.SheetNames[0];
//         const sheet = workbook.Sheets[sheetName];

//         const raw = XLSX.utils.sheet_to_json(sheet, {
//           header: 1,
//           defval: "",
//         });

//         // 🔹 Find "Total classes taken till today" row
//         const totalRow = raw.find((row) =>
//           row.some(
//             (cell) =>
//               typeof cell === "string" &&
//               cell.toLowerCase().includes("total classes taken")
//           )
//         );

//         if (totalRow) {
//           const total = totalRow.find((cell) => typeof cell === "number");
//           setTotalClasses(total);
//         }

//         // 🔹 Find header row (contains "S.No")
//         const headerIndex = raw.findIndex((row) => row.includes("S.No"));
//         const headers = raw[headerIndex];

//         // 🔹 Student rows start after header
//         const dataRows = raw.slice(headerIndex + 1);

//         const parsedStudents = dataRows
//           .filter((row) => typeof row[0] === "number") // S.No is number
//           .map((row) => ({
//             "S.No": row[0],
//             "Regd. No": row[1],
//             Name: row[2],
//             Total: row[headers.indexOf("Total")],
//             Percentage: row[headers.indexOf("Percentage")],
//             "Updated Total": row[headers.indexOf("updated total")],
//             "Updated %": row[headers.indexOf("updated percentage")],
//           }));

//         setStudents(parsedStudents);
//       })
//       .catch((err) => {
//         console.error(err);
//         setError(err.message);
//       });
//   }, []);

//   if (error) {
//     return <h3 style={{ color: "red" }}>❌ {error}</h3>;
//   }

//   if (students.length === 0) {
//     return <p>Loading attendance data...</p>;
//   }

//   return (
//   <div>
//     <h2>📊 Attendance Data (CSE)</h2>

//     {error && <h3 style={{ color: "red" }}>❌ {error}</h3>}

//     {totalClasses && (
//       <p>
//         📘 Total Classes Taken Till Today:{" "}
//         <strong>{totalClasses}</strong>
//       </p>
//     )}

//     <table border="1" cellPadding="8" width="100%">
//       <thead>
//         <tr>
//           {students.length > 0 &&
//             Object.keys(students[0]).map((key) => (
//               <th key={key}>{key}</th>
//             ))}
//         </tr>
//       </thead>

//       <tbody>
//         {students.length === 0 ? (
//           <tr>
//             <td colSpan="7" style={{ textAlign: "center" }}>
//               Loading attendance data...
//             </td>
//           </tr>
//         ) : (
//           students.map((stu, i) => (
//             <tr key={i}>
//               {Object.values(stu).map((val, j) => (
//                 <td key={j}>{val}</td>
//               ))}
//             </tr>
//           ))
//         )}
//       </tbody>
//     </table>
//   </div>
// );

// };

// export default ReadXL;

import React from 'react'

const ReadXL = () => {
  return (
    <div>
      
    </div>
  )
}

export default ReadXL

