import { z } from "zod"

import { columns } from "../components/tasks/columns"
import { DataTable } from "../components/tasks/data-table"
import { taskSchema } from "../data/schema"
import { getAllTasks } from "../api/API"; 

export const metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
}

// Simulate a database read for tasks.
// function getTasks() {
  // const data = require("../data/tasks.json")
  
  // console.log(z.array(taskSchema).parse(data))
  // // console.log(tasks)
  // return z.array(taskSchema).parse(data)
  // return data
// }
const fetchTasks = async () => {
  try {
    const data = await getAllTasks();
    return data;
  } catch (err) {
    // setError(err.message);
  }
};

export default function dashboard() {
  const tasks = fetchTasks()

  return (
    <>
      <div className=" h-full w-full flex-1 flex-col space-y-8 md:flex px-12 py-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
          <div className="flex items-center space-x-2">
          </div>
        </div>
        <DataTable data={tasks} columns={columns} />
      </div>
    </>
  )
}