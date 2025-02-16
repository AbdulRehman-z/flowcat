"use client";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { navItems } from "@/lib/constants";
import { Logo } from "./logo";
import { NavUser } from "./nav-user";
import { Separator } from "./ui/separator";
// import UserAvaliableCreditsBadge from "./user-avaliable-credits-badge";
import { ComponentProps } from "react";

type AppSidebarProps = ComponentProps<typeof Sidebar> & {
  user: {
    email: string;
    name: string;
    avatar: string;
  };
};

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar className="bg-background h-[95%] my-auto" variant="floating" collapsible="icon" {...props}>
      <SidebarTrigger className="absolute -right-6 top-3 h-6 w-6 rounded-full border bg-background shadow-sm" />
      <SidebarHeader>
        <Logo />
        <Separator />
        {/* <UserAvaliableCreditsBadge /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain routes={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
