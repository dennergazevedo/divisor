"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/app/ui/organisms/Sidebar";
import { MenuLink } from "./link";
import {
  Album,
  Briefcase,
  ChartPie,
  Clock,
  FlaskConical,
  Gauge,
  Info,
  LogOut,
  Plug,
  Settings,
  Users,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/ui/molecules/Accordion";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar } from "../../atoms/Avatar";
import { Button } from "../../atoms/Button";

export function MenuSidebar() {
  const { user, logout, loading } = useAuth();

  return (
    <Sidebar>
      <SidebarContent className="pt-10 md:pt-20 px-2 pb-24">
        <MenuLink href="/" icon={Briefcase} label="Tenants" />
        <MenuLink href="/integrations" icon={Plug} label="SDKs" />
        <MenuLink
          href="https://docs.divisor.dev"
          icon={Album}
          label="Documentation"
          newTab
        />
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>tests</AccordionTrigger>
            <AccordionContent>
              <MenuLink
                href="/experiments"
                icon={FlaskConical}
                label="Experiments"
              />
              <MenuLink href="#" icon={Gauge} label="Performance" disabled />
              <MenuLink href="#" icon={Info} label="Logs" disabled />
              <MenuLink href="#" icon={Clock} label="History" disabled />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>management</AccordionTrigger>
            <AccordionContent>
              <MenuLink href="/members" icon={Users} label="Members" />
              <MenuLink href="#" icon={ChartPie} label="Analytics" disabled />
              <MenuLink href="#" icon={Settings} label="Settings" disabled />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-neutral-800 bg-zinc-900/50 backdrop-blur-md">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Avatar name={user?.name || user?.email} size="sm" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-neutral-200 truncate">
                {user?.name || user?.email?.split("@")[0]}
              </span>
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                {user?.current_plan || "Free"}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 justify-center gap-2 text-xs text-neutral-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            onClick={logout}
            disabled={loading}
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
