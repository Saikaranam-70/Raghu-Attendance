// // import { useParams } from "react-router-dom";
// // import { useState } from "react";
// // import AttendanceCard from "../ui/AttendanceCard";
// // import AttendanceSliders from "../ui/AttendanceSliders";
// // import AttendanceCharts from "../ui/AttendanceCharts";

// // const StudentAttendance = () => {
// //   const { regdNo } = useParams();

// //   // MOCK DATA (replace with Excel lookup)
// //   const totalClasses = 423;
// //   const attended = 350;

// //   const [target, setTarget] = useState(75);
// //   const [futureClasses, setFutureClasses] = useState(1);
// //   const [futureAbsents, setFutureAbsents] = useState(0);

// //   const currentPercentage = (attended / totalClasses) * 100;

// //   const futureTotal = totalClasses + futureClasses;
// //   const futureAttended =
// //     attended + (futureClasses - futureAbsents);

// //   const futurePercentage =
// //     (futureAttended / futureTotal) * 100;

// //   const requiredAttendance =
// //     Math.ceil((target / 100) * futureTotal);

// //   const mustAttend =
// //     Math.max(0, requiredAttendance - futureAttended);

// //   return (
// //     <div className="min-h-screen bg-slate-100 p-6">
// //       <AttendanceCard
// //         regdNo={regdNo}
// //         attended={attended}
// //         total={totalClasses}
// //         percentage={currentPercentage}
// //       />

// //       <AttendanceSliders
// //         target={target}
// //         setTarget={setTarget}
// //         futureClasses={futureClasses}
// //         setFutureClasses={setFutureClasses}
// //         futureAbsents={futureAbsents}
// //         setFutureAbsents={setFutureAbsents}
// //       />

// //       <AttendanceCharts
// //         current={currentPercentage}
// //         future={futurePercentage}
// //         mustAttend={mustAttend}
// //       />
// //     </div>
// //   );
// // };

// // export default StudentAttendance;

// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { loadAttendanceFromExcel } from "../../utils/loadAttendance";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   TrendingUp,
//   TrendingDown,
//   Target,
//   Calendar,
//   AlertCircle,
//   CheckCircle,
//   BarChart3,
//   PieChart,
// } from "lucide-react";
// import { loadSubjectWiseAttendance } from "../../utils/loadSubjectWiseAttendance ";

// const StudentAttendance = () => {
//   const { regdNo } = useParams();
//   const [student, setStudent] = useState(null);
//   const [section, setSection] = useState(null);
//   const [error, setError] = useState("");

//   // Controls
//   const [target, setTarget] = useState(75);
//   const [classesPerDay, setClassesPerDay] = useState(6);
//   const [skipClasses, setSkipClasses] = useState(0);
//   const [skipMode, setSkipMode] = useState("classes"); // "classes" or "days"
//   const [subjectAttendance, setSubjectAttendance] = useState(null);


//   useEffect(() => {
//   loadSubjectWiseAttendance().then((allStudents) => {
//     const found = allStudents.find(
//       (s) => String(s.regdNo).trim() === String(regdNo).trim()
//     );
//     if (found) {
//       setSubjectAttendance(found.subjects);
//     }
//   });
// }, [regdNo]);


//   useEffect(() => {
//     loadAttendanceFromExcel()
//       .then((sections) => {
//         for (const sec of sections) {
//           const found = sec.students.find(
//             (s) => String(s.regdNo).trim() === String(regdNo).trim()
//           );
//           if (found) {
//             setStudent(found);
//             setSection(sec);
//             return;
//           }
//         }
//         setError("Student not found");
//       })
//       .catch((err) => setError(err.message));
//   }, [regdNo]);

//   if (error) return <p className="text-red-600 text-center p-8">{error}</p>;
//   if (!student || !section)
//     return <p className="text-center p-8">Loading...</p>;

//   // Calculations
//   const total = section.totalClasses;
//   const attended = student.attended;
//   const currentPercentage = (attended / total) * 100;

//   // Calculate based on skip mode
//   const classesToSkip =
//     skipMode === "days" ? skipClasses * classesPerDay : skipClasses;
//   const futureTotal = total + skipClasses;
//   const futureAttended = attended + (skipClasses - classesToSkip);
//   const futurePercentage = (futureAttended / futureTotal) * 100;

//   // Calculate required attendance to reach target
//   const requiredAttended = Math.ceil((target / 100) * futureTotal);
//   const mustAttend = Math.max(0, requiredAttended - futureAttended);
//   const daysToReachTarget = Math.ceil(mustAttend / classesPerDay);

//   // Calculate if on track
//   const isOnTrack = futurePercentage >= target;
//   const isDropping = futurePercentage < currentPercentage;

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: { type: "spring", stiffness: 100 },
//     },
//   };

//   return (
//     <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100">
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6"
//     >
//       <AnimatePresence>
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="max-w-6xl mx-auto space-y-6"
//         >
//           {/* Header */}
//           <motion.div
//             variants={itemVariants}
//             className="bg-white rounded-2xl shadow-lg p-6"
//           >
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-900">
//                   {student.name}
//                 </h1>
//                 <p className="text-gray-600 mt-2">
//                   Registration:{" "}
//                   <span className="font-semibold">{student.regdNo}</span> |
//                   Section:{" "}
//                   <span className="font-semibold">{section.section}</span>
//                 </p>
//               </div>
//               <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl">
//                 <div className="flex items-center gap-2">
//                   <BarChart3 size={24} />
//                   <span className="text-2xl font-bold">
//                     {currentPercentage.toFixed(1)}%
//                   </span>
//                 </div>
//                 <p className="text-sm opacity-90">Current Attendance</p>
//               </div>
//             </div>
//           </motion.div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Left Column - Current Stats */}
//             <motion.div
//               variants={itemVariants}
//               className="lg:col-span-2 space-y-6"
//             >
//               {/* Progress Charts */}
//               <div className="bg-white rounded-2xl shadow-lg p-6">
//                 <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
//                   <PieChart className="text-blue-500" />
//                   Attendance Overview
//                 </h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Current Attendance Circle */}
//                   <div className="relative">
//                     <div className="w-48 h-48 mx-auto relative">
//                       <svg className="w-full h-full" viewBox="0 0 100 100">
//                         {/* Background circle */}
//                         <circle
//                           cx="50"
//                           cy="50"
//                           r="45"
//                           fill="none"
//                           stroke="#e2e8f0"
//                           strokeWidth="8"
//                         />
//                         {/* Progress circle */}
//                         <circle
//                           cx="50"
//                           cy="50"
//                           r="45"
//                           fill="none"
//                           stroke="url(#gradient)"
//                           strokeWidth="8"
//                           strokeLinecap="round"
//                           strokeDasharray={`${
//                             (currentPercentage / 100) * 282.6
//                           } 282.6`}
//                           transform="rotate(-90 50 50)"
//                         />
//                         <defs>
//                           <linearGradient
//                             id="gradient"
//                             x1="0%"
//                             y1="0%"
//                             x2="100%"
//                             y2="0%"
//                           >
//                             <stop offset="0%" stopColor="#3b82f6" />
//                             <stop offset="100%" stopColor="#8b5cf6" />
//                           </linearGradient>
//                         </defs>
//                       </svg>
//                       <div className="absolute inset-0 flex flex-col items-center justify-center">
//                         <span className="text-4xl font-bold text-gray-900">
//                           {currentPercentage.toFixed(1)}%
//                         </span>
//                         <span className="text-gray-600">Current</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Stats */}
//                   <div className="space-y-4">
//                     <div className="bg-blue-50 p-4 rounded-xl">
//                       <div className="flex justify-between items-center">
//                         <span className="text-gray-700">Attended</span>
//                         <span className="font-bold text-blue-600">
//                           {attended}
//                         </span>
//                       </div>
//                       <div className="w-full bg-blue-100 rounded-full h-2 mt-2">
//                         <div
//                           className="bg-blue-500 h-2 rounded-full transition-all duration-500"
//                           style={{ width: `${(attended / total) * 100}%` }}
//                         />
//                       </div>
//                     </div>

