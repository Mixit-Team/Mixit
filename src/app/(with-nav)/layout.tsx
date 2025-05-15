import RegisterButton from '@/components/molecules/RegisterButton';
import NavBar from '@/components/organisms/NavBar';

export default function WithNavLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FCDC]">
      <div className="mx-auto flex h-screen w-full max-w-[720px] flex-col bg-white">
        <main className="flex-1 overflow-auto">{children}</main>
        <RegisterButton />
        <NavBar />
      </div>
    </div>
  );
}
