"use client"

import {CalendarDays, LayoutDashboard, LogOut, Stethoscope, UserRound,} from "lucide-react"
import Image from "next/image";
import Link from "next/link";
import {useRouter} from "next/navigation";

import {Button} from "@/components/ui/button";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Sidebar,
    SidebarContent, SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel, SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {authClient} from "@/lib/auth-client";

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Agendamentos",
        url: "/appointments",
        icon: CalendarDays,
    },
    {
        title: "Médicos",
        url: "/doctors",
        icon: Stethoscope,
    },
    {
        title: "Pacientes",
        url: "/patients",
        icon: UserRound,
    },

]

export function AppSidebar() {
    const router = useRouter();
    const handleSingOut = async () => {
       await authClient.signOut({
           fetchOptions: {
               onSuccess: () => {
                   router.push("/authentication");
               },
           },
       })
    };

    return (
        <Sidebar>
            <SidebarHeader className='p-4 border-b'>
                <Image src="/logo.svg" alt="Doutor Agenda" width={136} height={28} />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                  <SidebarMenuItem>
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button>
                                  Clínica
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={handleSingOut}>
                                <LogOut/>
                                Sair
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                      </DropdownMenu>
                  </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}