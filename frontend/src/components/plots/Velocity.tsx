import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TaskInterface } from "../../types/types";

interface Props {
  tasks: TaskInterface[];
}
function Velocity({ tasks }: Props) {
  const velocityData = React.useMemo(
    () => calculateVelocityData(tasks),
    [tasks]
  );
  const COLORS = ["#8884d8", "#82ca9d"];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={velocityData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
        <XAxis dataKey="date" stroke="#ccc" />
        <YAxis stroke="#ccc" />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="velocity"
          stroke="#82ca9d"
          dot={{ strokeWidth: 3, r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
function calculateVelocityData(
  tasksData: TaskInterface[]
): { date: string; velocity: number }[] {
  if (!tasksData.length) return [];

  let velocityData: { date: string; velocity: number }[] = [];
  let cumulativeCompleted = 0;
  tasksData.forEach((task) => {
    if (
      task.completion_date &&
      new Date(task.completion_date) > new Date("1970-01-01")
    ) {
      cumulativeCompleted++;
      velocityData.push({
        date: task.completion_date.split("T")[0], // Use date part only
        velocity: cumulativeCompleted,
      });
    }
  });

  return velocityData;
}

export default Velocity;
