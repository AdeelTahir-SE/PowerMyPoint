export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row items-center justify-center w-screen h-screen">
      <aside className="bg-black"></aside>
      <div>{children}</div>
    </div>
  );
}
