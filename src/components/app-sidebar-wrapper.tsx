// import { auth } from "@/auth"
import { AppSidebar } from "./app-sidebar"

export async function AppSidebarWrapper() {
  // const session = await auth()
  const session = {
    user: {
      name: 'John Doe',
      email: 'john@example.com',
      image: ''
    }
  }


  // if (!session?.user?.name && !session?.user?.email && !session?.user?.image) {
  //   return null
  // }

  return <AppSidebar user={{
    name: session.user.name || 'Anonymous',
    email: session.user.email || 'anonymous@example.com',
    avatar: session.user.image || ''
  }} />
}
