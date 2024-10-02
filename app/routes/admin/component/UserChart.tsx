import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const UserChart = ({ username, modifiedCount, reviewedCount }) => {
  const data = [
    { name: "Modified Work", value: modifiedCount },
    { name: "Reviewed Work", value: reviewedCount },
  ];

  const COLORS = ["#0088FE", "#FF8042"]; // Colors for the chart

  return (
    <div className="bg-blue-100 m-5 rounded-md">
      <h3 className="text-center">{username}</h3>
      <PieChart width={400} height={300}>
        <Pie
          data={data}
          cx={200}
          cy={150}
          innerRadius={50}
          outerRadius={100}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default UserChart;
