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
function TaskDistribution({ tasks }: Props) {
  const taskCompletionStatusData = React.useMemo(
    () => calculateTaskCompletionStatusData(tasks),
    [tasks]
  );
  const COLORS = ["#8884d8", "#82ca9d"];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={taskCompletionStatusData}
          dataKey="count"
          nameKey="status"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {taskCompletionStatusData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

function calculateTaskCompletionStatusData(
  tasksData: TaskInterface[]
): { status: string; count: number }[] {
  const completedTasks = tasksData.filter(
    (task) => new Date(task.completion_date) > new Date("1970-01-01")
  ).length;
  const incompleteTasks = tasksData.length - completedTasks;

  return [
    { status: "Completed", count: completedTasks },
    { status: "Incomplete", count: incompleteTasks },
  ];
}

export default TaskDistribution;
