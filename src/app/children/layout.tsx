import "./children.css";
import type { ReactNode } from "react";

export default function ChildrenLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