//                     <div className="bg-gray-50 p-4 rounded-xl">
//                       <div className="flex justify-between items-center">
//                         <span className="text-gray-700">Total Classes</span>
//                         <span className="font-bold text-gray-700">{total}</span>
//                       </div>
//                     </div>

//                     <div
//                       className={`p-4 rounded-xl ${
//                         isOnTrack ? "bg-green-50" : "bg-amber-50"
//                       }`}
//                     >
//                       <div className="flex items-center gap-2 mb-2">
//                         {isOnTrack ? (
//                           <CheckCircle className="text-green-500" size={20} />
//                         ) : (
//                           <AlertCircle className="text-amber-500" size={20} />
//                         )}
//                         <span className="font-semibold">
//                           {isOnTrack ? "On Track" : "Needs Improvement"}
//                         </span>
//                       </div>
//                       <p className="text-sm text-gray-600">
//                         {isOnTrack
//                           ? `You're maintaining above ${target}% target`
//                           : `You need ${mustAttend} more classes to reach ${target}%`}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Control Section */}
//               <div className="bg-white rounded-2xl shadow-lg p-6">
//                 <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
//                   <Target className="text-purple-500" />
//                   Attendance Planner
//                 </h2>

//                 {/* Target Slider */}
//                 <div className="mb-8">
//                   <div className="flex justify-between items-center mb-4">
//                     <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                       <Target size={20} />
//                       Target Attendance
//                     </label>
//                     <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//                       {target}%
//                     </span>
//                   </div>
//                   <input
//                     type="range"
//                     min="50"
//                     max="99"
//                     value={target}
//                     onChange={(e) => setTarget(parseInt(e.target.value))}
//                     className="w-full h-3 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-600 [&::-webkit-slider-thumb]:to-pink-600 [&::-webkit-slider-thumb]:shadow-lg"
//                   />
//                   <div className="flex justify-between text-sm text-gray-500 mt-2">
//                     <span>50%</span>
//                     <span>75%</span>
//                     <span>99%</span>
//                   </div>
//                 </div>

//                 {/* Classes Per Day Slider */}
//                 <div className="mb-8">
//                   <div className="flex justify-between items-center mb-4">
//                     <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                       <Calendar size={20} />
//                       Classes Per Day
//                     </label>
//                     <span className="text-2xl font-bold text-blue-600">
//                       {classesPerDay}
//                     </span>
//                   </div>
//                   <div className="relative">
//                     <input
//                       type="range"
//                       min="2"
//                       max="9"
//                       value={classesPerDay}
//                       onChange={(e) =>
//                         setClassesPerDay(parseInt(e.target.value))
//                       }
//                       className="w-full h-3 bg-gradient-to-r from-blue-100 to-blue-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:shadow-lg"
//                     />
//                     <div className="flex justify-between text-sm text-gray-500 mt-2 px-1">
//                       {[2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
//                         <span key={num}>{num}</span>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Skip Classes/Days Section */}
//                 <div className="mb-8">
//                   <div className="flex justify-between items-center mb-4">
//                     <div>
//                       <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                         {isDropping ? (
//                           <TrendingDown size={20} />
//                         ) : (
//                           <TrendingUp size={20} />
//                         )}
//                         Skip {skipMode === "days" ? "Days" : "Classes"}
//                       </label>
//                       <div className="flex gap-4 mt-2">
//                         <button
//                           onClick={() => setSkipMode("classes")}
//                           className={`px-4 py-2 rounded-lg transition-all ${
//                             skipMode === "classes"
//                               ? "bg-blue-600 text-white"
//                               : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                           }`}
//                         >
//                           By Classes
//                         </button>
//                         <button
//                           onClick={() => setSkipMode("days")}
//                           className={`px-4 py-2 rounded-lg transition-all ${
//                             skipMode === "days"
//                               ? "bg-blue-600 text-white"
//                               : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                           }`}
//                         >
//                           By Days
//                         </button>
//                       </div>
//                     </div>
//                     <span className="text-2xl font-bold text-red-600">
//                       {skipClasses} {skipMode === "days" ? "days" : "classes"}
//                     </span>
//                   </div>
//                   <input
//                     type="range"
//                     min="0"
//                     max={skipMode === "days" ? "30" : "50"}
//                     step={skipMode === "days" ? "0.1" : "1"}
//                     value={skipClasses}
//                     onChange={(e) => setSkipClasses(parseFloat(e.target.value))}
//                     className="w-full h-3 bg-gradient-to-r from-red-100 to-red-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-600 [&::-webkit-slider-thumb]:shadow-lg"
//                   />
//                   <div className="flex justify-between text-sm text-gray-500 mt-2">
//                     <span>0</span>
//                     <span>
//                       {skipMode === "days" ? "15 days" : "25 classes"}
//                     </span>
//                     <span>
//                       {skipMode === "days" ? "30 days" : "50 classes"}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Right Column - Results */}
//             <motion.div variants={itemVariants} className="space-y-6">
//               {/* Results Card */}
//               <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl shadow-lg p-6">
//                 <h2 className="text-xl font-bold mb-6">
//                   Attendance Projection
//                 </h2>

//                 {/* Future Attendance */}
//                 <div className="mb-6">
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="opacity-90">
//                       After skipping {skipClasses}{" "}
//                       {skipMode === "days" ? "days" : "classes"}:
//                     </span>
//                     <span className="text-3xl font-bold">
//                       {futurePercentage.toFixed(1)}%
//                     </span>
//                   </div>
//                   <div className="w-full bg-white/20 rounded-full h-3">
//                     <div
//                       className="bg-white h-3 rounded-full transition-all duration-500"
//                       style={{ width: `${Math.min(futurePercentage, 100)}%` }}
//                     />
//                   </div>
//                 </div>

//                 {/* Required Attendance */}
//                 <div className="bg-white/10 p-4 rounded-xl mb-4">
//                   <div className="flex items-center gap-3 mb-2">
//                     <Target size={24} />
//                     <span className="font-semibold">To reach {target}%:</span>
//                   </div>
//                   <p className="text-2xl font-bold mb-2">
//                     {mustAttend} more classes
//                   </p>
//                   <p className="opacity-90">
//                     Approx. {daysToReachTarget} days ({classesPerDay}{" "}
//                     classes/day)
//                   </p>
//                 </div>

//                 {/* Status Message */}
//                 <div
//                   className={`p-4 rounded-xl ${
//                     isOnTrack ? "bg-green-500/20" : "bg-amber-500/20"
//                   }`}
//                 >
//                   <div className="flex items-center gap-2">
//                     {isOnTrack ? (
//                       <>
//                         <CheckCircle size={20} />
//                         <span className="font-semibold">
//                           Great! You're on track
//                         </span>
//                       </>
//                     ) : (
//                       <>
//                         <AlertCircle size={20} />
//                         <span className="font-semibold">Need to focus</span>
//                       </>
//                     )}
//                   </div>
//                   <p className="text-sm mt-2 opacity-90">
//                     {isOnTrack
//                       ? "Maintain your current attendance rate"
//                       : `Attend at least ${Math.ceil(
//                           mustAttend / daysToReachTarget
//                         )} classes per day`}
//                   </p>
//                 </div>
//               </div>

//               {/* Statistics */}
//               <div className="bg-white rounded-2xl shadow-lg p-6">
//                 <h3 className="font-bold text-gray-900 mb-4">Quick Stats</h3>
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
//                     <span className="text-gray-700">
//                       Remaining Classes Needed
//                     </span>
//                     <span className="font-bold text-blue-600">
//                       {mustAttend}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
//                     <span className="text-gray-700">Days Required</span>
//                     <span className="font-bold text-purple-600">
//                       {daysToReachTarget}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
//                     <span className="text-gray-700">Current Streak</span>
//                     <span className="font-bold text-green-600">Good</span>
//                   </div>
//                   <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
//                     <span className="text-gray-700">Safety Buffer</span>
//                     <span className="font-bold text-amber-600">
//                       {Math.max(0, attended - Math.ceil((75 / 100) * total))}{" "}
//                       classes
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Trend Chart */}
//               {/* <div className="bg-white rounded-2xl shadow-lg p-6"> */}
//                 {/* <h3 className="font-bold text-gray-900 mb-4">
//                   Attendance Trend
//                 </h3> */}
//                 {/* <div className="h-40 relative"> */}
                  
