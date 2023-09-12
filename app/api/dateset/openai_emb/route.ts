import { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const body = await request.json()
  console.log("OPENAI_EMBEDDING", body.inputs)
  const qurey = {
    input: body.inputs,
    model: "text-embedding-ada-002"
  }
  const response = await fetch("https://aishell.work/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer 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",
    },
    body: JSON.stringify(qurey)
  })
  const res = await response.json()
  console.log("OPENAI_EMBEDDING", res)
  return new Response(JSON.stringify({ res }))
}
