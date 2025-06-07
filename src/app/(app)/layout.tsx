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
import { Activity, LayoutDashboard, FileText, TrendingUp, Lightbulb, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
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
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Explore Opportunities">
                    <Link href="/ideate-trends">
                      <Lightbulb />
                      <span>Explore Opportunities</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="p-2">
               {/* Placeholder for potential future elements like settings or logout */}
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <AppHeader />
            <main className="flex-1 p-4 md:p-6">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}