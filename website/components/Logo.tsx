import { type ComponentProps } from "react";

interface LogoProps extends Omit<ComponentProps<"svg">, "width" | "height"> {
  size?: number | string;
}

export function Logo({ className, size = 16, ...props }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      className={className}
      width={size}
      height={size}
      aria-label="Scrowl logo"
      fill="currentColor"
      {...props}
    >
      <g fill="currentColor">
        <rect x="1" y="5" width="16" height="8" rx="2.75" ry="2.75" />
        <path d="M14.25,15H3.75c-.414,0-.75,.336-.75,.75s.336,.75,.75,.75H14.25c.414,0,.75-.336,.75-.75s-.336-.75-.75-.75Z" />
        <path d="M3.75,3H14.25c.414,0,.75-.336,.75-.75s-.336-.75-.75-.75H3.75c-.414,0-.75,.336-.75,.75s.336,.75,.75,.75Z" />
      </g>
    </svg>
  );
}

