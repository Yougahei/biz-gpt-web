"use client"

import React from "react"

import { cn } from "@/lib/utils"

import ChatPanel from "./chat-panel"

export default function chat({ className }: React.ComponentProps<"div">) {
  return (
    <>
      <div className={cn("pb-[200px] pt-4 md:pt-10", className)}>
        <ChatPanel />
      </div>
    </>
  )
}
