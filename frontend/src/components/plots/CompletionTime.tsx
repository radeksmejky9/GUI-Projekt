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
function CompletionTime({ tasks }: Props) {
  const avgTaskCompletionTimeData = React.useMemo(
    () => calculateAvgTaskCompletionTimeData(tasks),
    [tasks]
  );
  const COLORS = ["#8884d8", "#82ca9d"];
  return (
    <ResponsiveContainer width="100%">
      <BarChart data={avgTaskCompletionTimeData}>
        <Tooltip />
        <Legend />
        <XAxis dataKey="date" />
        <YAxis />
        <Bar dataKey="TimeInHours" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}
function calculateAvgTaskCompletionTimeData(
  tasksData: TaskInterface[]
): { date: string; TimeInHours: string }[] {
  const completionTimes: { [date: string]: number[] } = {};

  tasksData.forEach((task) => {
    if (task.start_date && task.completion_date) {
      if (new Date(task.completion_date) > new Date("1970-01-01")) {
        const start = new Date(task.start_date).getTime();
        const end = new Date(task.completion_date).getTime();
        const timeDiff = (end - start) / (1000 * 3600);
        const completionDate = task.completion_date.split("T")[0];
        if (!completionTimes[completionDate]) {
          completionTimes[completionDate] = [];
        }
        completionTimes[completionDate].push(timeDiff);
      }
    }
  });
  return Object.entries(completionTimes).map(([date, times]) => ({
    date,
    TimeInHours: (
      times.reduce((acc, time) => acc + time, 0) / times.length
    ).toFixed(2),
  }));
}
export default CompletionTime;
