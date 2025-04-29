import { CynaIcon } from "@/components/icons/Cyna";
import { SearchBar } from "@/components/layout/SearchBar";
import { Kbd } from "@/components/ui/kbd";
import ScrambleHover from "@/components/ui/scramble";
import {
  Sidebar as BaseSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, usePathname, useRouter } from "@/lib/i18n/routing";
import { CreditCard, Home, Search, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode, useCallback, useMemo } from "react";

export const DashboardSidebar = () => {
  const t = useTranslations("navigation");
  const router = useRouter();
  const pathname = usePathname();
  const SIDEBAR: Array<{ href: string; children: ReactNode }> = useMemo(
    () => [
      {
        href: "/dashboard",
        children: (
          <>
            <Home className="h-4 w-4" />
            <span>{t("overview")}</span>
          </>
        ),
      },
      {
        href: "/dashboard/order-history",
        children: (
          <>
            <CreditCard className="h-4 w-4" />
            <span>{t("orderHistory")}</span>
          </>
        ),
      },
      {
        href: "/dashboard/settings",
        children: (
          <>
            <Settings className="h-4 w-4" />
            <span>{t("settings")}</span>
          </>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const onClick = useCallback(
    (href: string) => () => {
      router.push(href);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <BaseSidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:!p-1.5"
              asChild
            >
              <Link href="/dashboard">
                <CynaIcon className="h-11 w-11" />
                <span className="text-lg font-semibold">
                  <ScrambleHover
                    text="Cyna"
                    sequential={true}
                    revealDirection="start"
                    useOriginalCharsOnly={false}
                  />
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              <SidebarMenuItem className="flex items-center gap-2">
                <SearchBar
                  as={SidebarMenuButton}
                  className="min-w-8 mb-3 bg-[#1c1cae] text-primary-foreground hover:text-white duration-200 ease-linear hover:bg-primary hover:cursor-pointer"
                  navigation={[
                    {
                      name: "home",
                      href: "/",
                    },
                    {
                      name: "dashboard",
                      href: "/dashboard",
                    },
                    {
                      name: "orderHistory",
                      href: "/dashboard/order-history",
                    },
                    {
                      name: "settings",
                      href: "/dashboard/settings",
                    },
                  ]}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      <span>Search</span>
                    </div>
                    <Kbd>⌘K</Kbd>
                  </div>
                </SearchBar>
              </SidebarMenuItem>
              {SIDEBAR.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    onClick={onClick(item.href)}
                  >
                    {item.children}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </BaseSidebar>
  );
};

export const AdminSidebar = () => {
  const t = useTranslations("navigation");
  const router = useRouter();
  const pathname = usePathname();
  const SIDEBAR: Array<{ href: string; children: ReactNode }> = useMemo(
    () => [
      {
        href: "/admin",
        children: (
          <>
            <Home className="h-4 w-4" />
            <span>{t("overview")}</span>
          </>
        ),
      },
      {
        href: "/admin/services",
        children: (
          <>
            <CreditCard className="h-4 w-4" />
            <span>{t("services")}</span>
          </>
        ),
      },
      {
        href: "/admin/content",
        children: (
          <>
            <CreditCard className="h-4 w-4" />
            <span>{t("content")}</span>
          </>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const onClick = useCallback(
    (href: string) => () => {
      router.push(href);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <BaseSidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:!p-1.5"
              asChild
            >
              <Link href="/dashboard">
                <CynaIcon className="h-11 w-11" />
                <span className="text-lg font-semibold">
                  <ScrambleHover
                    text="Cyna"
                    sequential={true}
                    revealDirection="start"
                    useOriginalCharsOnly={false}
                  />
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              <SidebarMenuItem className="flex items-center gap-2">
                <SidebarMenuButton className="min-w-8 py-4 mb-3 bg-[#1c1cae] text-primary-foreground duration-200 ease-linear hover:bg-primary hover:cursor-pointer">
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {SIDEBAR.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    onClick={onClick(item.href)}
                  >
                    {item.children}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </BaseSidebar>
  );
};
