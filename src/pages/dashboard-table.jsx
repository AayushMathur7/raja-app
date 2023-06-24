import Head from 'next/head'

import { CallToAction } from '@/components/CallToAction'
import { Faqs } from '@/components/Faqs'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Pricing } from '@/components/Pricing'
import { PrimaryFeatures } from '@/components/PrimaryFeatures'
import { SecondaryFeatures } from '@/components/SecondaryFeatures'
import { Testimonials } from '@/components/Testimonials'

const StatusType = {
    READY_TO_DEPLOY: "ready_to_deploy", //button will show deploy
    IMPLEMENTING_CODE: "implementing_code", //Deployed, AI is generating code, loading button, spinner shown
    CREATING_PR: "creating_pr", //Code created, AI is creating pull request, loading button, spinner shown
    PR_READY_FOR_REVIEW: "pr_ready_for_review", //button will show link to the PR
    COMPLETED: "completed", //When PR is reviewed and merged in
}

const tasks = [
  {
    task_name: 'Bug Fix: Backtesting algorithm not running',
    task_link: 'https://trello.com/c/9NcTufrV/6-error-generating-backtest',
    task_status: StatusType.READY_TO_DEPLOY
  },
    {
    task_name: 'Bug Fix: This modal is not displaying',
    task_link: 'https://trello.com/c/9NcTufrV/7-testing-bug',
    task_status: StatusType.PR_READY_FOR_REVIEW
  },
  {
    task_name: 'Feature: Phone call view box',
    task_link: 'https://trello.com/c/9NcTufrV/8-phone-all-view-box',
    task_status: StatusType.IMPLEMENTING_CODE
  },
]

function getStatusText(status) {
    if (status === StatusType.READY_TO_DEPLOY) {
        return "Ready to Deploy";
    } else if (status === StatusType.IMPLEMENTING_CODE) {
        return "Implementing code";
    } else if (status === StatusType.CREATING_PR) {
        return "Creating PR";
    } else if (status === StatusType.PR_READY_FOR_REVIEW) {
        return "PR ready for review";
    } else if (status === StatusType.COMPLETED) {
        return "Completed";
    }
}

function getStatusClass(status) {
    if (status === StatusType.READY_TO_DEPLOY) {
        return "bg-blue-50 text-blue-700 ring-blue-600";
    } else if (status === StatusType.IMPLEMENTING_CODE) {
        return "bg-yellow-50 text-yellow-700 ring-yellow-600";
    } else if (status === StatusType.CREATING_PR) {
        return "bg-yellow-50 text-yellow-700 ring-yellow-600";
    } else if (status === StatusType.PR_READY_FOR_REVIEW) {
        return "bg-purple-50 text-purple-700 ring-purple-600";
    } else if (status === StatusType.COMPLETED) {
        return "bg-green-50 text-green-700 ring-green-600";
    }
}

function getLoader(status) {
    if (status === StatusType.IMPLEMENTING_CODE || status === StatusType.CREATING_PR ) {
        return <div
          className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
    }
}

function getStatusPill(status) {
    const statusClass = getStatusClass(status);

    return <span className={`inline-flex items-center rounded-md gap-2 px-2 py-1 text-xs font-medium ring-1 ring-inset ${statusClass}/20`}>
        {getStatusText(status)}
        {getLoader(status)}
    </span>
}

export default function Home() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 m-32 mx-60">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
{/*           <h1 className="text-base font-semibold leading-6 text-gray-900">Tasks</h1> */}
{/*           <p className="mt-2 text-sm text-gray-700"> */}
{/*             A list of all the users in your account including their name, title, email and role. */}
{/*           </p> */}
        </div>
{/*         <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none"> */}
{/*           <button */}
{/*             type="button" */}
{/*             className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" */}
{/*           > */}
{/*             Add user */}
{/*           </button> */}
{/*         </div> */}
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-4">
                    Task
                  </th>
{/*                   <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"> */}
{/*                     Title */}
{/*                   </th> */}
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Manage
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {tasks.map((task) => (
                  <tr key={task.task_link}>
                    <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-4">
                      <div className="flex items-center">
{/*                         <div className="h-11 w-11 flex-shrink-0"> */}
{/*                           <img className="h-11 w-11 rounded-full" src={task.image} alt="" /> */}
{/*                         </div> */}
                        <div>
                          <div className="font-medium text-gray-900">{task.task_name}</div>
                          <div className="mt-1 text-gray-500">{task.task_link}</div>
                        </div>
                      </div>
                    </td>
{/*                     <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500"> */}
{/*                       <div className="text-gray-900">{person.title}</div> */}
{/*                       <div className="mt-1 text-gray-500">{person.department}</div> */}
{/*                     </td> */}
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        {getStatusPill(task.task_status)}
                    </td>
{/*                     <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">{person.role}</td> */}
{/*                     <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"> */}
{/*                       <a href="#" className="text-indigo-600 hover:text-indigo-900"> */}
{/*                         Edit<span className="sr-only">, {person.name}</span> */}
{/*                       </a> */}
{/*                     </td> */}
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
