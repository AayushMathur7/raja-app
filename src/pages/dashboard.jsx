import Head from 'next/head'
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

  return (
    <div className="m-32">
      <label htmlFor="github_repo_link" className="block text-sm font-medium leading-6 text-gray-900">
        Github Repo Link
      </label>
      <div className="mt-2">
        <input
          type="text"
          name="github_repo_link"
          id="github_repo_link"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Enter repo link here"
          value={repoLink}
          onChange={e => setRepoLink(e.target.value)}
        />
        <button onClick={handleSubmit} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          Initialize Repo
        </button>
      </div>
    </div>
  )
}
