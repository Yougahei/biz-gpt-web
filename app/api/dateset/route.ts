import { NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  const body = await request.json()

  console.log(body)
  const response = await prisma.dataSet.createMany({
    data: body.dataSetList
  })
  console.log(response)
  return new Response(JSON.stringify({ response }))
}


export async function GET(request: NextRequest) {
  const response = await prisma.dataSet.findMany()
  return new Response(JSON.stringify({ response }))
}