//                   {/* <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-around">
//                     {[60, 65, 70, 68, 72, currentPercentage].map(
//                       (value, index) => (
//                         <motion.div
//                           key={index}
//                           initial={{ height: 0 }}
//                           animate={{ height: `${value}%` }}
//                           transition={{ delay: index * 0.1 }}
//                           className={`w-8 rounded-t-lg ${
//                             index === 5
//                               ? "bg-gradient-to-t from-blue-500 to-purple-500"
//                               : "bg-gradient-to-t from-blue-200 to-purple-200"
//                           }`}
//                         />
//                       )
//                     )}
//                   </div> */}
//                   {/* <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200" />
//                 </div> */}
//                 {/* <div className="flex justify-between text-sm text-gray-500 mt-4">
//                   <span>Previous</span>
//                   <span>Current</span>
//                 </div> */}
//               {/* </div> */}
//             </motion.div>
//           </div>

//           {/* Bottom Bar */}
//           <motion.div
//             variants={itemVariants}
//             className={`text-center p-4 rounded-xl ${
//               isOnTrack
//                 ? "bg-green-100 text-green-800"
//                 : "bg-amber-100 text-amber-800"
//             }`}
//           >
//             <p className="font-semibold">
//               {isOnTrack
//                 ? "🎯 You're on track to achieve your target!"
//                 : `⚠️ You need to attend ${mustAttend} more classes (approx. ${daysToReachTarget} days) to reach ${target}%`}
//             </p>
//           </motion.div>
//         </motion.div>
//       </AnimatePresence>
//       {/* ================= SUBJECT WISE TABLE (WITH SHORTAGE CALC) ================= */}
// {subjectAttendance && (
//   <motion.div
//     variants={itemVariants}
//     initial="hidden"
//     animate="visible"
//     className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 mt-10"
//   >
//     <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
//       📚 Subject-wise Attendance
//     </h2>

//     <div className="space-y-4">
//       {Object.entries(subjectAttendance)
//         .filter(([subject]) => subject.trim() !== "")
//         .map(([subject, data], index) => {
//           const percent = Number(data.percentage || 0);
//           const isSafe = percent >= 75;

//           const classesNeeded = isSafe
//             ? 0
//             : Math.ceil((0.75 * data.total - data.attended) / 0.25);

//           return (
//             <motion.div
//               key={subject}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.06 }}
//               whileHover={{ scale: 1.015 }}
//               className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:shadow-xl hover:ring-2 hover:ring-blue-200 transition-all"
//             >
//               {/* Header */}
//               <div className="flex justify-between items-center mb-3">
//                 <h3 className="text-lg font-semibold text-slate-800">
//                   {subject}
//                 </h3>

//                 <span
//                   className={`px-3 py-1 rounded-full text-sm font-semibold ${
//                     isSafe
//                       ? "bg-emerald-100 text-emerald-700"
//                       : "bg-rose-100 text-rose-700"
//                   }`}
//                 >
//                   {isSafe ? "Safe" : "Shortage"}
//                 </span>
//               </div>

//               {/* Numbers */}
//               <div className="grid grid-cols-4 text-center mb-3">
//                 <div>
//                   <p className="text-sm text-slate-500">Attended</p>
//                   <p className="text-lg font-bold text-blue-600">
//                     {data.attended}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-sm text-slate-500">Total</p>
//                   <p className="text-lg font-bold text-slate-700">
//                     {data.total}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-sm text-slate-500">%</p>
//                   <p className="text-lg font-bold text-slate-900">
//                     {percent.toFixed(1)}%
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-sm text-slate-500">Need</p>
//                   <p
//                     className={`text-lg font-bold ${
//                       isSafe ? "text-emerald-600" : "text-rose-600"
//                     }`}
//                   >
//                     {isSafe ? "0" : classesNeeded}
//                   </p>
//                 </div>
//               </div>

//               {/* Progress Bar */}
//               <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
//                 <motion.div
//                   initial={{ width: 0 }}
//                   animate={{ width: `${Math.min(percent, 100)}%` }}
//                   transition={{ duration: 0.8, ease: "easeOut" }}
//                   className={`h-3 rounded-full ${
//                     isSafe
//                       ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
//                       : "bg-gradient-to-r from-rose-400 to-rose-600"
//                   }`}
//                 />
//               </div>

//               {/* Helper Text */}
//               {!isSafe && (
//                 <motion.p
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.3 }}
//                   className="text-sm text-rose-600 mt-2 font-medium"
//                 >
//                   ⚠️ Attend next <b>{classesNeeded}</b> classes continuously to
//                   reach 75%
//                 </motion.p>
//               )}
//             </motion.div>
//           );
//         })}
//     </div>
//   </motion.div>
// )}
// {/* ========================================================================== */}

//     </motion.div>
//     </div>
//   );
// };

// export default StudentAttendance;



// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   TrendingUp,
//   TrendingDown,
//   Target,
//   Calendar,
//   AlertCircle,
//   CheckCircle,
//   BarChart3,
//   PieChart,
// } from "lucide-react";

// const StudentAttendance = () => {
//   const { regdNo } = useParams();
//   const [student, setStudent] = useState(null);
//   const [error, setError] = useState("");

//   // Controls
//   const [target, setTarget] = useState(75);
//   const [classesPerDay, setClassesPerDay] = useState(6);
//   const [skipClasses, setSkipClasses] = useState(0);
//   const [skipMode, setSkipMode] = useState("classes"); // "classes" or "days"
//   const [subjectAttendance, setSubjectAttendance] = useState([]);

//   // Load data from Google Sheets
//   useEffect(() => {
//     const loadAttendanceFromSheets = async () => {
//       try {
//         // Using Google Sheets API
//         const sheetId = "1MhfM5NLIS_798p022sSpjC1DO8ghAqENwJGddOnxW3s";
//       const range = "Course_Report!A1:Z1000";
//         const apiKey = "AIzaSyDE8mlYyakXJRUCxwmIDtotS1ywxncRQng"; // You'll need to get your own API key
        
//         const res = await fetch(
//         `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`
//       );
//         if (!res.ok) throw new Error("Google Sheets fetch failed");

//       const data = await res.json();
//       console.log(data.values);
//         const rows = data.values;
        
//         if (!rows || rows.length === 0) {
//           throw new Error("No data found in the sheet");
//         }

//         // Parse the data
//         // First row is header: ["Student ID", "Student Name", "Total Sessions", "Attended Sessions", "Course %"]
//         const headers = rows[0];
//         const students = rows.slice(1).map(row => {
//           const studentData = {};
//           headers.forEach((header, index) => {
//             const value = row[index] || "";
//             switch(header.trim().toLowerCase()) {
//               case "student id":
//                 studentData.regdNo = value.toString();
//                 break;
//               case "student name":
//                 studentData.name = value;
//                 break;
//               case "total sessions":
//                 studentData.total = parseFloat(value) || 0;
//                 break;
//               case "attended sessions":
//                 studentData.attended = parseFloat(value) || 0;
//                 break;
//               case "course %":
//                 studentData.percentage = parseFloat(value) || 0;
//                 break;
//               default:
//                 // Handle additional columns as subjects
//                 if (header.trim() && !["Student ID", "Student Name", "Total Sessions", "Attended Sessions", "Course %"].includes(header)) {
//                   if (!studentData.subjects) studentData.subjects = {};
//                   studentData.subjects[header] = {
//                     percentage: parseFloat(value) || 0,
//                     // For this simplified version, we'll use the total and attended from main columns
//                     total: studentData.total || 0,
//                     attended: studentData.attended || 0
//                   };
//                 }
//             }
//           });
//           return studentData;
//         });

//         // Find the specific student
//         const foundStudent = students.find(
//           (s) => String(s.regdNo).trim() === String(regdNo).trim()
//         );

