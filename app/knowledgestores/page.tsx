"use client"

import React from "react"
import { PrismaClient } from "@prisma/client/edge"
import { DialogClose } from "@radix-ui/react-dialog"
import { TrashIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { useRouter } from "next/navigation"

const prisma = new PrismaClient()

function Container({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-center [&>div]:w-full",
        className
      )}
      {...props}
    />
  )
}

type Knowledge = {
  id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
}
type KnowledgeList = Knowledge[]

export default function KnowledgeStoresPage() {
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [knowledgeLists, setKnowledgeLists] = React.useState<KnowledgeList>([])


  const createKnowledgeList = async () => {
    const res = await fetch("/api/knowledgelist", {
      method: "POST",
      body: JSON.stringify({
        title: title,
        description: description,
      }),
    })
    const data = await res.json()
    setKnowledgeLists([...knowledgeLists, data.response])
  }

  const deleteKnowledgeList = async (id: string) => {
    const res = await fetch("/api/knowledgelist", {
      method: "DELETE",
      body: JSON.stringify({
        id: id,
      }),
    })
    const data = await res.json()
    return data
  }


  const router = useRouter()

  React.useEffect(() => {
    const getKnowledgeLists = async () => {
      const res = await fetch("/api/knowledgelist", {
        method: "GET",
      })
      const data = await res.json()
      setKnowledgeLists(data.response)
    }
    getKnowledgeLists()
  }, [])

  return (
    <div className="p-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">添加</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>添加知识库</DialogTitle>
            <DialogDescription>请输入知识库名称和描述</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                名称
              </Label>
              <Input
                id="title"
                className="col-span-3"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                描述
              </Label>
              <Input
                id="description"
                className="col-span-3"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose onClick={(e) => createKnowledgeList()}>
              保存
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {
        <>
          {knowledgeLists.length > 0 ? (
            <>
              {knowledgeLists.map((items) => {
                return (
                  <Container>
                    <Card className="w-[350px]" onClick={()=>router.push(`/knowledgestores/detail?id=${items.id}`)}>
                      <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
                        <CardTitle>{items.title}</CardTitle>
                        <CardDescription>
                          <AlertDialog>
                            <AlertDialogTrigger>
                              <TrashIcon color="red"></TrashIcon>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  确定要删除吗？
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  注意：此操作不可逆
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>取消</AlertDialogCancel>
                                <AlertDialogCancel
                                  onClick={(id) =>
                                    deleteKnowledgeList(items.id)
                                  }
                                >
                                  确认
                                </AlertDialogCancel>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>{items.description}</p>
                      </CardContent>
                      <CardFooter></CardFooter>
                    </Card>
                  </Container>
                )
              })}
            </>
          ) : (
            <>加载中</>
          )}
        </>
      }
    </div>
  )
}
