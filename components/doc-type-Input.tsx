import React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { Button } from "./ui/button"
import { Switch } from "./ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { sendSpacePostRequest } from "@/utils/request"



export default function DocTypeInput({
  documentType,
  setActiveStep,
  setSynchChecked,
  synchChecked,
  text,
  setText,
  knowledgeSpaceName,
  webPageUrl,
  setWebPageUrl,
}: {
  documentType: string
  synchChecked: boolean
  text: string
  setText: (text: string) => void
  setActiveStep: () => void
  setSynchChecked: (state: boolean) => void
  knowledgeSpaceName: string
  webPageUrl: string
  setWebPageUrl: (url: string) => void
}) {

  const { toast } = useToast()
  const [documentName, setDocumentName] = React.useState("")
  const [textSource, setTextSource] = React.useState("")
  if (documentType === "text") {
    return (
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="doc_name" className="text-right">
            文本名称
          </Label>
          <Input
            id="doc_name"
            placeholder="填写文本名称"
            className="col-span-3"
            onChange={(e) => {
              setDocumentName(e.target.value)
            }}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="source" className="text-right">
            文件来源（可选）
          </Label>
          <Input
            id="source"
            onChange={(e) => {
              setTextSource(e.target.value)
            }}
            placeholder="文件来源（可选）"
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="content" className="text-right">
            内容
          </Label>
          <Textarea
            id="content"
            placeholder="内容"
            className="col-span-3"
            onChange={(e) => {
              setText(e.target.value)
            }}
          />
            <div className="flex-col">
              <div className="grid grid-cols-4 items-right gap-4 mb-3">
                <Label htmlFor="sync" className="text-right">
                  同步
                </Label>
                <Switch
                  checked={synchChecked}
                  onChange={() => setSynchChecked}
                />
              </div>

              <Button variant="outline" onClick={() => setActiveStep()}>
                {"< Back"}
              </Button>
              <Button onClick={async () => {
                 if (text === '') {
                  toast({
                    variant: "destructive",
                    title: "错误",
                    description: "文档内容不能为空",
                  })
                  return;
                }
                const data: any = await sendSpacePostRequest(`/backend/knowledge/${knowledgeSpaceName}/document/add`, {
                  doc_name: documentName,
                  source: textSource,
                  content: text,
                  doc_type: 'TEXT',
                });
                if (data.success) {
                  toast({
                    variant: "default",
                    title: "成功",
                    description: "文档创建成功",
                  })
                  synchChecked &&
                    sendSpacePostRequest(`/backend/knowledge/${knowledgeSpaceName}/document/sync`, {
                      doc_ids: [data.data],
                    });
                } else {
                  toast({
                    variant: "destructive",
                    title: "错误",
                    description: data.err_msg || "未知错误",
                  })
                }
              }}>完成</Button>
            </div>
        </div>
      </div>
    )
  } else if (documentType === "webPage") {
    return (
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="doc_name" className="text-right">
            网址名称
          </Label>
          <Input
            id="doc_name"
            onChange={(e) => {setDocumentName(e.target.value)}}
            placeholder="填写网址名称"
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="content" className="text-right">
            url
          </Label>
          <Input
            id="content"
            onChange={(e) => {
              setWebPageUrl(e.target.value)
            }}
            placeholder="url"
            className="col-span-3"
          />
            <div className="flex-col">
              <div className="grid grid-cols-4 items-right gap-4 mb-3">
                <Label htmlFor="sync" className="text-right">
                  同步
                </Label>
                <Switch
                  checked={synchChecked}
                  onChange={() => setSynchChecked}
                />
              </div>

              <Button variant="outline" onClick={() => setActiveStep()}>
                {"< Back"}
              </Button>
              <Button onClick={async () => {
                 if (webPageUrl === '') {
                  toast({
                    variant: "destructive",
                    title: "错误",
                    description: "文档内容不能为空",
                  })
                  return;
                }
                const data: any = await sendSpacePostRequest(`/backend/knowledge/${knowledgeSpaceName}/document/add`, {
                  doc_name: documentName,
                  content: webPageUrl,
                  doc_type: 'URL',
                });
                if (data.success) {
                  toast({
                    variant: "default",
                    title: "成功",
                    description: "文档创建成功",
                  })
                  synchChecked &&
                    sendSpacePostRequest(`/backend/knowledge/${knowledgeSpaceName}/document/sync`, {
                      doc_ids: [data.data],
                    });
                } else {
                  toast({
                    variant: "destructive",
                    title: "错误",
                    description: data.err_msg || "未知错误",
                  })
                }
              }}>完成</Button>
            </div>
        </div>
      </div>
    )
  } else {
    return (
      <>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="doc_name" className="text-right">
              文件名称
            </Label>
            <Input
              id="doc_name"
              placeholder="填写文件名称"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="content" className="text-right">
              上传文件
            </Label>
            <Input
              id="content"
              placeholder="url"
              className="col-span-3"
            />
            <div className="flex-col">
              <div className="grid grid-cols-4 items-right gap-4 mb-3">
                <Label htmlFor="sync" className="text-right">
                  同步
                </Label>
                <Switch
                  checked={synchChecked}
                  onChange={() => setSynchChecked}
                />
              </div>

              <Button variant="outline" onClick={() => setActiveStep()}>
                {"< Back"}
              </Button>

            </div>
          </div>
        </div>
      </>
    )
  }
}
