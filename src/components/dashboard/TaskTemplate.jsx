import React, { useContext, useState } from 'react';
import { TaskContext } from '@/contexts/TaskContext'
import { StatusType } from '@/enums/StatusType'
import {rajaAgent} from "@/api/dashboard";

export default function TaskTemplate() {

  const { tasks, addTask, updateTask } = useContext(TaskContext);

  const [name, setName] = useState(null)
  const [type, setType] = useState("Bug")
  const [description, setDescription] = useState(null)
  const [acceptanceCriteria, setAcceptanceCriteria] = useState(null)
  const [howToReproduce, setHowToReproduce] = useState(null)
  const [emptyInputError, setEmptyInputError] = useState(false)

  const handleCreateTask = () => {
        console.log(name, type, description, acceptanceCriteria)
        if (name == null || type == null || description == null || acceptanceCriteria == null ) {
            setEmptyInputError(true)
            return
        }
       addTask({
         name: name,
         type: type,
         description: description,
         acceptance_criteria: acceptanceCriteria,
         how_to_reproduce: howToReproduce,
         status: StatusType.READY_TO_DEPLOY

       });
       setEmptyInputError(false)
      rajaAgent(task).then(r => setPullRequestLink(r.message)).catch(err => console.error(err));
  };

  return (
    <div className="py-12">
        <div>
        <div className="flex justify-between">
          <label htmlFor="type" className="block text-sm font-medium leading-6 text-gray-900">
            Task name
          </label>
          <span className="text-sm leading-6 text-gray-500" id="email-optional">
            Required
          </span>
        </div>
          <div className="mt-1 mb-6">
            <input
              type="email"
              name="name"
              id="name"
              className="block w-[600px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Type your task name"
              aria-describedby="email-optional"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div>
        <div className="flex justify-between">
          <label htmlFor="type" className="block text-sm font-medium leading-6 text-gray-900">
            Task type
          </label>
          <span className="text-sm leading-6 text-gray-500" id="email-optional">
            Required
          </span>
        </div>
          <select
            id="type"
            name="type"
            className="mt-2 mb-6 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            defaultValue="Bug"
            onChange={(e) => setType(e.target.value)}
          >
            <option>Bug</option>
            <option>Feature</option>
          </select>
        </div>

      <div>
          <div className="flex justify-between">
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Description
            </label>
            <span className="text-sm leading-6 text-gray-500" id="email-optional">
              Required
            </span>
          </div>
          <div className="mt-1 mb-6">
            <textarea
              type="email"
              name="description"
              id="description"
              className="block w-[600px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Describe your bug or feature"
              aria-describedby="email-optional"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
    </div>

    <div>
      <div className="flex justify-between">
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
          Acceptance Criteria
        </label>
        <span className="text-sm leading-6 text-gray-500" id="email-optional">
          Required
        </span>
      </div>
        <div className="mt-1 mb-6">
        <textarea
          type="email"
          name="acceptance_criteria"
          id="acceptance_criteria"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Type the ideal bug fix or feature implementation"
          aria-describedby="email-optional"
          onChange={(e) => setAcceptanceCriteria(e.target.value)}
        />
      </div>
    </div>

        <div>
      <div className="flex justify-between">
        <label htmlFor="how_to_reproduce" className="block text-sm font-medium leading-6 text-gray-900">
          How to reproduce
        </label>
      </div>
        <div className="mt-1 mb-6">
        <textarea
          type="email"
          name="how_to_reproduce"
          id="how_to_reproduce"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Type the reproduction steps"
          aria-describedby="email-optional"
          onChange={(e) => setHowToReproduce(e.target.value)}
        />
      </div>
    </div>

          <button
        type="button"
        className="rounded-full bg-white px-3.5 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        onClick={handleCreateTask}
      >
        Create task
      </button>
      {emptyInputError && <p className="text-red-500 text-sm mt-4">Fill out all the required fields.</p>}
    </div>
  );
}
