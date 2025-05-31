
import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { AppHeader } from '@/components/shared/app-header';
import { ThemeProvider } from '@/components/theme-provider';
import { Activity, LayoutDashboard, FileText, TrendingUp, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <Sidebar variant="sidebar" collapsible="icon" side="left">
            <SidebarHeader className="p-4">
              <Link href="/dashboard" className="flex items-center gap-2 font-headline text-lg font-semibold text-primary">
                <Activity className="h-6 w-6" />
                <span>TrendWatch AI</span>
              </Link>
            </SidebarHeader>
            <SidebarContent className="flex-1">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Dashboard">
                    <Link href="/dashboard">
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Trends">
                    <Link href="/trends">
                      <TrendingUp />
                      <span>Trends</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Reports">
                    <Link href="/reports">
                      <FileText />
                      <span>Reports</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="p-2">
               {/* Placeholder for potential future elements like settings or logout */}
               {/* 
                <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Settings">
                    <Link href="/settings">
                      <Settings />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Button variant="ghost" className="w-full justify-start gap-2 px-2" asChild>
                     <Link href="/logout">  
                        <LogOut />
                        <span>Logout</span>
                     </Link>
                  </Button>
                </SidebarMenuItem>
              </SidebarMenu> 
              */}
            </SidebarFooter>
          </Sidebar>
          <div className="flex flex-col sm:gap-4 md:pl-[var(--sidebar-width)] peer-data-[state=collapsed]:md:pl-[var(--sidebar-width-icon)]">
            <SidebarInset className="flex flex-1 flex-col bg-background shadow-sm md:rounded-xl">
              <AppHeader />
              <main className="flex-1 overflow-auto p-4 sm:px-6 sm:py-0 md:gap-8">
                {children}
              </main>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
