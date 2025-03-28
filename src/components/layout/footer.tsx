import { NavigationItem } from "@/components/layout/Header";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Link } from "@/lib/i18n/routing";
import { ShieldCheck } from "lucide-react";

const navigation: Record<string, NavigationItem[]> = {
  solutions: [
    { name: "SOC", href: "#" },
    { name: "EDR", href: "#" },
    { name: "XDR", href: "#" },
    { name: "Threat Intelligence", href: "#" },
  ],
  support: [{ name: "Contact", href: "/contact" }],
  company: [
    { name: "About", href: "/about" },
    { name: "Blog", href: "#" },
    { name: "Partners", href: "#" },
    { name: "Careers", href: "#" },
  ],
  legal: [
    { name: "Terms", href: "/terms" },
    { name: "Privacy", href: "/privacy" },
    { name: "Legal Notices", href: "/legal" },
  ],
} as const;

export const Footer = () => {
  return (
    <footer className="bg-background" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container py-12 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <Link href="/" className="flex items-center space-x-2">
              <ShieldCheck className="h-6 w-6" />
              <span className="font-bold text-xl">Cyna</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Enterprise-grade cybersecurity solutions for your business.
              Protect your digital assets with industry-leading technology.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold">Solutions</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.solutions.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold">Support</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold">Company</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold">Legal</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Cyna. All rights reserved.
          </p>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
};
