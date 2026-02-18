import { SidebarTrigger } from "@/app/ui/organisms/Sidebar";

export default function Home() {
  return (
    <main className="relative flex flex-col h-full w-full">
      <SidebarTrigger className="fixed top-2 left-4 md:relative md:top-0 md:left-0 p-5 md:p-8 md:pt-12" />
    </main>
  );
}
