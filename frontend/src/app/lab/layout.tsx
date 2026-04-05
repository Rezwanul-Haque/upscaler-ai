import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upscaler AI | Lab",
  description: "AI-powered image upscaling laboratory.",
};

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return <div className="overflow-hidden">{children}</div>;
}
