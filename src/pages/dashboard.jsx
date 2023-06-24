import TaskTemplate from '@/components/dashboard/TaskTemplate'
import TaskTable from '@/components/dashboard/TaskTable'
// import { TicketTemplate } from '@/components/dashboard/TicketTemplate'
import { initializeRepo } from '@/api/dashboard';
import {useState} from "react";


export default function Dashboard() {
  const [repoLink, setRepoLink] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Submitting repo link:", repoLink)
    initializeRepo(repoLink).then(r => console.log(r)).catch(err => console.error(err));
  }

  return <>
    <div className="m-32 mt-16 -mb-12">
      <label htmlFor="github_repo_link" className="block text-sm font-medium leading-6 text-gray-900">
        Github Repo Link
      </label>
      <div className="mt-2 flex flex-row gap-4">
        <input
          type="text"
          name="github_repo_link"
          id="github_repo_link"
          className="block w-[478px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Enter repo link here"
          value={repoLink}
          onChange={e => setRepoLink(e.target.value)}
        />
         <button
          type="button"
          className="rounded-md bg-indigo-50 px-2 py-1 text-sm font-medium text-indigo-600 shadow-sm hover:bg-indigo-100"
          onClick={handleSubmit}
        >
          Initialize repo
      </button>
      </div>
    </div>

    <div className="mx-32 my-16 flex flex-row space-x-4">
      <TaskTemplate />
      <TaskTable />
    </div>
  </>
}
