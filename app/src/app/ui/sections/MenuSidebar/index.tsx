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

export function MenuSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="pt-10 md:pt-20 px-2">
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
      <SidebarFooter />
    </Sidebar>
  );
}
