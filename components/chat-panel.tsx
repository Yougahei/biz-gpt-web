import React from "react"

import { ButtonScrollToBottom } from "./button-scroll-to-bottom"
import { Button } from "./ui/button"
import PromptFrom from "./prompt-from"
import { FooterText } from "./footer"

export default function ChatPanel() {
  return (
    <div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="flex h-10 items-center justify-center">
          <Button>加载中显示的按钮</Button>
        </div>
        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptFrom/>
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  )
}
