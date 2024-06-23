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
} from "recharts";
import { TaskInterface } from "../types/types"; // Adjust the path as per your project structure

interface Props {
  workspace_id: number;
  tasks: TaskInterface[];
}

const Chart: React.FC<Props> = ({ tasks }) => {
  const calculateBurnDownData = (
    tasksData: TaskInterface[]
  ): { date: string; remaining: number }[] => {
    {
      console.log(tasksData);
    }
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
  };

  const calculateVelocityData = (
    tasksData: TaskInterface[]
  ): { date: string; velocity: number }[] => {
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
  };

  const burnDownData = calculateBurnDownData(tasks);
  const velocityData = calculateVelocityData(tasks);

  const [isHidden, setIsHidden] = React.useState(true);

  return (
    <div>
      <button
        onClick={() => setIsHidden(!isHidden)}
        className="bg-gray-800 p-2 text-center flex text-white rounded-r-md hover:bg-gray-900 mt-4 justify-start"
      >
        {isHidden ? (
          <p className="pr-2">Show Graphs</p>
        ) : (
          <p className="pr-2">Hide Graphs</p>
        )}
      </button>

      <div
        className={`grid pt-12 grid-cols-1 w-1/2 gap-6 ${
          isHidden ? "hidden" : ""
        }`}
      >
        <div className="bg-white p-4 rounded-lg shadow-md text-gray-800">
          <h2 className="text-xl ml-4 font-bold mb-4">Burn-down Chart</h2>
          <div className="h-80">
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

        <div className="bg-white p-4  rounded-lg shadow-md text-gray-800">
          <h2 className="text-xl  font-bold ml-4 mb-4">Velocity Chart</h2>
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
};

export default Chart;
