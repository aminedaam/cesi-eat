import { NavigationBar } from "@/components/header_footers/NavigationBar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <NavigationBar />
      <main>{children}</main>
    </div>
  );
}
