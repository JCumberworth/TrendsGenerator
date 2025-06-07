"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Lightbulb } from "lucide-react";

// Helper function to derive a user-friendly title from the pathname
const getTitleFromPathname = (pathname: string): string => {
  if (pathname === "/dashboard") return "Business Dashboard";
  if (pathname === "/trends") return "Key Business Trends";
  if (pathname === "/reports") return "Monthly Trend Reports";
  if (pathname.startsWith("/reports/")) {
    return "Report Details";
  }
  if (pathname === "/ideate-trends") return "Explore Opportunities";
  if (pathname === "/analyzed-ideas") return "Analyzed Ideas";
  return "TrendWatch AI"; // Default title
};

export function AppHeader() {
  const pathname = usePathname();
  const pageTitle = getTitleFromPathname(pathname);
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering theme toggle until mounted
  if (!mounted) {
    return (
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <h1 className="font-headline text-xl font-semibold tracking-tight text-foreground">
            {pageTitle}
          </h1>
        </div>
        <div className="w-10 h-10" />
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <h1 className="font-headline text-xl font-semibold tracking-tight text-foreground">
          {pageTitle}
        </h1>
        <nav className="md:flex gap-6 hidden">
          <Link href="/ideate-trends" className="flex items-center gap-2 hover:text-primary transition-colors">
            <Lightbulb className="h-4 w-4" />
            Brainstorm Ideas
          </Link>
          <Link href="/analyzed-ideas" className="flex items-center gap-2 hover:text-primary transition-colors">
            <Lightbulb className="h-4 w-4" />
            Analyzed Ideas
          </Link>
           <Link href="/project-outlines" className="flex items-center gap-2 hover:text-primary transition-colors">
            <Lightbulb className="h-4 w-4" />
            Project Outlines
          </Link>
        </nav>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        aria-label="Toggle theme"
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
    </header>
  );
}