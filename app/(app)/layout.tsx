import { BottomNav } from "@/components/shell/bottom-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}

