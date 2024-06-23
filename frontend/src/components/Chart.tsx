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
import { TaskInterface } from "../types/types"; // Adjust the path as per your project structure
import ArrowLeftIcon from "./icons/ArrowLeftIcon";
import ArrowRightIcon from "./icons/ArrowRightIcon";

interface Props {
  workspace_id: number;
  tasks: TaskInterface[];
}

const COLORS = ["#8884d8", "#82ca9d"];

const Chart: React.FC<Props> = ({ workspace_id, tasks }) => {
  const [isHidden, setIsHidden] = React.useState(true);

  const burnDownData = React.useMemo(
    () => calculateBurnDownData(tasks),
    [tasks]
  );
  const velocityData = React.useMemo(
    () => calculateVelocityData(tasks),
    [tasks]
  );
  const taskCompletionStatusData = React.useMemo(
    () => calculateTaskCompletionStatusData(tasks),
    [tasks]
  );
  const avgTaskCompletionTimeData = React.useMemo(
    () => calculateAvgTaskCompletionTimeData(tasks),
    [tasks]
  );

  return (
    <div>
      <button
        onClick={() => setIsHidden(!isHidden)}
        className="bg-gray-800 p-2 text-center flex text-white rounded-r-md hover:bg-gray-900 mt-4 justify-start"
      >
        {isHidden ? (
          <div className="flex">
            <p className="pr-2">Show Graphs</p>
            <ArrowRightIcon />
          </div>
        ) : (
          <div className="flex">
            <p className="pr-2">Hide Graphs</p>
            <ArrowLeftIcon />
          </div>
        )}
      </button>

      {!isHidden && (
        <div
          tabIndex={-1}
          className="z-50 fixed grid mt-12 grid-cols-2 rounded-r-md shadow-2xl bg-gray-100 p-4"
        >
          <div className="bg-gray-100 rounded-lg text-gray-800">
            <h2 className="text-xl ml-4 font-bold mb-4">Burn-down Chart</h2>
            <div tabIndex={-1} className="h-80 w-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={burnDownData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis dataKey="date" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value} tasks remaining`,
                      "",
                    ]}
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

          <div className="bg-gray-100 rounded-lg text-gray-800">
            <h2 className="text-xl font-bold ml-4 mb-4">Velocity Chart</h2>
            <div className="h-80 w-80">
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

          <div className="bg-gray-100 rounded-lg text-gray-800">
            <h2 className="text-xl ml-4 font-bold mb-4">
              Task Completion Status
            </h2>
            <div tabIndex={-1} className="h-80 w-80">
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
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-100 rounded-lg text-gray-800">
            <h2 className="text-lg   font-bold ml-4 mb-4">
              Average Task Completion Time
            </h2>
            <div className="h-80 w-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={avgTaskCompletionTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis dataKey="date" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avgCompletionTime" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function calculateBurnDownData(
    tasksData: TaskInterface[]
  ): { date: string; remaining: number }[] {
    if (!tasksData.length) return [];

    let endDate = new Date();
    endDate.setHours(0, 0, 0, 0);

    let currentDate = new Date(tasksData[0].start_date);
    let totalDays = Math.ceil(
      (endDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
    );

    let burnDownData: { date: string; remaining: number }[] = [];
    let remainingTasks = tasksData.filter(
      (task) =>
        !task.completion_date ||
        new Date(task.completion_date) <= new Date("1970-01-01")
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
          task.completion_date &&
          task.completion_date.split("T")[0] === dateStr
        ) {
          remainingTasks--;
        }
      });
    }

    return burnDownData;
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

  function calculateAvgTaskCompletionTimeData(
    tasksData: TaskInterface[]
  ): { date: string; avgCompletionTime: number }[] {
    const completionTimes: { [date: string]: number[] } = {};

    tasksData.forEach((task) => {
      if (task.start_date && task.completion_date) {
        if (new Date(task.completion_date) > new Date("1970-01-01")) {
          const start = new Date(task.start_date).getTime();
          const end = new Date(task.completion_date).getTime();
          const timeDiff = (end - start) / ((1000 * 3600) / 60);
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
      avgCompletionTime:
        times.reduce((acc, time) => acc + time, 0) / times.length,
    }));
  }
};

export default Chart;
