import { SidebarTrigger } from "@/app/ui/organisms/Sidebar";
import SettingsClient from "./SettingsClient";

export default function SettingsPage() {
  return (
    <main className="relative flex flex-col h-full w-full">
      <SidebarTrigger className="fixed top-2 left-4 md:relative md:top-0 md:left-0 p-5 md:p-8 md:pt-12" />
      <section className="p-8 py-4 mt-20 md:mt-0">
        <SettingsClient />
      </section>
    </main>
  );
}
