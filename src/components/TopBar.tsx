import React from "react";
import { UserButton } from '@clerk/nextjs'


export default function TopBar() {

  return (
    <div className="flex justify-center align-center h-full w-full">
				<UserButton />
    </div>
  );
}
