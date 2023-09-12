import Chat from '@/components/chat'
import React from 'react'





export interface ChatPageProps {
  params: {
    id: string
  }
}

export default function ChatPage() {


  return (
    <Chat/>
  )
}
