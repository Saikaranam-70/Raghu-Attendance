const AttendanceCard = ({ regdNo, attended, total, percentage }) => (
  <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
    <h2 className="text-xl font-semibold">🎓 {regdNo}</h2>
    <p className="text-gray-600 mt-2">
      Attended: <b>{attended}</b> / {total}
    </p>

    <div className="mt-4">
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            percentage >= 75 ? "bg-green-500" : "bg-red-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-1 text-sm text-gray-500">
        {percentage.toFixed(2)}%
      </p>
    </div>
  </div>
);

export default AttendanceCard