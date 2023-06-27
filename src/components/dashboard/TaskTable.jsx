import Head from 'next/head'
import React, { useContext, useState } from 'react';
import { TaskContext } from '@/contexts/TaskContext'
import { StatusType } from '@/enums/StatusType'
import { rajaAgent, getTickets, checkRajaTaskStatus } from '@/api/dashboard';
import { ConvexProvider, ConvexReactClient } from "convex/react";

export default function TaskTable() {

  const { tasks, addTask, updateTasks } = useContext(TaskContext);
  const [pullRequestLink, setPullRequestLink] = useState(null)

    function getStatusText(status) {
        if (status === StatusType.READY_TO_DEPLOY) {
            return "Ready to deploy";
        } else if (status === StatusType.IN_PROGRESS) {
            return "In progress";
        } else if (status === StatusType.PR_READY_FOR_REVIEW) {
            return "PR ready for review";
        } else if (status === StatusType.TASK_FAILED) {
            return "Task failed";
        }
    }

    function getStatusClass(status) {
        if (status === StatusType.READY_TO_DEPLOY) {
            return "bg-blue-50 text-blue-700 ring-blue-600";
        } else if (status === StatusType.IN_PROGRESS) {
            return "bg-yellow-50 text-yellow-700 ring-yellow-600";
        } else if (status === StatusType.PR_READY_FOR_REVIEW) {
            return "bg-green-50 text-green-700 ring-green-600";
        } else if (status === StatusType.TASK_FAILED) {
            return "bg-red-50 text-red-700 ring-red-600";
        }
    }

    function getLoader(status) {
        if (status === StatusType.IN_PROGRESS) {
            return <div
              className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"></span>
            </div>
        }
    }

    function getStatusPill(status) {
        const statusClass = getStatusClass(status);

        return <span className={`inline-flex items-center rounded-md gap-2 px-2 py-1 text-xs font-medium ring-1 ring-inset ${statusClass}`}>
            {getStatusText(status)}
        </span>
    }

    function getButton(status, pr_link, task) {
      switch (status) {
        case StatusType.READY_TO_DEPLOY:
            return <button
                        type="button"
                        className="rounded-md bg-white px-4 py-2 text-[14px] font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={(event) => handleDeploy(event, task)}
                    >
                        Deploy
                    </button>

        case StatusType.IN_PROGRESS:
            return <div
              className="ml-7 flex justify-center items-center text-yellow-700 ring-yellow-600 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"></span>
            </div>
        case StatusType.PR_READY_FOR_REVIEW:
            return <button
                type="button"
                className="rounded-md bg-white px-4 py-2 text-[14px] font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={() => window.open(pr_link, '_blank')}
            >
                View PR
            </button>
      }
    }

    const handleDeploy = (event, taskToUpdate) => {
      event.preventDefault();

      console.log("Deploying Raja for this task:", taskToUpdate?.name);

      rajaAgent(taskToUpdate)
        .then(taskId => {
          let updatedTasks = tasks.map(task =>
            task.name === taskToUpdate.name
              ? { ...task, status: StatusType.IN_PROGRESS }
              : task
          );
          updateTasks(updatedTasks);

          const intervalId = setInterval(() => {
            checkRajaTaskStatus(taskId)
              .then(data => {
                if (data.status === 'SUCCESS') {
                  clearInterval(intervalId); // stop polling when the task is done
                  updatedTasks = updatedTasks.map(task =>
                    task.name === taskToUpdate.name
                      ? { ...task, status: StatusType.PR_READY_FOR_REVIEW, pr_link: data.result }
                      : task
                  );
                  updateTasks(updatedTasks);
                } else if (data.status === 'FAILURE') {
                  clearInterval(intervalId); // stop polling when the task fails
                  updatedTasks = updatedTasks.map(task =>
                    task.name === taskToUpdate.name
                      ? { ...task, status: StatusType.TASK_FAILED }
                      : task
                  );
                  updateTasks(updatedTasks);
                }
              })
              .catch(err => {
                console.error(err);
                clearInterval(intervalId);
              });
          }, 10000);
        })
        .catch(err => console.error(err));
    };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-4 min-w-[380px] overflow-hidden overflow-ellipsis whitespace-nowrap">
                      Task
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 min-w-[160px] overflow-hidden overflow-ellipsis whitespace-nowrap">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 min-w-[100px] overflow-hidden overflow-ellipsis whitespace-nowrap">

                    </th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                  {tasks?.map((task) => (
                    <tr key={task["name"]}>
                      <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-4">
                        <div className="flex items-center flex-wrap">
                          <div className="overflow-hidden overflow-ellipsis whitespace-normal max-w-[360px]">
                            <div className="font-medium text-gray-900">{task["name"]}</div>
                             <div className="mt-1 text-sm text-gray-500">{task["pr_link"]}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        {getStatusPill(task["status"])}
                      </td>

                      <td className="whitespace-nowrap px-2 py-4 text-xs text-gray-500">
                        {getButton(task["status"], task["pr_link"], task)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}