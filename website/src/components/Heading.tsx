import type { ReactNode } from "react";

type HeadingProps = {
  as?: "h1" | "h2" | "h3";
  children: ReactNode;
  className?: string;
};

export function Heading({ as: Tag = "h2", children, className = "" }: HeadingProps) {
  return (
    <Tag className={`text-foreground font-medium mb-4 ${className}`.trim()}>
      {children}
    </Tag>
  );
}
