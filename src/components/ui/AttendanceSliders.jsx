const AttendanceSliders = ({
  target,
  setTarget,
  futureClasses,
  setFutureClasses,
  futureAbsents,
  setFutureAbsents,
}) => (
  <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 space-y-6">

    <div>
      <label className="font-medium">
        🎯 Target Attendance: {target}%
      </label>
      <input
        type="range"
        min="60"
        max="95"
        value={target}
        onChange={(e) => setTarget(+e.target.value)}
        className="w-full accent-blue-600"
      />
    </div>

    <div>
      <label className="font-medium">
        📅 Classes Per Day: {futureClasses}
      </label>
      <input
        type="range"
        min="1"
        max="8"
        value={futureClasses}
        onChange={(e) => setFutureClasses(+e.target.value)}
        className="w-full accent-green-600"
      />
    </div>

    <div>
      <label className="font-medium">
        ❌ Absents Today: {futureAbsents}
      </label>
      <input
        type="range"
        min="0"
        max={futureClasses}
        value={futureAbsents}
        onChange={(e) => setFutureAbsents(+e.target.value)}
        className="w-full accent-red-600"
      />
    </div>

  </div>
);

export default AttendanceSliders