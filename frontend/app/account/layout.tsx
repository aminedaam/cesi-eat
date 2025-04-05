import { NavigationBar } from "@/components/header_footers/NavigationBar";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // get user role using localstorage zustand 
  return (
    <div>
      <NavigationBar />
      <main>{children}</main>
    </div>
  );
}
