import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { TaskInterface } from "../../types/types";

interface Props {
  tasks: TaskInterface[];
}

function TaskDistribution({ tasks }: Props) {
  const taskCompletionStatusData = React.useMemo(
    () => calculateTaskCompletionStatusData(tasks),
    [tasks]
  );

  const COLORS = ["#82ca9d", "#ff7f50", "#8884d8"];

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
  const currentDate = new Date();

  const completedTasks = tasksData.filter(
    (task) =>
      task.completion_date && new Date(task.completion_date) > new Date(0)
  ).length;

  const failedTasks = tasksData.filter(
    (task) =>
      task.deadline &&
      new Date(task.deadline) < currentDate &&
      (!task.completion_date || new Date(task.completion_date) <= new Date(0))
  ).length;

  const incompleteTasks = tasksData.length - completedTasks - failedTasks;

  return [
    { status: "Completed", count: completedTasks },
    { status: "Overdue", count: failedTasks },
    { status: "Incomplete", count: incompleteTasks },
  ];
}

export default TaskDistribution;
