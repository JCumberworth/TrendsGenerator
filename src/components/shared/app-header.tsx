"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes"; // Assuming next-themes is or will be installed. If not, this needs adjustment or removal.

// Helper function to derive a user-friendly title from the pathname
const getTitleFromPathname = (pathname: string): string => {
  if (pathname === "/dashboard") return "Dashboard";
  if (pathname === "/trends") return "Trending Topics";
  if (pathname === "/reports") return "Monthly Reports";
  if (pathname.startsWith("/reports/")) {
    // Potentially fetch report title here if needed, or use a generic one
    return "Report Details";
  }
  return "TrendWatch AI"; // Default title
};

export function AppHeader() {
  const pathname = usePathname();
  const pageTitle = getTitleFromPathname(pathname);
  const { setTheme, theme } = useTheme ? useTheme() : { setTheme: () => {}, theme: 'light' }; // Graceful degradation if useTheme is not available

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <h1 className="font-headline text-xl font-semibold tracking-tight text-foreground">
          {pageTitle}
        </h1>
      </div>
      {useTheme && ( // Conditionally render theme toggle if next-themes is available
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label="Toggle theme"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      )}
    </header>
  );
}
