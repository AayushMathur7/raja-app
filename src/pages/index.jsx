import { z } from "zod"

import { columns } from "../components/tasks/columns"
import { DataTable } from "../components/tasks/data-table"
import { taskSchema } from "../data/schema"
import { getAllTasks } from "../api/API"; 
import { useState, useEffect, useRef, useContext } from "react";
import { TaskContext } from "../contexts/TaskContext";

export const metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
}

async function fetchTasks() {
  try {
    const data = await getAllTasks();
    return data;
  } catch (err) {
    console.error(err);
  }
};


export default function Dashboard() {
  const taskContext = useContext(TaskContext);

  const initialized = useRef(false);
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    fetchTasks().then((data) => {taskContext.setTasks(data)})
    .catch((err) => {
      console.error(err);
    });
  },[]
  );
  

  return (
    <>
      <div className=" h-full w-full flex-1 flex-col space-y-8 md:flex px-12 py-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks.
            </p>
          </div>
          <div className="flex items-center space-x-2">
          </div>
        </div>
        <DataTable data={taskContext.tasks} columns={columns} />
      </div>
    </>
  )
}