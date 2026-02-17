import { SidebarTrigger } from "@/app/ui/organisms/Sidebar";

export default function Home() {
  return (
    <main className="relative flex flex-col h-full w-full">
      <SidebarTrigger className="p-5 md:p-8" />
    </main>
  );
}
