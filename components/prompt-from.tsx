import React from "react"
import Textarea from "react-textarea-autosize"

import { cn } from "@/lib/utils"

import { Button, buttonVariants } from "./ui/button"
import { IconArrowElbow, IconPlus } from "./ui/icons"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

import { useSearchParams } from 'next/navigation';

export default function PromptFrom() {

  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const scene = searchParams.get('scene');






  return (
    <form>
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={cn(
                buttonVariants({ size: "sm", variant: "outline" }),
                "absolute left-0 top-4 h-8 w-8 rounded-full bg-background p-0 sm:left-4"
              )}
            >
              <IconPlus />
              <span className="sr-only">New Chat</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
        <Textarea
          tabIndex={0}
          rows={1}
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
        />
        <div className="absolute right-0 top-4 sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon">
                <IconArrowElbow />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  )
}
