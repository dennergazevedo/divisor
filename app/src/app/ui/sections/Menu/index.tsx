import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/app/ui/organisms/Sidebar";
import { MenuLink } from "./link";
import {
  Album,
  ChartPie,
  Clock,
  FlaskConical,
  Gauge,
  Info,
  Settings,
  Users,
  Zap,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function MenuSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="pt-16 px-2">
        <MenuLink href="/dashboard" icon={Gauge} label="Dashboard" />
        <MenuLink href="#" icon={Album} label="Documentation" />
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>tests</AccordionTrigger>
            <AccordionContent>
              <MenuLink href="#" icon={FlaskConical} label="Experiments" />
              <MenuLink href="#" icon={Zap} label="Performance" />
              <MenuLink href="#" icon={Info} label="Logs" />
              <MenuLink href="#" icon={Clock} label="History" />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>management</AccordionTrigger>
            <AccordionContent>
              <MenuLink href="#" icon={ChartPie} label="Analytics" />
              <MenuLink href="#" icon={Users} label="Members" />
              <MenuLink href="#" icon={Settings} label="Settings" />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
