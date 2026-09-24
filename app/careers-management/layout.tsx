import type { Metadata } from "next";
import { StaffGate } from "./StaffGate";

// Internal tool: not linked from the site and never indexed.
export const metadata: Metadata = {
  title: "Careers management | Willow Education",
  robots: { index: false, follow: false },
};

export default function CareersManagementLayout({ children }: { children: React.ReactNode }) {
  return <StaffGate>{children}</StaffGate>;
}
