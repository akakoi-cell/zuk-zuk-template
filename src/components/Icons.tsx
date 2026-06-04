// Icons.tsx — small line icons (square caps, 1.6px stroke)
// 汎用アイコンセット。Header メニューや UI で利用。

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
  sw?: number;
};

function Icon({
  children,
  size = 18,
  sw = 1.6,
  ...rest
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function IconArrowUR(p: IconProps) {
  return (
    <Icon {...p}>
      <line x1="6" y1="18" x2="18" y2="6" />
      <polyline points="9,6 18,6 18,15" />
    </Icon>
  );
}

export function IconX(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M4 4 L18 18 M10.5 13 L4 20 M13 10.5 L20 4" />
    </Icon>
  );
}

export function IconInsta(p: IconProps) {
  return (
    <Icon {...p}>
      <rect x="3.5" y="3.5" width="17" height="17" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="0.8" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function IconMenu(p: IconProps) {
  return (
    <Icon {...p}>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </Icon>
  );
}

export function IconClose(p: IconProps) {
  return (
    <Icon {...p}>
      <line x1="5" y1="5" x2="19" y2="19" />
      <line x1="19" y1="5" x2="5" y2="19" />
    </Icon>
  );
}
