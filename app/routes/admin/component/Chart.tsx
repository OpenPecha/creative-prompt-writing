import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const WorkGraph = ({ name, pendingCount, modifiedCount, reviewedCount }) => {
  const data = [
    { name: "Pending Work", value: pendingCount },
    { name: "Modified Work", value: modifiedCount },
    { name: "Reviewed Work", value: reviewedCount },
  ];

  const COLORS = ["#FFBB28", "#0088FE", "#00C49F"]; // Colors for each category

  return (
    <div className="bg-blue-100 p-2 rounded-md" style={{ margin: "20px" }}>
      <h3 className="text-center">{name}</h3>
      <PieChart width={300} height={300}>
        <Pie
          data={data}
          cx={150}
          cy={150}
          innerRadius={40}
          outerRadius={90}
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

export default WorkGraph;
