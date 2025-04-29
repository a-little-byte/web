import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/Header";

const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export default PublicLayout;
