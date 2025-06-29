"use client"

import * as React from "react"
import Link from "next/link"

import { IconBadgeTm, IconBarbell, IconBook, IconBrain, IconSettings } from "@tabler/icons-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { NavMain } from "@/components/nav-main"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Học theo PART",
      url: "/parts",
      icon: IconBook,
    },
    {
      title: "Ôn tập từ vựng",
      url: "/flashcards",
      icon: IconBrain,
    },
    {
        title: "Quản lý nội dung",
        url: "/admin",
        icon: IconSettings,
    },
    {
        title: "Luyện tập",
        url: "/practice",
        icon: IconBarbell,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <IconBadgeTm className="!size-5" />
                <span className="text-base font-semibold">TM TOEIC</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
    </Sidebar>
  )
}