//         if (foundStudent) {
//           setStudent(foundStudent);
          
//           // If there are subject-wise data, set it
//           if (foundStudent.subjects) {
//             setSubjectAttendance(foundStudent.subjects);
//           }
//         } else {
//           setError("Student not found");
//         }
//       } catch (err) {
//         console.error("Error loading attendance:", err);
//         setError(err.message);
        
//         // Fallback: Use mock data for demonstration
//         const mockStudent = {
//           regdNo: regdNo,
//           name: "Demo Student",
//           total: 30,
//           attended: 22,
//           percentage: 73.33,
//           section: "A",
//           subjects: {
//             "Mathematics": { percentage: 80, total: 25, attended: 20 },
//             "Physics": { percentage: 70, total: 30, attended: 21 },
//             "Chemistry": { percentage: 75, total: 28, attended: 21 },
//             "English": { percentage: 85, total: 20, attended: 17 },
//             "Computer Science": { percentage: 90, total: 30, attended: 27 }
//           }
//         };
        
//         if (String(regdNo).trim() === "201") {
//           mockStudent.name = "Anil";
//           mockStudent.total = 7;
//           mockStudent.attended = 2;
//           mockStudent.percentage = 28.57;
//         } else if (String(regdNo).trim() === "202") {
//           mockStudent.name = "Sai";
//           mockStudent.total = 7;
//           mockStudent.attended = 5;
//           mockStudent.percentage = 71.43;
//         } else if (String(regdNo).trim() === "203") {
//           mockStudent.name = "Kiran";
//           mockStudent.total = 7;
//           mockStudent.attended = 3;
//           mockStudent.percentage = 42.86;
//         }
        
//         setStudent(mockStudent);
//         if (mockStudent.subjects) {
//           setSubjectAttendance(mockStudent.subjects);
//         }
//       }
//     };

//     loadAttendanceFromSheets();
//   }, [regdNo]);

//   if (error) return <p className="text-red-600 text-center p-8">{error}</p>;
//   if (!student)
//     return <p className="text-center p-8">Loading...</p>;

//   // Calculations
//   const total = student.total || 0;
//   const attended = student.attended || 0;
//   const currentPercentage = student.percentage || (attended / total) * 100;

//   // Calculate based on skip mode
//   const classesToSkip =
//     skipMode === "days" ? skipClasses * classesPerDay : skipClasses;
//   const futureTotal = total + skipClasses;
//   const futureAttended = attended + (skipClasses - classesToSkip);
//   const futurePercentage = (futureAttended / futureTotal) * 100;

//   // Calculate required attendance to reach target
//   const requiredAttended = Math.ceil((target / 100) * futureTotal);
//   const mustAttend = Math.max(0, requiredAttended - futureAttended);
//   const daysToReachTarget = Math.ceil(mustAttend / classesPerDay);

//   // Calculate if on track
//   const isOnTrack = futurePercentage >= target;
//   const isDropping = futurePercentage < currentPercentage;

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: { type: "spring", stiffness: 100 },
//     },
//   };

//   return (
//     <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100">
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6"
//       >
//         <AnimatePresence>
//           <motion.div
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="max-w-6xl mx-auto space-y-6"
//           >
//             {/* Header */}
//             <motion.div
//               variants={itemVariants}
//               className="bg-white rounded-2xl shadow-lg p-6"
//             >
//               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                 <div>
//                   <h1 className="text-3xl font-bold text-gray-900">
//                     {student.name}
//                   </h1>
//                   <p className="text-gray-600 mt-2">
//                     Registration:{" "}
//                     <span className="font-semibold">{student.regdNo}</span>
//                     {student.section && (
//                       <>
//                         {" "}
//                         | Section:{" "}
//                         <span className="font-semibold">{student.section}</span>
//                       </>
//                     )}
//                   </p>
//                 </div>
//                 <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl">
//                   <div className="flex items-center gap-2">
//                     <BarChart3 size={24} />
//                     <span className="text-2xl font-bold">
//                       {currentPercentage.toFixed(1)}%
//                     </span>
//                   </div>
//                   <p className="text-sm opacity-90">Current Attendance</p>
//                 </div>
//               </div>
//             </motion.div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               {/* Left Column - Current Stats */}
//               <motion.div
//                 variants={itemVariants}
//                 className="lg:col-span-2 space-y-6"
//               >
//                 {/* Progress Charts */}
//                 <div className="bg-white rounded-2xl shadow-lg p-6">
//                   <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
//                     <PieChart className="text-blue-500" />
//                     Attendance Overview
//                   </h2>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* Current Attendance Circle */}
//                     <div className="relative">
//                       <div className="w-48 h-48 mx-auto relative">
//                         <svg className="w-full h-full" viewBox="0 0 100 100">
//                           {/* Background circle */}
//                           <circle
//                             cx="50"
//                             cy="50"
//                             r="45"
//                             fill="none"
//                             stroke="#e2e8f0"
//                             strokeWidth="8"
//                           />
//                           {/* Progress circle */}
//                           <circle
//                             cx="50"
//                             cy="50"
//                             r="45"
//                             fill="none"
//                             stroke="url(#gradient)"
//                             strokeWidth="8"
//                             strokeLinecap="round"
//                             strokeDasharray={`${
//                               (currentPercentage / 100) * 282.6
//                             } 282.6`}
//                             transform="rotate(-90 50 50)"
//                           />
//                           <defs>
//                             <linearGradient
//                               id="gradient"
//                               x1="0%"
//                               y1="0%"
//                               x2="100%"
//                               y2="0%"
//                             >
//                               <stop offset="0%" stopColor="#3b82f6" />
//                               <stop offset="100%" stopColor="#8b5cf6" />
//                             </linearGradient>
//                           </defs>
//                         </svg>
//                         <div className="absolute inset-0 flex flex-col items-center justify-center">
//                           <span className="text-4xl font-bold text-gray-900">
//                             {currentPercentage.toFixed(1)}%
//                           </span>
//                           <span className="text-gray-600">Current</span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Stats */}
//                     <div className="space-y-4">
//                       <div className="bg-blue-50 p-4 rounded-xl">
//                         <div className="flex justify-between items-center">
//                           <span className="text-gray-700">Attended</span>
//                           <span className="font-bold text-blue-600">
//                             {attended}
//                           </span>
//                         </div>
//                         <div className="w-full bg-blue-100 rounded-full h-2 mt-2">
//                           <div
//                             className="bg-blue-500 h-2 rounded-full transition-all duration-500"
//                             style={{ width: `${(attended / total) * 100}%` }}
//                           />
//                         </div>
//                       </div>

//                       <div className="bg-gray-50 p-4 rounded-xl">
//                         <div className="flex justify-between items-center">
//                           <span className="text-gray-700">Total Classes</span>
//                           <span className="font-bold text-gray-700">{total}</span>
//                         </div>
//                       </div>

//                       <div
//                         className={`p-4 rounded-xl ${
//                           isOnTrack ? "bg-green-50" : "bg-amber-50"
//                         }`}
//                       >
//                         <div className="flex items-center gap-2 mb-2">
//                           {isOnTrack ? (
//                             <CheckCircle className="text-green-500" size={20} />
//                           ) : (
//                             <AlertCircle className="text-amber-500" size={20} />
//                           )}
//                           <span className="font-semibold">
//                             {isOnTrack ? "On Track" : "Needs Improvement"}
//                           </span>
//                         </div>
//                         <p className="text-sm text-gray-600">
//                           {isOnTrack
//                             ? `You're maintaining above ${target}% target`
//                             : `You need ${mustAttend} more classes to reach ${target}%`}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Control Section */}
//                 <div className="bg-white rounded-2xl shadow-lg p-6">
//                   <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
//                     <Target className="text-purple-500" />
//                     Attendance Planner
//                   </h2>

