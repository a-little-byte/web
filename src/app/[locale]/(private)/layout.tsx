import { QueryClientProvider } from "@/components/providers/QueryClientProvider";

const PrivateLayout = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider>{children}</QueryClientProvider>
);

export default PrivateLayout;
