import SideBar from "@/components/SideBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row items-start justify-start w-screen h-screen max-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <SideBar />
      <div className="flex-1 max-h-screen overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
