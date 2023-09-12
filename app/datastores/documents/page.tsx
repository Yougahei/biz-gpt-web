"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { sendSpacePostRequest } from "@/utils/request"
import { Dialog } from "@radix-ui/react-dialog"
import { TrashIcon, UpdateIcon } from "@radix-ui/react-icons"
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
// import { Table } from "lucide-react"
import moment from "moment"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Popover } from "@/components/ui/popover"
import { Sheet } from "@/components/ui/sheet"
import { Table } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import DocTypeInput from "@/components/doc-type-Input"

export default function Documents() {
  const [documents, setDocuments] = useState<any>([])
  const spaceName = useSearchParams().get("name")
  const { toast } = useToast()
  const router = useRouter()
  const [current, setCurrent] = useState<number>(0)
  const page_size = 20
  const [total, setTotal] = useState<number>(0)
  const [isKnowledgeSpaceModalShow, setIsKnowledgeSpaceModalShow] =
    useState<boolean>(false)
  const [activeStep, setActiveStep] = useState<number>(0)
  const [documentType, setDocumentType] = useState<string>("")

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
    async function fetchDocuments() {
      const data: any = await sendSpacePostRequest(
        `/backend/knowledge/${spaceName}/document/list`,
        {
          page: 1,
          page_size,
        }
      )
      if (data.success) {
        setDocuments(data.data.data)
        setTotal(data.data.total)
        setCurrent(data.data.page)
      }
    }
    fetchDocuments()
  }, [])
  return (
    <div className="p-4">
      <>
        <div className="text-right">
          <Button className="mr-4" variant="outline">
            聊天
          </Button>
          <Button
            className="mr-4"
            variant="default"
            onClick={() => {
              setIsKnowledgeSpaceModalShow(true)
            }}
          >
            添加数据
          </Button>
          <Button className="mr-4" variant="default">
            参数
          </Button>
        </div>
        {documents.length ? (
          <Table color="primary">
            <thead>
              <tr>
                <th style={{ width: "auto" }}>名称</th>
                <th style={{ width: "auto" }}>类型</th>
                <th style={{ width: "auto" }}>大小</th>
                <th style={{ width: "auto" }}>上次同步</th>
                <th style={{ width: "auto" }}>状态</th>
                <th style={{ width: "auto" }}>结果</th>
                <th style={{ width: "30%" }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((row: any) => (
                <tr key={row.id}>
                  <td className=" text-center">{row.doc_name}</td>
                  <td className=" text-center">
                    <Badge variant="default" color="neutral">
                      {row.doc_type}
                    </Badge>
                  </td>
                  <td className=" text-center">{row.chunk_size} chunks</td>
                  <td className=" text-center">
                    {moment(row.last_sync).format("YYYY-MM-DD HH:MM:SS")}
                  </td>
                  <td className=" text-center">
                    <Badge
                      variant={(function () {
                        switch (row.status) {
                          case "TODO":
                            return "default"
                          case "RUNNING":
                            return "secondary"
                          case "FINISHED":
                            return "outline"
                          case "FAILED":
                            return "destructive"
                        }
                      })()}
                    >
                      {row.status}
                    </Badge>
                  </td>
                  <td className=" text-center">
                    {(function () {
                      if (row.status === "TODO" || row.status === "RUNNING") {
                        return ""
                      } else if (row.status === "FINISHED") {
                        return (
                          <Popover>
                            <Badge variant="default" color="green">
                              成功
                            </Badge>
                          </Popover>
                        )
                      } else {
                        return (
                          <Popover>
                            <Badge variant="destructive" color="danger">
                              失败
                            </Badge>
                          </Popover>
                        )
                      }
                    })()}
                  </td>
                  <td className=" text-center">
                    {
                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            const data: any = await sendSpacePostRequest(
                              `/backend/knowledge/${spaceName}/document/sync`,
                              {
                                doc_ids: [row.id],
                              }
                            )
                            if (data.success) {
                              toast({
                                variant: "default",
                                title: "成功",
                                description: "同步成功",
                              })
                            } else {
                              toast({
                                variant: "destructive",
                                title: "错误",
                                description: data.err_msg || "未知错误",
                              })
                            }
                          }}
                        >
                          同步
                          <UpdateIcon />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            router.push(
                              `/datastores/documents/chunklist?spacename=${spaceName}&documentid=${row.id}`
                            )
                          }}
                        >
                          详细
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          color="danger"
                          onClick={async () => {
                            const res: any = await sendSpacePostRequest(
                              `/backend/knowledge/${spaceName}/document/delete`,
                              {
                                doc_name: row.doc_name,
                              }
                            )
                            if (res.success) {
                              toast({
                                variant: "default",
                                title: "成功",
                                description: "删除成功",
                              })
                              const data: any = await sendSpacePostRequest(
                                `/backend/knowledge/${spaceName}/document/list`,
                                {
                                  page: current,
                                  page_size,
                                }
                              )
                              if (data.success) {
                                setDocuments(data.data.data)
                                setTotal(data.data.total)
                                setCurrent(data.data.page)
                              }
                            } else {
                              toast({
                                variant: "destructive",
                                title: "错误",
                                description: res.err_msg || "未知错误",
                              })
                            }
                          }}
                        >
                          删除
                          <TrashIcon />
                        </Button>
                      </div>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <>加载中。。。</>
        )}
        {/* <Dialog
          open={isKnowledgeSpaceModalShow}
          onOpenChange={setIsKnowledgeSpaceModalShow}
        >
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
        </Dialog> */}
      </>
    </div>
  )
}
