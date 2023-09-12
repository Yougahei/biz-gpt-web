"use client"

import React, { ReactHTMLElement, useState } from "react"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { EventStreamContentType, fetchEventSource } from "@microsoft/fetch-event-source"
import formatSplitText from "@/utils/generateQA"
import {QaList} from "@/types/dataType";

export default function KnowledgeDetail() {
  const kbid = useSearchParams().get("id")
  let response: string = ""
  const [originFileObj, setOriginFileObj] = useState<any>(null)
  const [files, setFiles] = React.useState<File>()
  const [fileContent, setFileContent] = React.useState<string>("")
  const [message, setMessage] = React.useState<QaList>([])
  const [prompt , setPrompt ] = React.useState<string>("")

  const getTextContent = async (e: any) => {
    let fr = new FileReader()
    fr.readAsText(e.target.files[0])
    fr.onload = (event) => {
      // 打印文件内容
      // setFileContent(event.target?.result as string)
      setPrompt(event.target?.result as string)
    }
  }


  const handelChat = async (e: any) => {

    await fetchEventSource(
      `http://192.168.0.7:5000/api/v1/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conv_uid: "72887baa-4e28-11ee-904a-34c93d018ec5",
          chat_mode: "chat_normal",
          user_input: `我会给你发送一段长文本，${
            prompt ? `是${prompt}，` : ''
          }请学习它，并用 markdown 格式给出 25 个问题和答案，问题可以多样化、自由扩展；答案要详细、解读到位，答案包含普通文本、链接、代码、表格、公示、媒体链接等。按下面 QA 问答格式返回:
  \nQ1:
  \nA1:
  \nQ2:
  \nA2:
  ……`,
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
          const result = formatSplitText(response || '');
          const responseList = result.map((item) => item).flat();
          console.log("QA拆分结束")
          console.log("扁平化拆分结果", responseList)
          setMessage(responseList)
        },
        onerror(err) {
          console.log("QA拆分错误")
          throw new Error(err)
        },
        async onmessage(event) {
          event.data = event.data?.replaceAll("\\n", "\n")
          if (event.data === "[DONE]") {
            // console.log("DONE",event.data);
          } else if (event.data?.startsWith("[ERROR]")) {
          } else {
            response = event.data
          }
        },
      }
    )
  }



  return (
    <div className="p-4">
      <Card className=" flex flex-auto left-auto">{kbid}</Card>
      <div>
        <Card>
          <RadioGroup defaultValue="QA">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="manual" id="r1" />
              <Label htmlFor="r1">手动输入</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="qa" id="r2" />
              <Label htmlFor="r2">QA拆分</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="split" id="r3" />
              <Label htmlFor="r3">直接分段</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="csv" id="r3" />
              <Label htmlFor="r3">CSV导入</Label>
            </div>
          </RadioGroup>
          <Card>
            <form>
              <input
                type="file"
                onChange={async (e: any) => {
                  getTextContent(e)
                }}
              />
            </form>
          </Card>
          <Button onClick={handelChat}>发送</Button>
        </Card>
      </div>
    </div>
  )
}
