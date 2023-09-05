import React, { useState } from "react"
import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
// 流处理包
import {
  EventStreamContentType,
  fetchEventSource,
} from "@microsoft/fetch-event-source"
import { useForm } from "react-hook-form"
import Textarea from "react-textarea-autosize"
import * as z from "zod"

import { cn } from "@/lib/utils"

import { Button, buttonVariants } from "./ui/button"
import { IconArrowElbow, IconPlus } from "./ui/icons"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"




export default function PromptFrom() {
  const Schema = z.object({ query: z.string().min(1) })
  let convUID = ""
  let mode = ""
  const methods = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
    defaultValues: {},
  })



  const handelChat = async ({ query }: z.infer<typeof Schema>) => {
    await fetchEventSource(
      `http://192.168.31.37:5000/api/v1/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conv_uid: convUID,
          chat_mode: mode || "chat_normal",
          user_input: query,
        }),
        async onopen(response) {
          if (
            response.ok &&
            response.headers.get("content-type") === EventStreamContentType
          ) {
            return // everything's good
          } else if (
            response.status >= 400 &&
            response.status < 500 &&
            response.status !== 429
          ) {
            if (response.status === 402) {
              //throw new ApiError(ApiErrorType.USAGE_LIMIT);
            }
            // client-side errors are usually non-retriable:
            //throw new FatalError();
          } else {
            //throw new RetriableError();
          }
        },
        onclose() {
          // if the server closes the connection unexpectedly, retry:
          console.log("onclose")
        },
        onerror(err) {
          console.log("onerror")
          throw new Error(err)
        },
        async onmessage(event) {
          event.data = event.data?.replaceAll("\\n", "\n")
          if (event.data === "[DONE]") {
            // console.log("DONE",event.data);
          } else if (event.data?.startsWith("[ERROR]")) {
          } else {
            setMessage(event.data)
            // console.log("event.data",event.data);
          }
        },
      }
    )
  }
  const [message, setMessage] = useState<string>("")

  return (
    <form
      onSubmit={(e) => {
        methods.handleSubmit(handelChat)(e)
      }}
    >
      {message}
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
          {...methods.register("query")}
        />
        <div className="absolute right-0 top-4 sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" type="submit">
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
