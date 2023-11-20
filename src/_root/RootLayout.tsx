import Bottombar from "@/components/ui/shared/Bottombar";
import LeftSidebar from "@/components/ui/shared/LeftSidebar";
import Topbar from "@/components/ui/shared/Topbar";
import { Outlet } from "react-router-dom";

function RootLayout() {
  return (
    <div className="w-full md:flex gap-20">
      <Topbar />
      <LeftSidebar />
      <section className="flex flex-1 min-h-full">
        <Outlet />
      </section>
      <Bottombar />
    </div>
  );
}

export default RootLayout;