//                   {/* Target Slider */}
//                   <div className="mb-8">
//                     <div className="flex justify-between items-center mb-4">
//                       <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                         <Target size={20} />
//                         Target Attendance
//                       </label>
//                       <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//                         {target}%
//                       </span>
//                     </div>
//                     <input
//                       type="range"
//                       min="50"
//                       max="99"
//                       value={target}
//                       onChange={(e) => setTarget(parseInt(e.target.value))}
//                       className="w-full h-3 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-600 [&::-webkit-slider-thumb]:to-pink-600 [&::-webkit-slider-thumb]:shadow-lg"
//                     />
//                     <div className="flex justify-between text-sm text-gray-500 mt-2">
//                       <span>50%</span>
//                       <span>75%</span>
//                       <span>99%</span>
//                     </div>
//                   </div>

//                   {/* Classes Per Day Slider */}
//                   <div className="mb-8">
//                     <div className="flex justify-between items-center mb-4">
//                       <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                         <Calendar size={20} />
//                         Classes Per Day
//                       </label>
//                       <span className="text-2xl font-bold text-blue-600">
//                         {classesPerDay}
//                       </span>
//                     </div>
//                     <div className="relative">
//                       <input
//                         type="range"
//                         min="2"
//                         max="9"
//                         value={classesPerDay}
//                         onChange={(e) =>
//                           setClassesPerDay(parseInt(e.target.value))
//                         }
//                         className="w-full h-3 bg-gradient-to-r from-blue-100 to-blue-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:shadow-lg"
//                       />
//                       <div className="flex justify-between text-sm text-gray-500 mt-2 px-1">
//                         {[2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
//                           <span key={num}>{num}</span>
//                         ))}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Skip Classes/Days Section */}
//                   <div className="mb-8">
//                     <div className="flex justify-between items-center mb-4">
//                       <div>
//                         <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                           {isDropping ? (
//                             <TrendingDown size={20} />
//                           ) : (
//                             <TrendingUp size={20} />
//                           )}
//                           Skip {skipMode === "days" ? "Days" : "Classes"}
//                         </label>
//                         <div className="flex gap-4 mt-2">
//                           <button
//                             onClick={() => setSkipMode("classes")}
//                             className={`px-4 py-2 rounded-lg transition-all ${
//                               skipMode === "classes"
//                                 ? "bg-blue-600 text-white"
//                                 : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                             }`}
//                           >
//                             By Classes
//                           </button>
//                           <button
//                             onClick={() => setSkipMode("days")}
//                             className={`px-4 py-2 rounded-lg transition-all ${
//                               skipMode === "days"
//                                 ? "bg-blue-600 text-white"
//                                 : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                             }`}
//                           >
//                             By Days
//                           </button>
//                         </div>
//                       </div>
//                       <span className="text-2xl font-bold text-red-600">
//                         {skipClasses} {skipMode === "days" ? "days" : "classes"}
//                       </span>
//                     </div>
//                     <input
//                       type="range"
//                       min="0"
//                       max={skipMode === "days" ? "30" : "50"}
//                       step={skipMode === "days" ? "0.1" : "1"}
//                       value={skipClasses}
//                       onChange={(e) => setSkipClasses(parseFloat(e.target.value))}
//                       className="w-full h-3 bg-gradient-to-r from-red-100 to-red-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-600 [&::-webkit-slider-thumb]:shadow-lg"
//                     />
//                     <div className="flex justify-between text-sm text-gray-500 mt-2">
//                       <span>0</span>
//                       <span>
//                         {skipMode === "days" ? "15 days" : "25 classes"}
//                       </span>
//                       <span>
//                         {skipMode === "days" ? "30 days" : "50 classes"}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>

//               {/* Right Column - Results */}
//               <motion.div variants={itemVariants} className="space-y-6">
//                 {/* Results Card */}
//                 <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl shadow-lg p-6">
//                   <h2 className="text-xl font-bold mb-6">
//                     Attendance Projection
//                   </h2>

//                   {/* Future Attendance */}
//                   <div className="mb-6">
//                     <div className="flex justify-between items-center mb-2">
//                       <span className="opacity-90">
//                         After skipping {skipClasses}{" "}
//                         {skipMode === "days" ? "days" : "classes"}:
//                       </span>
//                       <span className="text-3xl font-bold">
//                         {futurePercentage.toFixed(1)}%
//                       </span>
//                     </div>
//                     <div className="w-full bg-white/20 rounded-full h-3">
//                       <div
//                         className="bg-white h-3 rounded-full transition-all duration-500"
//                         style={{ width: `${Math.min(futurePercentage, 100)}%` }}
//                       />
//                     </div>
//                   </div>

//                   {/* Required Attendance */}
//                   <div className="bg-white/10 p-4 rounded-xl mb-4">
//                     <div className="flex items-center gap-3 mb-2">
//                       <Target size={24} />
//                       <span className="font-semibold">To reach {target}%:</span>
//                     </div>
//                     <p className="text-2xl font-bold mb-2">
//                       {mustAttend} more classes
//                     </p>
//                     <p className="opacity-90">
//                       Approx. {daysToReachTarget} days ({classesPerDay}{" "}
//                       classes/day)
//                     </p>
//                   </div>

//                   {/* Status Message */}
//                   <div
//                     className={`p-4 rounded-xl ${
//                       isOnTrack ? "bg-green-500/20" : "bg-amber-500/20"
//                     }`}
//                   >
//                     <div className="flex items-center gap-2">
//                       {isOnTrack ? (
//                         <>
//                           <CheckCircle size={20} />
//                           <span className="font-semibold">
//                             Great! You're on track
//                           </span>
//                         </>
//                       ) : (
//                         <>
//                           <AlertCircle size={20} />
//                           <span className="font-semibold">Need to focus</span>
//                         </>
//                       )}
//                     </div>
//                     <p className="text-sm mt-2 opacity-90">
//                       {isOnTrack
//                         ? "Maintain your current attendance rate"
//                         : `Attend at least ${Math.ceil(
//                             mustAttend / daysToReachTarget
//                           )} classes per day`}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Statistics */}
//                 <div className="bg-white rounded-2xl shadow-lg p-6">
//                   <h3 className="font-bold text-gray-900 mb-4">Quick Stats</h3>
//                   <div className="space-y-4">
//                     <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
//                       <span className="text-gray-700">
//                         Remaining Classes Needed
//                       </span>
//                       <span className="font-bold text-blue-600">
//                         {mustAttend}
//                       </span>
//                     </div>
//                     <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
//                       <span className="text-gray-700">Days Required</span>
//                       <span className="font-bold text-purple-600">
//                         {daysToReachTarget}
//                       </span>
//                     </div>
//                     <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
//                       <span className="text-gray-700">Current Streak</span>
//                       <span className="font-bold text-green-600">Good</span>
//                     </div>
//                     <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
//                       <span className="text-gray-700">Safety Buffer</span>
//                       <span className="font-bold text-amber-600">
//                         {Math.max(0, attended - Math.ceil((75 / 100) * total))}{" "}
//                         classes
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             </div>

//             {/* Bottom Bar */}
//             <motion.div
//               variants={itemVariants}
//               className={`text-center p-4 rounded-xl ${
//                 isOnTrack
//                   ? "bg-green-100 text-green-800"
//                   : "bg-amber-100 text-amber-800"
//               }`}
//             >
//               <p className="font-semibold">
//                 {isOnTrack
//                   ? "🎯 You're on track to achieve your target!"
//                   : `⚠️ You need to attend ${mustAttend} more classes (approx. ${daysToReachTarget} days) to reach ${target}%`}
//               </p>
//             </motion.div>
//           </motion.div>
//         </AnimatePresence>
        
//         {/* ================= SUBJECT WISE TABLE (WITH SHORTAGE CALC) ================= */}
//         {subjectAttendance && Object.keys(subjectAttendance).length > 0 && (
//           <motion.div
//             variants={itemVariants}
//             initial="hidden"
//             animate="visible"
//             className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 mt-10"
//           >
//             <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
//               📚 Subject-wise Attendance
//             </h2>

//             <div className="space-y-4">
//               {Object.entries(subjectAttendance)
//                 .filter(([subject]) => subject.trim() !== "")
//                 .map(([subject, data], index) => {
//                   const percent = Number(data.percentage || 0);
//                   const isSafe = percent >= 75;
//                   const total = data.total || 0;
//                   const attended = data.attended || 0;

