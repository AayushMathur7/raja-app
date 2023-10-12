import React from "react";
import { useRouter } from "next/router";

export default function Menu() {
  const router = useRouter();

  function getLogo() {
    return (
      <div className="flex justify-center items-center h-20 font-[700] text-black text-2xl">
        
      </div>
    );
  }

  
  function getMenuItem(title: string, route: string) {
    const isActive = router.pathname === route;
    const bgColor = isActive ? 'bg-gray-100' : 'bg-[#FAFAFA]';

    return (
      <div
        className={`flex items-center h-10 px-4 m-1 mx-4 font-[500] cursor-pointer text-gray-800 ${bgColor} hover:bg-gray-100 rounded-sm transition-colors justify-left`}
        onClick={() => router.push(route)}
      >
        <span className="text-[14px] capitalize">{title}</span>
      </div>
    );
  }

  function getContent() {
    return (
      <div className="flex flex-col space-y-1">
        {getMenuItem("dashboard", "/")}
        {getMenuItem("settings", "/settings")}
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#FAFAFA] w-64 h-screen">
      {getLogo()}
      {getContent()}
    </div>
  );
}
