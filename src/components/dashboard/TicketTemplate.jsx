import React from 'react';

export function TicketTemplate() {
  return <>
      <div>
          <div className="flex justify-between">
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email
            </label>
            <span className="text-sm leading-6 text-gray-500" id="email-optional">
              Required
            </span>
          </div>
          <div className="mt-2">
            <input
              type="email"
              name="email"
              id="email"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="you@example.com"
              aria-describedby="email-optional"
            />
          </div>
      </div>

    <div>
      <div className="flex justify-between">
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
          Email
        </label>
        <span className="text-sm leading-6 text-gray-500" id="email-optional">
          Optional
        </span>
      </div>
      <div className="mt-2">
        <input
          type="email"
          name="email"
          id="email"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="you@example.com"
          aria-describedby="email-optional"
        />
      </div>
    </div>
    </>
}

export default TicketTemplate;
