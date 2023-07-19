import TaskTemplate from '@/components/dashboard/TaskTemplate'
import TaskTable from '@/components/dashboard/TaskTable'
import { createUser, initializeRepo, getTickets, getRepos } from '@/api/dashboard';
import { useState, useContext, useRef, useEffect } from "react";
import { ClerkProvider, UserButton, SignedIn, SignedOut, SignIn } from '@clerk/nextjs'
import { useUser } from "@clerk/clerk-react";
import { TaskContext } from '@/contexts/TaskContext'
import { Logo } from '@/components/Logo'
import Select from 'react-select'

export default function Dashboard() {
  const [repoLink, setRepoLink] = useState("");
  const { isLoaded, user } = useUser();
  const { tasks, addTask, initializeTasks, updateTask } = useContext(TaskContext);
  const [repoIsInitializing, setRepoIsInitializing] = useState(false)

  const initialized = useRef(false)
  useEffect(() => {
        if (initialized.current == true) {
            initialized.current = false
            getTickets(user?.primaryEmailAddressId).then(r => initializeTasks(r)).catch(err => console.error(err));
        }
  }, []);

  const [repos, setRepos] = useState([]);

  //This loads the users repos whenever the page first loads and also when a new repo has been added by said user
  useEffect (() => {
    if(isLoaded == true) {
      getRepos(user.primaryEmailAddressId).then((value) => {
        setRepos(value);
        console.log(value);
      })
    }
  }, [isLoaded, repoIsInitializing])

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Submitting repo link:", repoLink)
    setRepoIsInitializing(true)
    //Add param to send based off if repo is new or is an old one being loaded
    initializeRepo(user.primaryEmailAddressId, user.primaryEmailAddress, repoLink, (repos.indexOf(repoLink) > -1)).then(r => setRepoIsInitializing(false)).catch(err => console.error(err));
  }

  return <>
    <SignedIn>
    <div className="absolute left-0 p-8">
            <Logo className="h-10 w-auto" />
        </div>
        <div className="absolute right-0 p-8">
            <UserButton />
        </div>
        <div className="m-32 mt-32 -mb-20">
          <label htmlFor="github_repo_link" className="block text-sm font-medium leading-6 text-gray-900">
            Github Repo Link <span className="text-gray-500">(Repository must be public)</span>
          </label>
          <div className="mt-2 flex flex-row gap-4">
            
            {/* This is the dropdown select component (Currently has a box around the cursor, need to fix) */}
            <Select
            placeholder="Enter repo link here"
            className="block w-[478px] rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            options= {repos.map(element => ({'value':element,'label':element}))}
            onChange={e => setRepoLink(e.value)}
            onInputChange={e => setRepoLink(e.value)}
            >
            </Select>

            { repoIsInitializing ?
                  <button
                  type="button"
                  className="bg-white px-2 py-1 text-sm font-medium text-indigo-600"
                  >
                    <div
                      className="ml-7 flex justify-center items-center text-indigo-700 ring-indigo-600 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                      role="status">
                      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"></span>
                    </div>
                  </button>
             :
                 <button
                  type="button"
                  className="rounded-md bg-indigo-50 px-2 py-1 text-sm font-medium text-indigo-600 shadow-sm hover:bg-indigo-100"
                  onClick={handleSubmit}
                  //Load if repo has been initialised before
                  >
                    {(repos?.indexOf(repoLink) > -1) ? "Load repo" : "Initialize repo"}
                  </button>
            }


            {/* <input
              type="text"
              name="github_repo_link"
              id="github_repo_link"
              className="block w-[478px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter repo link here"
              value={repoLink}
              onChange={e => setRepoLink(e.target.value)}
            />

            {/* button currently not working }
            <button id="dropdown-button" data-dropdown-toggle="dropdown" class="flex-shrink-0 z-10 inline-flex items-center px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-r-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600" type="button">
              All repos 
              <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
              </svg>
            </button>

            <div id="dropdown" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
              <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
              <li>
                  <button type="button" class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Test</button>
              </li>
              </ul>
            </div>

             { repoIsInitializing ?
                  <button
                  type="button"
                  className="bg-white px-2 py-1 text-sm font-medium text-indigo-600"
                  >
                    <div
                      className="ml-7 flex justify-center items-center text-indigo-700 ring-indigo-600 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                      role="status">
                      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"></span>
                    </div>
                  </button>

             :
                 <button
                  type="button"
                  className="rounded-md bg-indigo-50 px-2 py-1 text-sm font-medium text-indigo-600 shadow-sm hover:bg-indigo-100"
                  onClick={handleSubmit}
                  //Load if repo has been initialised before
                  >
                    {(repos?.indexOf(repoLink) > -1) ? "Load repo" : "Initialize repo"}
                  </button>
            } */}
          </div> 
          <label htmlFor="repository" className="block text-sm font-medium leading-6 text-gray-900">
            Repository used for demo:
           <span>{" "}</span>
            <a href="https://github.com/AayushMathur7/raja-app" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                https://github.com/AayushMathur7/raja-app
            </a>
        </label>
        </div>

        <div className="mx-32 my-16 flex flex-row space-x-4">
          <TaskTemplate />
          <TaskTable />
        </div>
    </SignedIn>
    <SignedOut>
        <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-indigo-600">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
          <p className="mt-6 text-base leading-7 text-gray-600">Sorry, we couldn’t find the page you’re looking for.</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
          </div>
        </div>
      </main>
    </SignedOut>
  </>

}
