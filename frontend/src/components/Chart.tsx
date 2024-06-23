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
import Velocity from "./plots/Velocity";
import TaskDistribution from "./plots/TaskDistribution";
import CompletionTime from "./plots/CompletionTime";

interface Props {
  workspace_id: number;
  tasks: TaskInterface[];
}

const COLORS = ["#8884d8", "#82ca9d"];

const Chart: React.FC<Props> = ({ workspace_id, tasks }) => {
  const [isHidden, setIsHidden] = React.useState(true);
  return (
    <div>
      <button
        onClick={() => setIsHidden(!isHidden)}
        className="bg-gray-800 p-2 text-center flex text-white rounded-r-md hover:bg-gray-900 mt-2 justify-start"
      >
        {isHidden && (
          <div className="flex">
            <p className="pr-2">Show Graphs</p>
            <ArrowRightIcon />
          </div>
        )}
      </button>

      {!isHidden && (
        <div>
          <button
            onClick={() => setIsHidden(!isHidden)}
            style={{ left: "300px", top: "59px" }}
            className="bg-gray-800 absolute p-2 text-center flex text-white rounded-r-md hover:bg-gray-900 mt-2 justify-start"
          >
            <div className="flex">
              <p className="pr-2">Hide Graphs</p>
              <ArrowLeftIcon />
            </div>
          </button>
          <div
            tabIndex={-1}
            className="z-50 fixed top-25 left-0 bottom-0 max-h-screen w-[300px] grid grid-cols-1 rounded-r-md shadow-2xl bg-gray-100 p-4 overflow-y-auto"
          >
            <div className="bg-gray-100 rounded-lg text-gray-800">
              <h2 className="text-xl font-bold ml-4 mb-4">Velocity Chart</h2>
              <div className="h-60 w-60">
                <Velocity tasks={tasks} />
              </div>
            </div>

            <div className="bg-gray-100 rounded-lg text-gray-800">
              <h2 className="text-xl ml-4 font-bold mb-4">
                Task Completion Status
              </h2>
              <div tabIndex={-1} className="h-60 w-60">
                <TaskDistribution tasks={tasks} />
              </div>
            </div>

            <div className="bg-gray-100 rounded-lg text-gray-800">
              <h2 className="text-lg font-bold ml-4 mb-4">
                Average Task Completion Time
              </h2>
              <div className="h-60 w-60">
                <CompletionTime tasks={tasks} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chart;