//                   const classesNeeded = isSafe
//                     ? 0
//                     : Math.ceil((0.75 * total - attended) / 0.25);

//                   return (
//                     <motion.div
//                       key={subject}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.06 }}
//                       whileHover={{ scale: 1.015 }}
//                       className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:shadow-xl hover:ring-2 hover:ring-blue-200 transition-all"
//                     >
//                       {/* Header */}
//                       <div className="flex justify-between items-center mb-3">
//                         <h3 className="text-lg font-semibold text-slate-800">
//                           {subject}
//                         </h3>

//                         <span
//                           className={`px-3 py-1 rounded-full text-sm font-semibold ${
//                             isSafe
//                               ? "bg-emerald-100 text-emerald-700"
//                               : "bg-rose-100 text-rose-700"
//                           }`}
//                         >
//                           {isSafe ? "Safe" : "Shortage"}
//                         </span>
//                       </div>

//                       {/* Numbers */}
//                       <div className="grid grid-cols-4 text-center mb-3">
//                         <div>
//                           <p className="text-sm text-slate-500">Attended</p>
//                           <p className="text-lg font-bold text-blue-600">
//                             {attended}
//                           </p>
//                         </div>

//                         <div>
//                           <p className="text-sm text-slate-500">Total</p>
//                           <p className="text-lg font-bold text-slate-700">
//                             {total}
//                           </p>
//                         </div>

//                         <div>
//                           <p className="text-sm text-slate-500">%</p>
//                           <p className="text-lg font-bold text-slate-900">
//                             {percent.toFixed(1)}%
//                           </p>
//                         </div>

//                         <div>
//                           <p className="text-sm text-slate-500">Need</p>
//                           <p
//                             className={`text-lg font-bold ${
//                               isSafe ? "text-emerald-600" : "text-rose-600"
//                             }`}
//                           >
//                             {isSafe ? "0" : classesNeeded}
//                           </p>
//                         </div>
//                       </div>

//                       {/* Progress Bar */}
//                       <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
//                         <motion.div
//                           initial={{ width: 0 }}
//                           animate={{ width: `${Math.min(percent, 100)}%` }}
//                           transition={{ duration: 0.8, ease: "easeOut" }}
//                           className={`h-3 rounded-full ${
//                             isSafe
//                               ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
//                               : "bg-gradient-to-r from-rose-400 to-rose-600"
//                           }`}
//                         />
//                       </div>

//                       {/* Helper Text */}
//                       {!isSafe && (
//                         <motion.p
//                           initial={{ opacity: 0 }}
//                           animate={{ opacity: 1 }}
//                           transition={{ delay: 0.3 }}
//                           className="text-sm text-rose-600 mt-2 font-medium"
//                         >
//                           ⚠️ Attend next <b>{classesNeeded}</b> classes continuously to
//                           reach 75%
//                         </motion.p>
//                       )}
//                     </motion.div>
//                   );
//                 })}
//             </div>
//           </motion.div>
//         )}
//         {/* ========================================================================== */}
//       </motion.div>
//     </div>
//   );
// };

// export default StudentAttendance;


import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart,
  SkipForward,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Zap,
} from "lucide-react";

