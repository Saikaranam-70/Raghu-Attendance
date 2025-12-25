// import { useParams } from "react-router-dom";
// import { useState } from "react";
// import AttendanceCard from "../ui/AttendanceCard";
// import AttendanceSliders from "../ui/AttendanceSliders";
// import AttendanceCharts from "../ui/AttendanceCharts";

// const StudentAttendance = () => {
//   const { regdNo } = useParams();

//   // MOCK DATA (replace with Excel lookup)
//   const totalClasses = 423;
//   const attended = 350;

//   const [target, setTarget] = useState(75);
//   const [futureClasses, setFutureClasses] = useState(1);
//   const [futureAbsents, setFutureAbsents] = useState(0);

//   const currentPercentage = (attended / totalClasses) * 100;

//   const futureTotal = totalClasses + futureClasses;
//   const futureAttended =
//     attended + (futureClasses - futureAbsents);

//   const futurePercentage =
//     (futureAttended / futureTotal) * 100;

//   const requiredAttendance =
//     Math.ceil((target / 100) * futureTotal);

//   const mustAttend =
//     Math.max(0, requiredAttendance - futureAttended);

//   return (
//     <div className="min-h-screen bg-slate-100 p-6">
//       <AttendanceCard
//         regdNo={regdNo}
//         attended={attended}
//         total={totalClasses}
//         percentage={currentPercentage}
//       />

//       <AttendanceSliders
//         target={target}
//         setTarget={setTarget}
//         futureClasses={futureClasses}
//         setFutureClasses={setFutureClasses}
//         futureAbsents={futureAbsents}
//         setFutureAbsents={setFutureAbsents}
//       />

//       <AttendanceCharts
//         current={currentPercentage}
//         future={futurePercentage}
//         mustAttend={mustAttend}
//       />
//     </div>
//   );
// };

// export default StudentAttendance;
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { loadAttendanceFromExcel } from "../../utils/loadAttendance";
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
} from "lucide-react";

const StudentAttendance = () => {
  const { regdNo } = useParams();
  const [student, setStudent] = useState(null);
  const [section, setSection] = useState(null);
  const [error, setError] = useState("");

  // Controls
  const [target, setTarget] = useState(75);
  const [classesPerDay, setClassesPerDay] = useState(6);
  const [skipClasses, setSkipClasses] = useState(0);
  const [skipMode, setSkipMode] = useState("classes"); // "classes" or "days"

  useEffect(() => {
    loadAttendanceFromExcel()
      .then((sections) => {
        for (const sec of sections) {
          const found = sec.students.find(
            (s) => String(s.regdNo).trim() === String(regdNo).trim()
          );
          if (found) {
            setStudent(found);
            setSection(sec);
            return;
          }
        }
        setError("Student not found");
      })
      .catch((err) => setError(err.message));
  }, [regdNo]);

  if (error) return <p className="text-red-600 text-center p-8">{error}</p>;
  if (!student || !section)
    return <p className="text-center p-8">Loading...</p>;

  // Calculations
  const total = section.totalClasses;
  const attended = student.attended;
  const currentPercentage = (attended / total) * 100;

  // Calculate based on skip mode
  const classesToSkip =
    skipMode === "days" ? skipClasses * classesPerDay : skipClasses;
  const futureTotal = total + skipClasses;
  const futureAttended = attended + (skipClasses - classesToSkip);
  const futurePercentage = (futureAttended / futureTotal) * 100;

  // Calculate required attendance to reach target
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
                  <span className="font-semibold">{student.regdNo}</span> |
                  Section:{" "}
                  <span className="font-semibold">{section.section}</span>
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
                        {/* Background circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="8"
                        />
                        {/* Progress circle */}
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

                    <div
                      className={`p-4 rounded-xl ${
                        isOnTrack ? "bg-green-50" : "bg-amber-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {isOnTrack ? (
                          <CheckCircle className="text-green-500" size={20} />
                        ) : (
                          <AlertCircle className="text-amber-500" size={20} />
                        )}
                        <span className="font-semibold">
                          {isOnTrack ? "On Track" : "Needs Improvement"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {isOnTrack
                          ? `You're maintaining above ${target}% target`
                          : `You need ${mustAttend} more classes to reach ${target}%`}
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
                      min="2"
                      max="9"
                      value={classesPerDay}
                      onChange={(e) =>
                        setClassesPerDay(parseInt(e.target.value))
                      }
                      className="w-full h-3 bg-gradient-to-r from-blue-100 to-blue-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:shadow-lg"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2 px-1">
                      {[2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
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

                {/* Required Attendance */}
                <div className="bg-white/10 p-4 rounded-xl mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Target size={24} />
                    <span className="font-semibold">To reach {target}%:</span>
                  </div>
                  <p className="text-2xl font-bold mb-2">
                    {mustAttend} more classes
                  </p>
                  <p className="opacity-90">
                    Approx. {daysToReachTarget} days ({classesPerDay}{" "}
                    classes/day)
                  </p>
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
                    <span className="text-gray-700">
                      Remaining Classes Needed
                    </span>
                    <span className="font-bold text-blue-600">
                      {mustAttend}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-gray-700">Days Required</span>
                    <span className="font-bold text-purple-600">
                      {daysToReachTarget}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700">Current Streak</span>
                    <span className="font-bold text-green-600">Good</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                    <span className="text-gray-700">Safety Buffer</span>
                    <span className="font-bold text-amber-600">
                      {Math.max(0, attended - Math.ceil((75 / 100) * total))}{" "}
                      classes
                    </span>
                  </div>
                </div>
              </div>

              {/* Trend Chart */}
              {/* <div className="bg-white rounded-2xl shadow-lg p-6"> */}
                {/* <h3 className="font-bold text-gray-900 mb-4">
                  Attendance Trend
                </h3> */}
                {/* <div className="h-40 relative"> */}
                  
                  {/* <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-around">
                    {[60, 65, 70, 68, 72, currentPercentage].map(
                      (value, index) => (
                        <motion.div
                          key={index}
                          initial={{ height: 0 }}
                          animate={{ height: `${value}%` }}
                          transition={{ delay: index * 0.1 }}
                          className={`w-8 rounded-t-lg ${
                            index === 5
                              ? "bg-gradient-to-t from-blue-500 to-purple-500"
                              : "bg-gradient-to-t from-blue-200 to-purple-200"
                          }`}
                        />
                      )
                    )}
                  </div> */}
                  {/* <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200" />
                </div> */}
                {/* <div className="flex justify-between text-sm text-gray-500 mt-4">
                  <span>Previous</span>
                  <span>Current</span>
                </div> */}
              {/* </div> */}
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <motion.div
            variants={itemVariants}
            className={`text-center p-4 rounded-xl ${
              isOnTrack
                ? "bg-green-100 text-green-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            <p className="font-semibold">
              {isOnTrack
                ? "🎯 You're on track to achieve your target!"
                : `⚠️ You need to attend ${mustAttend} more classes (approx. ${daysToReachTarget} days) to reach ${target}%`}
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
    </div>
  );
};

export default StudentAttendance;
