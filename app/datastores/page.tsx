"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { sendSpacePostRequest } from "@/utils/request"
import { DialogClose } from "@radix-ui/react-dialog"
import { CheckCircledIcon, TrashIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet } from "@/components/ui/sheet"
import { useToast } from "@/components/ui/use-toast"
import DocTypeInput from "@/components/doc-type-Input"

type CardProps = React.ComponentProps<typeof Card>

export default function Index({ className, ...props }: CardProps) {
  const [activeStep, setActiveStep] = useState<number>(0)
  const [documentType, setDocumentType] = useState<string>("")
  const [synchChecked, setSynchChecked] = useState<boolean>(true)
  const [knowledgeSpaceList, setKnowledgeSpaceList] = useState<any>([])
  const [isDeleteKnowledgeSpaceModalShow, setIsDeleteKnowledgeSpaceModalShow] =
    useState<boolean>(false)

  const [text, setText] = useState<string>("")
  const [knowledgeSpaceName, setKnowledgeSpaceName] = useState<string>("")
  const [knowledgeSpaceOwner, setKnowledgeSpaceOwner] = useState<string>("")
  const [knowledgeSpaceDescription, setKnowledgeSpaceDescription] =
    useState<string>("")
  const router = useRouter()

  const [webPageUrl, setWebPageUrl] = useState<string>("")

  const { toast } = useToast()

  const stepsOfAddingSpace = [
    "Knowledge Space Config",
    "Choose a Datasource type",
    "Setup the Datasource",
  ]
  const documentTypeList = [
    {
      type: "text",
      title: "Text",
      subTitle: "Fill your raw text",
    },
    {
      type: "webPage",
      title: "URL",
      subTitle: "Fetch the content of a URL",
    },
    {
      type: "file",
      title: "Document",
      subTitle:
        "Upload a document, document type can be PDF, CSV, Text, PowerPoint, Word, Markdown",
    },
  ]

  useEffect(() => {
    async function fetchData() {
      const data: any = await sendSpacePostRequest(
        "/backend/knowledge/space/list",
        {}
      )
      if (data.success) {
        setKnowledgeSpaceList(data.data)
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      <div className="justify-between space-y-0 p-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">创建知识库</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              {stepsOfAddingSpace.map((item: any, index: number) => (
                <DialogTitle key={item}>
                  {index < activeStep ? <CheckCircledIcon /> : `${index + 1}.`}
                  {`${item}`}
                </DialogTitle>
              ))}
            </DialogHeader>
            {activeStep === 0 ? (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    知识库名称
                  </Label>
                  <Input
                    id="name"
                    placeholder="填写知识库名称"
                    className="col-span-3"
                    onChange={(e) => setKnowledgeSpaceName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="owner" className="text-right">
                    归属人
                  </Label>
                  <Input
                    id="owner"
                    placeholder="归属人"
                    className="col-span-3"
                    onChange={(e) => setKnowledgeSpaceOwner(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    描述
                  </Label>
                  <Input
                    id="description"
                    placeholder="描述"
                    className="col-span-3"
                    onChange={(e) =>
                      setKnowledgeSpaceDescription(e.target.value)
                    }
                  />
                </div>
                <DialogFooter>
                  <Button
                    onClick={async () => {
                      if (knowledgeSpaceName === "") {
                        toast({
                          variant: "destructive",
                          title: "错误",
                          description: "请输入知识库名称",
                        })
                        return
                      }
                      if (
                        /[^\u4e00-\u9fa50-9a-zA-Z_-]/.test(knowledgeSpaceName)
                      ) {
                        toast({
                          variant: "destructive",
                          title: "错误",
                          description:
                            '知识库名称只能包含数字、字母、中文、"-"和"_"',
                        })
                        return
                      }
                      if (knowledgeSpaceOwner === "") {
                        toast({
                          variant: "destructive",
                          title: "错误",
                          description: "请输入归属人",
                        })
                        return
                      }
                      if (knowledgeSpaceDescription === "") {
                        toast({
                          variant: "destructive",
                          title: "错误",
                          description: "请输入描述",
                        })
                        return
                      }
                      const data: any = await sendSpacePostRequest(
                        `/backend/knowledge/space/add`,
                        {
                          name: knowledgeSpaceName,
                          vector_type: "Chroma",
                          owner: knowledgeSpaceOwner,
                          desc: knowledgeSpaceDescription,
                        }
                      )
                      if (data.success) {
                        toast({
                          variant: "default",
                          title: "成功",
                          description: "创建成功",
                        })
                        setActiveStep(1)
                        const data: any = await sendSpacePostRequest(
                          "/backend/knowledge/space/list",
                          {}
                        )
                        if (data.success) {
                          setKnowledgeSpaceList(data.data)
                        }
                      } else {
                        toast({
                          variant: "destructive",
                          title: "失败",
                          description: data.err_msg || "创建失败",
                        })
                      }
                    }}
                  >
                    下一步
                  </Button>
                </DialogFooter>
              </div>
            ) : activeStep === 1 ? (
              <>
                <Card>
                  {documentTypeList.map((item: any) => (
                    <Sheet>
                      {item.title}
                      <div className="flex flex-col"></div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setDocumentType(item.type)
                          setActiveStep(2)
                        }}
                      >
                        {item.subTitle}
                      </Button>
                    </Sheet>
                  ))}
                </Card>
              </>
            ) : (
              <DocTypeInput
                documentType={documentType}
                setActiveStep={() => setActiveStep(1)}
                setSynchChecked={(state: boolean) => setSynchChecked(state)}
                synchChecked={synchChecked}
                text={text}
                setText={(text: string) => setText(text)}
                knowledgeSpaceName={knowledgeSpaceName}
                webPageUrl={webPageUrl}
                setWebPageUrl={(url: string) => setWebPageUrl(url)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* 卡片区域 */}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {knowledgeSpaceList.map((item: any) => (
            <Card
              className={cn("w-[300px]", className)}
              {...props}
              onClick={() => {
                router.push(`/datastores/documents?name=${item.name}`)
              }}
            >
              <CardHeader className="text-sm">
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
                <Dialog>
                  <DialogTrigger>
                    <TrashIcon color="red" />
                  </DialogTrigger>
                  <DialogContent>
                    {item.name}
                    <DialogHeader>
                      <DialogTitle>警告！</DialogTitle>
                      <DialogDescription>
                        您确定要删除此知识库吗？此操作不可撤消。
                      </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                      <DialogClose>取消</DialogClose>
                      <DialogClose
                        color="black"
                        onClick={async () => {
                          const res: any = await sendSpacePostRequest(
                            `/backend/knowledge/space/delete`,
                            {
                              name: item?.name,
                            }
                          )
                          if (res.success) {
                            toast({
                              variant: "default",
                              title: "成功",
                              description: "删除成功",
                            })
                            const data: any = await sendSpacePostRequest(
                              "/backend/knowledge/space/list",
                              {}
                            )
                            if (data.success) {
                              setKnowledgeSpaceList(data.data)
                            }
                          } else {
                            toast({
                              variant: "destructive",
                              title: "失败",
                              description: "删除失败",
                            })
                          }
                          setIsDeleteKnowledgeSpaceModalShow(false)
                        }}
                      >
                        确定
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>

              <CardContent className="grid gap-2">
                <div>所有者：{item.owner}</div>
                <div>文档数量：{item.docs}</div>
                <div>向量数据库：{item.vector_type}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