const StudentAttendance = () => {
  const { regdNo } = useParams();
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");

  // Controls with defaults
  const [target, setTarget] = useState(75);
  const [classesPerDay, setClassesPerDay] = useState(7); // Default 7 classes
  const [skipClasses, setSkipClasses] = useState(0);
  const [skipMode, setSkipMode] = useState("days"); // Default "days"
  const [subjectAttendance, setSubjectAttendance] = useState([]);

  // Load data from Google Sheets
  useEffect(() => {
    const loadAttendanceFromSheets = async () => {
      try {
        // Using Google Sheets API
        const sheetId = "1MhfM5NLIS_798p022sSpjC1DO8ghAqENwJGddOnxW3s";
        const range = "Course_Report!A1:Z1000";
        const apiKey = "AIzaSyDE8mlYyakXJRUCxwmIDtotS1ywxncRQng";
        
        const res = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`
        );
        if (!res.ok) throw new Error("Google Sheets fetch failed");

        const data = await res.json();
        
        
        const rows = data.values;
        
        if (!rows || rows.length === 0) {
          throw new Error("No data found in the sheet");
        }

        // Parse the data
        const headers = rows[0];
        const students = rows.slice(1).map(row => {
          const studentData = {};
          headers.forEach((header, index) => {
            const value = row[index] || "";
            switch(header.trim().toLowerCase()) {
              case "student id":
                studentData.regdNo = value.toString();
                break;
              case "student name":
                studentData.name = value;
                break;
              case "total sessions":
                studentData.total = parseFloat(value) || 0;
                break;
              case "attended sessions":
                studentData.attended = parseFloat(value) || 0;
                break;
              case "course %":
                studentData.percentage = parseFloat(value) || 0;
                break;
              default:
                if (header.trim() && !["Student ID", "Student Name", "Total Sessions", "Attended Sessions", "Course %"].includes(header)) {
                  if (!studentData.subjects) studentData.subjects = {};
                  studentData.subjects[header] = {
                    percentage: parseFloat(value) || 0,
                    total: studentData.total || 0,
                    attended: studentData.attended || 0
                  };
                }

            }
          });
          return studentData;
        });

        // Find the specific student
        const foundStudent = students.find(
          (s) => String(s.regdNo).trim() === String(regdNo).trim()
        );

        if (foundStudent) {
          setStudent(foundStudent);
          
          if (foundStudent.subjects) {
            setSubjectAttendance(foundStudent.subjects);
          }
        } else {
          setError("Student not found");
        }
      } catch (err) {
        console.error("Error loading attendance:", err);
        setError(err.message);
        
        // Fallback: Use mock data for demonstration
        const mockStudent = {
          regdNo: regdNo,
          name: "Demo Student",
          total: 30,
          attended: 22,
          percentage: 73.33,
          section: "A",
          subjects: {
            "Mathematics": { percentage: 80, total: 25, attended: 20 },
            "Physics": { percentage: 70, total: 30, attended: 21 },
            "Chemistry": { percentage: 75, total: 28, attended: 21 },
            "English": { percentage: 85, total: 20, attended: 17 },
            "Computer Science": { percentage: 90, total: 30, attended: 27 }
          }
        };
        
        if (String(regdNo).trim() === "201") {
          mockStudent.name = "Anil";
          mockStudent.total = 7;
          mockStudent.attended = 2;
          mockStudent.percentage = 28.57;
        } else if (String(regdNo).trim() === "202") {
          mockStudent.name = "Sai";
          mockStudent.total = 7;
          mockStudent.attended = 5;
          mockStudent.percentage = 71.43;
        } else if (String(regdNo).trim() === "203") {
          mockStudent.name = "Kiran";
          mockStudent.total = 7;
          mockStudent.attended = 3;
          mockStudent.percentage = 42.86;
        }
        
        setStudent(mockStudent);
        if (mockStudent.subjects) {
          setSubjectAttendance(mockStudent.subjects);
        }
      }
    };

    loadAttendanceFromSheets();
  }, [regdNo]);

  if (error) return <p className="text-red-600 text-center p-8">{error}</p>;
  if (!student)
    return <p className="text-center p-8">Loading...</p>;

  // Current calculations
  const total = student.total || 0;
  const attended = student.attended || 0;
  const currentPercentage = student.percentage || (attended / total) * 100;

  // Calculate maximum skip allowance to maintain 75%
  const calculateMaxSkipAllowance = () => {
    if (currentPercentage >= 75) {
      // Calculate how many classes can be skipped while maintaining ≥75%
      // Formula: (attended) / (total + x) >= 0.75
      const safeSkipClasses = Math.floor((attended - 0.75 * total) / 0.75);
      const safeSkipDays = Math.floor(safeSkipClasses / classesPerDay);
      
      return {
        classes: Math.max(0, safeSkipClasses),
        days: Math.max(0, safeSkipDays),
        safe: true
      };
    } else {
      // Calculate how many days needed to reach 75% with 100% attendance
      // Need additional classes: (0.75 * total) - attended
      const requiredClasses = Math.ceil(0.75 * total - attended);
      const daysNeeded100 = Math.max(1, Math.ceil(requiredClasses / classesPerDay));
      
      // Calculate with 75% attendance rate going forward
      const effectiveClassesPerDay = classesPerDay * 0.75;
      const daysNeeded75 = Math.max(1, Math.ceil(requiredClasses / effectiveClassesPerDay));
      
      return {
        classes: requiredClasses,
        days100: daysNeeded100,
        days75: daysNeeded75,
        safe: false
      };
    }
  };

  // Calculate to reach target percentage
  const calculateToReachTarget = () => {
    // Calculate how many classes needed to reach target%
    const requiredClasses = Math.max(0, Math.ceil((target / 100) * total - attended));
    
    // Days needed with 100% attendance
    const daysNeeded100 = Math.max(1, Math.ceil(requiredClasses / classesPerDay));
    
    // Days needed with 75% attendance
    const daysNeeded75 = Math.max(1, Math.ceil(requiredClasses / (classesPerDay * 0.75)));
    
    return {
      classes: requiredClasses,
      days100: daysNeeded100,
      days75: daysNeeded75
    };
  };

  const skipAllowance = calculateMaxSkipAllowance();
  const targetRequirements = calculateToReachTarget();

  // Calculate based on skip mode
  const classesToSkip = skipMode === "days" ? skipClasses * classesPerDay : skipClasses;
  const futureTotal = total + skipClasses;
  const futureAttended = attended + (skipClasses - classesToSkip);
  const futurePercentage = (futureAttended / futureTotal) * 100;

  // Calculate required attendance to reach target after skipping
  const requiredAttended = Math.ceil((target / 100) * futureTotal);
  const mustAttend = Math.max(0, requiredAttended - futureAttended);
  const daysToReachTarget = Math.ceil(mustAttend / classesPerDay);

  // Calculate if on track
  const isOnTrack = futurePercentage >= target;
  const isDropping = futurePercentage < currentPercentage;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6"
      >
        <AnimatePresence>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-6xl mx-auto space-y-6"
          >
            {/* Header */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {student.name}
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Registration:{" "}
                    <span className="font-semibold">{student.regdNo}</span>
                    {student.section && (
                      <>
                        {" "}
                        | Section:{" "}
                        <span className="font-semibold">{student.section}</span>
                      </>
                    )}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={24} />
                    <span className="text-2xl font-bold">
                      {currentPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-sm opacity-90">Current Attendance</p>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Current Stats */}
              <motion.div
                variants={itemVariants}
                className="lg:col-span-2 space-y-6"
              >
                {/* Progress Charts */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <PieChart className="text-blue-500" />
                    Attendance Overview
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Current Attendance Circle */}
                    <div className="relative">
                      <div className="w-48 h-48 mx-auto relative">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#e2e8f0"
                            strokeWidth="8"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={`${
                              (currentPercentage / 100) * 282.6
                            } 282.6`}
                            transform="rotate(-90 50 50)"
                          />
                          <defs>
                            <linearGradient
                              id="gradient"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="0%"
                            >
                              <stop offset="0%" stopColor="#3b82f6" />
                              <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-bold text-gray-900">
                            {currentPercentage.toFixed(1)}%
                          </span>
                          <span className="text-gray-600">Current</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-xl">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Attended</span>
                          <span className="font-bold text-blue-600">
                            {attended}
                          </span>
                        </div>
                        <div className="w-full bg-blue-100 rounded-full h-2 mt-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(attended / total) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Total Classes</span>
                          <span className="font-bold text-gray-700">{total}</span>
                        </div>
                      </div>

                      {/* Skip Allowance Box */}
                      <div className={`p-4 rounded-xl ${skipAllowance.safe ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          {skipAllowance.safe ? (
                            <SkipForward className="text-emerald-500" size={20} />
                          ) : (
                            <Zap className="text-amber-500" size={20} />
                          )}
                          <span className="font-semibold">
                            {skipAllowance.safe ? "Safe Skip Allowance" : "Required to Reach 75%"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {skipAllowance.safe ? (
                            <>You can safely skip <b>{skipAllowance.classes} classes</b> ({skipAllowance.days} days)</>
                          ) : (
                            <>You need <b>{skipAllowance.classes} classes</b> in <b>{skipAllowance.days100} days</b> (with 100% attendance)</>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Control Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Target className="text-purple-500" />
                    Attendance Planner
                  </h2>

                  {/* Target Slider */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Target size={20} />
                        Target Attendance
                      </label>
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {target}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="99"
                      value={target}
                      onChange={(e) => setTarget(parseInt(e.target.value))}
                      className="w-full h-3 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-600 [&::-webkit-slider-thumb]:to-pink-600 [&::-webkit-slider-thumb]:shadow-lg"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>50%</span>
                      <span>75%</span>
                      <span>99%</span>
                    </div>
                  </div>

                  {/* Classes Per Day Slider */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Calendar size={20} />
                        Classes Per Day
                      </label>
                      <span className="text-2xl font-bold text-blue-600">
                        {classesPerDay}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={classesPerDay}
                        onChange={(e) =>
                          setClassesPerDay(parseInt(e.target.value))
                        }
                        className="w-full h-3 bg-gradient-to-r from-blue-100 to-blue-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:shadow-lg"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-2 px-1">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <span key={num}>{num}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Skip Classes/Days Section */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          {isDropping ? (
                            <TrendingDown size={20} />
                          ) : (
                            <TrendingUp size={20} />
                          )}
                          Skip {skipMode === "days" ? "Days" : "Classes"}
                        </label>
                        <div className="flex gap-4 mt-2">
                          <button
                            onClick={() => setSkipMode("classes")}
                            className={`px-4 py-2 rounded-lg transition-all ${
                              skipMode === "classes"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            By Classes
                          </button>
                          <button
                            onClick={() => setSkipMode("days")}
                            className={`px-4 py-2 rounded-lg transition-all ${
                              skipMode === "days"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            By Days
                          </button>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-red-600">
                        {skipClasses} {skipMode === "days" ? "days" : "classes"}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={skipMode === "days" ? "30" : "50"}
                      step={skipMode === "days" ? "0.1" : "1"}
                      value={skipClasses}
                      onChange={(e) => setSkipClasses(parseFloat(e.target.value))}
                      className="w-full h-3 bg-gradient-to-r from-red-100 to-red-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-600 [&::-webkit-slider-thumb]:shadow-lg"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>0</span>
                      <span>
                        {skipMode === "days" ? "15 days" : "25 classes"}
                      </span>
                      <span>
                        {skipMode === "days" ? "30 days" : "50 classes"}
                      </span>
                    </div>
                    
                    {/* Skip Allowance Indicator */}
                    {skipAllowance.safe && skipAllowance.classes > 0 && (
                      <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="text-emerald-500" size={18} />
                          <span className="text-sm font-medium text-emerald-700">
                            Safe skip allowance: {skipAllowance.classes} classes ({skipAllowance.days} days)
                          </span>
                        </div>
                        <div className="w-full bg-emerald-100 rounded-full h-2 mt-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${Math.min((skipClasses / (skipMode === 'days' ? skipAllowance.days : skipAllowance.classes)) * 100, 100)}%` 
                            }}
                          />
                        </div>
                        <p className="text-xs text-emerald-600 mt-1">
                          {skipClasses <= (skipMode === 'days' ? skipAllowance.days : skipAllowance.classes) 
                            ? "Within safe limit" 
                            : "Exceeding safe limit"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Right Column - Results */}
              <motion.div variants={itemVariants} className="space-y-6">
                {/* Results Card */}
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold mb-6">
                    Attendance Projection
                  </h2>

                  {/* Future Attendance */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="opacity-90">
                        After skipping {skipClasses}{" "}
                        {skipMode === "days" ? "days" : "classes"}:
                      </span>
                      <span className="text-3xl font-bold">
                        {futurePercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3">
                      <div
                        className="bg-white h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(futurePercentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Skip/Reach Calculations */}
                  <div className="space-y-4 mb-6">
                    {/* Current Status: Can Skip or Need to Reach */}
                    <div className={`p-4 rounded-xl ${currentPercentage >= 75 ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        {currentPercentage >= 75 ? (
                          <SkipForward size={20} />
                        ) : (
                          <ArrowUpRight size={20} />
                        )}
                        <span className="font-semibold">
                          {currentPercentage >= 75 ? 'Can Skip' : 'Need to Reach 75%'}
                        </span>
                      </div>
                      {currentPercentage >= 75 ? (
                        <div className="space-y-2">
                          <p className="text-lg font-bold">
                            {skipAllowance.classes} classes
                          </p>
                          <p className="text-sm opacity-90">
                            ({skipAllowance.days} days with {classesPerDay} classes/day)
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-lg font-bold">
                            {targetRequirements.classes} classes
                          </p>
                          <div className="text-sm space-y-1">
                            <p className="opacity-90">
                              <Clock size={14} className="inline mr-1" />
                              With 100% attendance: {targetRequirements.days100} days
                            </p>
                            <p className="opacity-90">
                              <Zap size={14} className="inline mr-1" />
                              With 75% attendance: {targetRequirements.days75} days
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* To Reach Target */}
                    <div className="bg-white/10 p-4 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <Target size={24} />
                        <span className="font-semibold">To reach {target}%:</span>
                      </div>
                      <p className="text-2xl font-bold mb-2">
                        {targetRequirements.classes} more classes
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm opacity-90">
                          <Clock size={14} className="inline mr-1" />
                          With 100% attendance: {targetRequirements.days100} days
                        </p>
                        <p className="text-sm opacity-90">
                          <Zap size={14} className="inline mr-1" />
                          With 75% attendance: {targetRequirements.days75} days
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status Message */}
                  <div
                    className={`p-4 rounded-xl ${
                      isOnTrack ? "bg-green-500/20" : "bg-amber-500/20"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isOnTrack ? (
                        <>
                          <CheckCircle size={20} />
                          <span className="font-semibold">
                            Great! You're on track
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={20} />
                          <span className="font-semibold">Need to focus</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm mt-2 opacity-90">
                      {isOnTrack
                        ? "Maintain your current attendance rate"
                        : `Attend at least ${Math.ceil(
                            mustAttend / daysToReachTarget
                          )} classes per day`}
                    </p>
                  </div>
                </div>

                {/* Statistics */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-gray-700 flex items-center gap-2">
                        {currentPercentage >= 75 ? (
                          <SkipForward size={16} />
                        ) : (
                          <ArrowUpRight size={16} />
                        )}
                        {currentPercentage >= 75 ? "Can Skip" : "Need to Reach 75%"}
                      </span>
                      <span className={`font-bold ${currentPercentage >= 75 ? 'text-blue-600' : 'text-amber-600'}`}>
                        {currentPercentage >= 75 ? skipAllowance.classes : targetRequirements.classes}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-gray-700 flex items-center gap-2">
                        <Calendar size={16} />
                        Days Required
                      </span>
                      <span className="font-bold text-purple-600">
                        {currentPercentage >= 75 ? skipAllowance.days : targetRequirements.days100}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-700">Current Status</span>
                      <span className={`font-bold ${currentPercentage >= 75 ? 'text-green-600' : 'text-amber-600'}`}>
                        {currentPercentage >= 75 ? 'Safe' : 'At Risk'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                      <span className="text-gray-700">Buffer Classes</span>
                      <span className="font-bold text-amber-600">
                        {Math.max(0, attended - Math.ceil((75 / 100) * total))}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Skip Allowance Summary */}
            <motion.div
              variants={itemVariants}
              className={`p-6 rounded-2xl ${skipAllowance.safe ? 'bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200' : 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200'}`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${skipAllowance.safe ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                  {skipAllowance.safe ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {skipAllowance.safe ? '🎯 You have safe skip allowance!' : '⚠️ Attendance Improvement Required'}
                  </h3>
                  <p className="text-gray-700">
                    {skipAllowance.safe ? (
                      <>Based on your current attendance of <b>{currentPercentage.toFixed(1)}%</b>, you can safely skip <b>{skipAllowance.classes} classes</b> (approximately <b>{skipAllowance.days} days</b> with {classesPerDay} classes per day) while maintaining ≥75% attendance.</>
                    ) : (
                      <>Your current attendance is <b>{currentPercentage.toFixed(1)}%</b>. You need to attend <b>{skipAllowance.classes} more classes</b> to reach 75%. This will take <b>{skipAllowance.days100} days</b> with perfect attendance or <b>{skipAllowance.days75} days</b> with 75% attendance going forward.</>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ================= SUBJECT WISE TABLE ================= */}
            {subjectAttendance && Object.keys(subjectAttendance).length > 0 && (
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 mt-6"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <BookOpen className="text-blue-500" />
                  Subject-wise Attendance
                </h2>

                <div className="space-y-4">
                  {Object.entries(subjectAttendance)
                    .filter(([subject]) => subject.trim() !== "")
                    .map(([subject, data], index) => {
                      const percent = Number(data.percentage || 0);
                      const isSafe = percent >= 75;
                      const total = data.total || 0;
                      const attended = data.attended || 0;

                      // Calculate for this subject
                      const subjectSkipAllowance = isSafe 
                        ? Math.max(0, Math.floor((attended - 0.75 * total) / 0.75))
                        : 0;
                      
                      const subjectDaysNeeded100 = !isSafe 
                        ? Math.max(1, Math.ceil((0.75 * total - attended) / classesPerDay))
                        : 0;
                      
                      const subjectDaysNeeded75 = !isSafe 
                        ? Math.max(1, Math.ceil((0.75 * total - attended) / (classesPerDay * 0.75)))
                        : 0;

                      return (
                        <motion.div
                          key={subject}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.06 }}
                          whileHover={{ scale: 1.015 }}
                          className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:shadow-xl hover:ring-2 hover:ring-blue-200 transition-all"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold text-slate-800">
                              {subject}
                            </h3>

                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                isSafe
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-rose-100 text-rose-700"
                              }`}
                            >
                              {isSafe ? "Safe" : "Shortage"}
                            </span>
                          </div>

                          <div className="grid grid-cols-4 text-center mb-3">
                            <div>
                              <p className="text-sm text-slate-500">Attended</p>
                              <p className="text-lg font-bold text-blue-600">
                                {attended}
                              </p>
                            </div>

                            <div>
                              <p className="text-sm text-slate-500">Total</p>
                              <p className="text-lg font-bold text-slate-700">
                                {total}
                              </p>
                            </div>

                            <div>
                              <p className="text-sm text-slate-500">%</p>
                              <p className="text-lg font-bold text-slate-900">
                                {percent.toFixed(1)}%
                              </p>
                            </div>

                            <div>
                              <p className="text-sm text-slate-500">
                                {isSafe ? "Can Skip" : "Need"}
                              </p>
                              <p
                                className={`text-lg font-bold ${
                                  isSafe ? "text-emerald-600" : "text-rose-600"
                                }`}
                              >
                                {isSafe ? subjectSkipAllowance : Math.ceil(0.75 * total - attended)}
                              </p>
                            </div>
                          </div>

                          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(percent, 100)}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className={`h-3 rounded-full ${
                                isSafe
                                  ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                                  : "bg-gradient-to-r from-rose-400 to-rose-600"
                              }`}
                            />
                          </div>

                          <div className="mt-2 text-sm">
                            {isSafe ? (
                              <span className="text-emerald-600 font-medium">
                                ✅ Can skip {subjectSkipAllowance} classes safely
                              </span>
                            ) : (
                              <div className="space-y-1">
                                <span className="text-rose-600 font-medium">
                                  ⚠️ Need {Math.ceil(0.75 * total - attended)} more classes
                                </span>
                                <div className="text-xs text-rose-500">
                                  • Perfect attendance: {subjectDaysNeeded100} days
                                  <br />
                                  • 75% attendance: {subjectDaysNeeded75} days
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default StudentAttendance;