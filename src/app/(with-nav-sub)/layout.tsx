export default function WithNavLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F4F4F5]">
      <div className="mx-auto flex h-screen w-full max-w-[767px] flex-col bg-white">
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
