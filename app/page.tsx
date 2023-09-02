
import Chat from "./chat/page"
import SignIn  from "./sign-in/page"



export default function IndexPage() {
  const isLogin = true
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      {isLogin? <Chat/> : <SignIn/>}
    </section>
  )
}
