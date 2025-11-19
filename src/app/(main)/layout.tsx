import SideBar from "@/components/SideBar";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row items-center justify-center w-screen h-screen">
      <SideBar/><div>{children}</div>
    </div>
  );
}
