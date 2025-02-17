import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function About() {
  return (
    <div className="py-24 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-center">
            About Cyna
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Cyna is a leading provider of enterprise-grade cybersecurity
            solutions. Our mission is to protect businesses from evolving cyber
            threats through innovative technology and expert services.
          </p>

          <div className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight">Our Mission</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We believe that every organization deserves access to
              enterprise-grade security. Our solutions combine cutting-edge
              technology with expert human intelligence to provide comprehensive
              protection against modern cyber threats.
            </p>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight">
              Why Choose Cyna?
            </h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              <div className="relative p-6 rounded-2xl border bg-card">
                <h3 className="text-lg font-semibold">Expert Team</h3>
                <p className="mt-2 text-muted-foreground">
                  Our security experts have decades of combined experience in
                  cybersecurity, threat intelligence, and incident response.
                </p>
              </div>
              <div className="relative p-6 rounded-2xl border bg-card">
                <h3 className="text-lg font-semibold">Advanced Technology</h3>
                <p className="mt-2 text-muted-foreground">
                  We leverage the latest AI and machine learning technologies to
                  provide real-time threat detection and response.
                </p>
              </div>
              <div className="relative p-6 rounded-2xl border bg-card">
                <h3 className="text-lg font-semibold">24/7 Support</h3>
                <p className="mt-2 text-muted-foreground">
                  Our security operations center provides round-the-clock
                  monitoring and support to protect your business.
                </p>
              </div>
              <div className="relative p-6 rounded-2xl border bg-card">
                <h3 className="text-lg font-semibold">Global Coverage</h3>
                <p className="mt-2 text-muted-foreground">
                  With a global network of security operations centers, we
                  provide protection for businesses worldwide.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button size="lg" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
