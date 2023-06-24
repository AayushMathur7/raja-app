import Head from 'next/head'
import TaskTemplate from '@/components/dashboard/TaskTemplate'
import TaskTable from '@/components/dashboard/TaskTable'

export default function Dashboard() {
  return <>
    <div className="mx-32 mt-16 -mb-12">
      <label htmlFor="github_repo_link" className="block text-sm font-medium leading-6 text-gray-900">
        Github Repo Link
      </label>
      <div className="mt-2">
        <input
          type="text"
          name="github_repo_link"
          id="github_repo_link"
          className="block w-[550px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Enter repo link here"
        />
      </div>
    </div>

    <div className="mx-32 my-16 flex flex-row space-x-4">
      <TaskTemplate />
      <TaskTable />
    </div>
  </>
}
