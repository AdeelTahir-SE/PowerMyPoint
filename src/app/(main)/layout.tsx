import SideBar from "@/components/SideBar";
import NavbarMain from "@/components/NavbarMain";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row items-start justify-start w-screen h-screen max-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <SideBar />
      <div className="flex-1 flex flex-col max-h-screen overflow-hidden">
        <NavbarMain />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
