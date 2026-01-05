import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  strokewidth?: number;
  title?: string;
  size?: number | string;
};

export function OpenExternal({
  fill = "currentColor",
  size = 14,
  ...props
}: IconProps) {
  return (
    <svg
      height={size}
      width={size}
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g fill={fill}>
        <path
          d="m11,6l-1.9645-1.9645c-1.3807-1.3807-3.6193-1.3807-5,0h0c-1.3807,1.3807-1.3807,3.6193,0,5l1.9645,1.9645"
          fill="none"
          stroke={fill}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        ></path>
        <path
          d="m9,14l1.9645,1.9645c1.3807,1.3807,3.6193,1.3807,5,0h0c1.3807-1.3807,1.3807-3.6193,0-5l-1.9645-1.9645"
          fill="none"
          stroke={fill}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        ></path>
        <line
          x1="12"
          y1="12"
          x2="8"
          y2="8"
          fill="none"
          stroke={fill}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        ></line>
      </g>
    </svg>
  );
}
