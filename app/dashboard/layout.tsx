"use client";

import { useState, ReactNode } from "react";
import { Button, buttonVariants } from "@/components/ui/button";

import {
  Star,
  ShoppingBag,
  CircleOff,
  Undo2,
  StarHalf,
  MapPin,
  X,
  Menu,
  LogOut,
} from "lucide-react";

import Link from "next/link";
import { cn } from "../_utils/cn";
import { useClerk } from "@clerk/nextjs";
import { routes } from "../_config/routes";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { signOut } = useClerk();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const dashboardLinks = [
    {
      label: "Address Diary",
      route: routes.addressDiary,
      Icon: MapPin,
    },
    {
      label: "Orders",
      route: routes.orders,
      Icon: ShoppingBag,
    },
    {
      label: "Cancelled Orders",
      route: routes.cancelledOrders,
      Icon: CircleOff,
    },
    {
      label: "Returned Orders",
      route: routes.returnedOrders,
      Icon: Undo2,
    },
    {
      label: "Published Reviews",
      route: routes.publishedReviews,
      Icon: Star,
    },
    {
      label: "Pending Reviews",
      route: routes.pendingReviews,
      Icon: StarHalf,
    },
  ];

  return (
    <div className="flex h-[calc(100dvh-80px)] flex-col bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-[999] bg-gray-600 bg-opacity-75 transition-opacity lg:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition-transform duration-300 ease-in-out max-lg:z-[9999] lg:static lg:inset-auto lg:translate-x-0 lg:transform-none`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between p-4 lg:hidden">
              <span className="text-lg font-semibold">Menu</span>
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close sidebar</span>
              </Button>
            </div>

            <nav className="flex-1 space-y-2 p-2">
              {dashboardLinks.map(({ route, Icon, label }, i) => (
                <Link
                  key={i}
                  href={route}
                  className={cn(
                    buttonVariants({
                      variant: "ghost",
                    }),
                    "w-full justify-start",
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {label}
                </Link>
              ))}
            </nav>

            <div className="border-t p-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:bg-red-100 hover:text-red-700"
                onClick={() => signOut({ redirectUrl: routes.home })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {/* Dashboard Title and Toggle */}
          <div className="flex items-center justify-between bg-white p-3">
            <h2 className="text-lg font-semibold uppercase">Dashboard</h2>
            <Button
              size="icon"
              variant="ghost"
              className="lg:hidden"
              onClick={toggleSidebar}
            >
              {sidebarOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
