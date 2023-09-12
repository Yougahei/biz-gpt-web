import { NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  const body = await request.json()

  console.log(body)
  const response = await prisma.knowledgeList.create({
    data: {
      title: body.title,
      description: body.description,
    },
  })
  console.log(response)
  return new Response(JSON.stringify({ response }))
}

export async function GET(request: NextRequest) {
  const response = await prisma.knowledgeList.findMany()
  return new Response(JSON.stringify({ response }))
}

export async function DELETE(request: NextRequest) {
  const body = await request.json()

  const res = await prisma.knowledgeList.delete({
    where: { id: body.id },
  })
  console.log(res)

  return new Response(JSON.stringify({ res }))
}
