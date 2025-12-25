import { PieChart, Pie, Cell } from "recharts";

const AttendanceCharts = ({ current, future, mustAttend }) => {
  const data = [
    { name: "Current", value: current },
    { name: "Future", value: future },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="font-semibold mb-4">📊 Attendance Projection</h3>

      <PieChart width={300} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={100}
          dataKey="value"
          animationDuration={800}
        >
          <Cell fill="#2563eb" />
          <Cell fill="#22c55e" />
        </Pie>
      </PieChart>

      <p className="text-center mt-2 text-gray-600">
        You must attend <b>{mustAttend}</b> more classes
      </p>
    </div>
  );
};

export default AttendanceCharts