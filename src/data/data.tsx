import {
    ArrowDownIcon,
    ArrowRightIcon,
    ArrowUpIcon,
    CheckCircledIcon,
    CircleIcon,
    CrossCircledIcon,
    QuestionMarkCircledIcon,
    StopwatchIcon,
  } from "@radix-ui/react-icons"
  
  export const labels = [
    {
      value: "bug",
      label: "Bug",
    },
    {
      value: "feature",
      label: "Feature",
    },
  ]
  
  export const statuses = [
    {
      value: "todo",
      label: "Todo",
      class: "bg-blue-50 text-blue-700 ring-blue-600",
    },
    {
      value: "in_progress",
      label: "In Progress",
      class: "bg-yellow-50 text-yellow-700 ring-yellow-600",
    },
    {
      value: "done",
      label: "Done",
      class: "bg-green-50 text-green-700 ring-green-600",
    },
    {
      value: "failed",
      label: "Failed",
      class: "bg-red-50 text-red-700 ring-red-600",
    },
  ]
  
  export const priorities = [
    {
      label: "Low",
      value: "low",
      icon: ArrowDownIcon,
    },
    {
      label: "Medium",
      value: "medium",
      icon: ArrowRightIcon,
    },
    {
      label: "High",
      value: "high",
      icon: ArrowUpIcon,
    },
  ]