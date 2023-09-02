import React from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"

import { Sidebar } from "./sidebar"
import { SidebarFooter } from "./sidebar-footer"
import { IconSeparator } from "./ui/icons"
import SidebarList from "./sidebar-list"

export function SiteHeader() {
  const isLogin = false
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        <Sidebar>
          <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
            <SidebarList />
          </React.Suspense>
          <SidebarFooter></SidebarFooter>
        </Sidebar>
        <div className="flex items-center">
          <IconSeparator className="w-6 h-6 text-muted-foreground/50" />
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <nav className="flex items-center space-x-1">
          <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
            <div
              className={buttonVariants({
                size: "icon",
                variant: "ghost",
              })}
            >
              <Icons.gitHub className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </div>
          </Link>
          <Link
            href={siteConfig.links.twitter}
            target="_blank"
            rel="noreferrer"
          >
            <div
              className={buttonVariants({
                size: "icon",
                variant: "ghost",
              })}
            >
              <Icons.twitter className="h-5 w-5 fill-current" />
              <span className="sr-only">Twitter</span>
            </div>
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
