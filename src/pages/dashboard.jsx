import Head from 'next/head'
// import { TicketTemplate } from '@/components/dashboard/TicketTemplate'

export default function Dashboard() {
  return (
//     <div className="flex items-center justify-center min-h-screen">
//       <div className="flex items-start gap-x-12">
//         <TicketTemplate />
//         <div className="border-r border-gray-500 h-full"></div>
//         <TicketTemplate />
//       </div>
//     </div>
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
        />
      </div>
    </div>
  )
}
