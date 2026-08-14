import { BottomNav } from "@/components/navigation/bottom-nav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex flex-1 flex-col pb-20">{children}</div>
      <BottomNav />
    </>
  );
}
