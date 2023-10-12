"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"
import React from 'react';

import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

import { labels } from "../../data/data"
import { taskSchema } from "../../data/schema"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  onDelete: (row: Row<TData>) => void
}

export function DataTableRowActions<TData>({
  row,
  onDelete,
}: DataTableRowActionsProps<TData>) {
  const task = taskSchema.parse(row.original)

  // const handleDelete = () => {
  //   if (onDelete) {
  //     onDelete(task.id);
  //   }
  // };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-[32px] w-8 p-0 data-[state=open]:bg-muted"
        >
          <div className="flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.33333 9.99992C6.33333 10.9204 5.58714 11.6666 4.66667 11.6666C3.74619 11.6666 3 10.9204 3 9.99992C3 9.07944 3.74619 8.33325 4.66667 8.33325C5.58714 8.33325 6.33333 9.07944 6.33333 9.99992ZM11.6667 9.99992C11.6667 10.9204 10.9205 11.6666 10 11.6666C9.07953 11.6666 8.33333 10.9204 8.33333 9.99992C8.33333 9.07944 9.07953 8.33325 10 8.33325C10.9205 8.33325 11.6667 9.07944 11.6667 9.99992ZM15.3333 11.6666C16.2538 11.6666 17 10.9204 17 9.99992C17 9.07944 16.2538 8.33325 15.3333 8.33325C14.4129 8.33325 13.6667 9.07944 13.6667 9.99992C13.6667 10.9204 14.4129 11.6666 15.3333 11.6666Z" fill="#62646C"/>
            </svg>
          </div>
          
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete()}>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}