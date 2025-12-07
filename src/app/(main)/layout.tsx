import SideBar from "@/components/SideBar";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row items-center justify-start w-screen h-screen max-h-screen">
      <SideBar /><div className="min-w-full max-h-screen overflow-y-auto">{children}</div>
    </div>
  );
}
