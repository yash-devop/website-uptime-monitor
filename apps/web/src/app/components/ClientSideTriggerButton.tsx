"use client"

import { SidebarTrigger, useSidebar } from "./ui/sidebar"

export default function ClientSideTriggerButton(){
  const {isMobile} = useSidebar()

    return isMobile ? <SidebarTrigger /> : null
    
}