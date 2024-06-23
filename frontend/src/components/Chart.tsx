import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  BarChart,
  Bar,
} from "recharts";
import { TaskInterface } from "../types/types";

// Sample tasks data
const tasksData: TaskInterface[] = [
  {
    id: 1,
    name: "Task 1",
    description: "First task",
    start_date: "2024-06-01",
    completion_date: "2024-06-10",
    card_id: 101,
    order: 1,
  },
  {
    id: 2,
    name: "Task 2",
    description: "Second task",
    start_date: "2024-06-03",
    completion_date: "1970-01-01", // Not completed
    card_id: 102,
    order: 1,
  },
  {
    id: 3,
    name: "Task 3",
    description: "Third task",
    start_date: "2024-06-05",
    completion_date: "1970-01-01", // Not completed
    card_id: 103,
    order: 1,
  },
  {
    id: 4,
    name: "Task 4",
    description: "Fourth task",
    start_date: "2024-06-08",
    completion_date: "2024-06-15",
    card_id: 104,
    order: 1,
  },
];

const calculateBurnDownData = (): { date: string; remaining: number }[] => {
  let endDate = new Date();
  endDate.setHours(0, 0, 0, 0);
  let currentDate = new Date(tasksData[0].start_date);

  let totalDays = Math.ceil(
    (endDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
  );

  let burnDownData: { date: string; remaining: number }[] = [];
  let remainingTasks = tasksData.filter(
    (task) => task.completion_date === "1970-01-01"
  ).length;

  for (let i = 0; i <= totalDays; i++) {
    let dateStr = currentDate.toISOString().split("T")[0];
    burnDownData.push({
      date: dateStr,
      remaining: remainingTasks,
    });

    currentDate.setDate(currentDate.getDate() + 1);
    tasksData.forEach((task) => {
      if (
        task.completion_date !== "1970-01-01" &&
        task.completion_date === dateStr
      ) {
        remainingTasks--;
      }
    });
  }

  return burnDownData;
};

const calculateVelocityData = (): { date: string; velocity: number }[] => {
  let velocityData: { date: string; velocity: number }[] = [];
  let cumulativeCompleted = 0;

  tasksData.forEach((task) => {
    if (task.completion_date !== "1970-01-01") {
      cumulativeCompleted++;
      velocityData.push({
        date: task.completion_date,
        velocity: cumulativeCompleted,
      });
    }
  });

  return velocityData;
};

function Chart() {
  const burnDownData = calculateBurnDownData();
  const velocityData = calculateVelocityData();
  const [isHidden, setIsHidden] = React.useState(true);
  return (
    <div>
      <button
        onClick={() => setIsHidden(!isHidden)}
        className="bg-gray-800 p-2 text-center flex text-white rounded-r-md hover:bg-gray-900 mt-4  justify-start"
      >
        <p className="pr-2">Show Graphs</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
          />
        </svg>
      </button>

      <div
        className={`grid pt-12 grid-cols-1 w-1/6 gap-6 ${
          isHidden ? "hidden" : ""
        }`}
      >
        <div className="bg-white pr-4 rounded-lg shadow-md text-gray-800">
          <h2 className="text-xl text-center font-bold mb-4">
            Burn-down Chart
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={burnDownData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="date" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip
                  formatter={(value, name, props) => {
                    return [`${value} tasks remaining`, ""];
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="remaining"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md text-gray-800">
          <h2 className="text-xl font-bold mb-4">Velocity Chart</h2>
          <div className="h-80">
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chart;
