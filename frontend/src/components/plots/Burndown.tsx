import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TaskInterface } from "../../types/types";

interface Props {
  tasks: TaskInterface[];
}

function BurnDown({ tasks }: Props) {
  const { actualData, expectedData } = React.useMemo(
    () => calculateBurnDownData(tasks),
    [tasks]
  );
  const COLORS = ["#8884d8", "#82ca9d"];

  return (
    <ResponsiveContainer width="100%">
      <LineChart data={actualData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip
          formatter={(value, name, props) => [`${value} tasks remaining`, ""]}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="remaining"
          name="Actual Remaining"
          stroke="#8884d8"
        />
        <Line
          type="monotone"
          dataKey="expected"
          name="Expected Progress"
          stroke="#82ca9d"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function calculateBurnDownData(tasksData: TaskInterface[]) {
  if (!tasksData.length) return { actualData: [], expectedData: [] };

  let endDate = new Date();
  endDate.setHours(0, 0, 0, 0);

  let currentDate = new Date(tasksData[0].start_date);
  let totalDays = Math.ceil(
    (endDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
  );

  let actualData = [];
  let expectedData = [];
  let remainingTasks = tasksData.filter(
    (task) => !task.completion_date || new Date(task.completion_date) > endDate
  ).length;

  for (let i = 0; i <= totalDays; i++) {
    let dateStr = currentDate.toISOString().split("T")[0];
    actualData.push({
      date: dateStr,
      remaining: remainingTasks,
    });

    let expectedRemaining = remainingTasks - (i * remainingTasks) / totalDays;
    expectedData.push({
      date: dateStr,
      expected: expectedRemaining,
    });

    currentDate.setDate(currentDate.getDate() + 1);
    tasksData.forEach((task) => {
      if (
        task.completion_date &&
        task.completion_date.split("T")[0] === dateStr
      ) {
        remainingTasks--;
      }
    });
  }

  return { actualData, expectedData };
}

export default BurnDown;
