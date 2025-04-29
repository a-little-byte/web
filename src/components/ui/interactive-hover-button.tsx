import { cn } from "@/lib/style";
import { ArrowRight } from "lucide-react";
import { ComponentPropsWithoutRef, ElementType } from "react";

type InteractiveHoverButtonProps<T extends ElementType = "button"> =
  ComponentPropsWithoutRef<T> & {
    as?: T;
  };

export const InteractiveHoverButton = <T extends ElementType = "button">({
  children,
  className,
  as,
  ...props
}: InteractiveHoverButtonProps<T>) => {
  const Comp = as ? as : "button";

  return (
    <Comp
      className={cn(
        "group relative w-auto cursor-pointer overflow-hidden rounded-full border bg-background p-2 px-6 text-center font-semibold",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-primary transition-all duration-300 group-hover:scale-[100.8]"></div>
        <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </div>
      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100">
        <span>{children}</span>
        <ArrowRight />
      </div>
    </Comp>
  );
};
