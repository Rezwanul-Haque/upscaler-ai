import { Header } from "@/features/landing";
import Footer from "@/features/landing/components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="pt-28 pb-20 px-8 max-w-3xl mx-auto min-h-screen" style={{ backgroundColor: "#0c0e12" }}>
        <h1
          className="text-3xl font-extrabold tracking-tighter text-on-surface mb-8"
          style={{ fontFamily: "var(--font-headline)" }}
        >
          PRIVACY PROTOCOL
        </h1>

        <div className="space-y-6 text-on-surface-variant text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
          <p>
            At {process.env.NEXT_PUBLIC_BRAND_NAME ?? "Upscaler AI"}, we take your privacy seriously. This policy outlines how we collect, use, and protect your information.
          </p>

          <h2 className="text-on-surface font-bold text-xs uppercase tracking-widest pt-4" style={{ fontFamily: "var(--font-label)" }}>Information We Collect</h2>
          <p>
            We collect only the information necessary to provide our service: uploaded images for processing, email addresses for waitlist registration, and basic usage analytics.
          </p>

          <h2 className="text-on-surface font-bold text-xs uppercase tracking-widest pt-4" style={{ fontFamily: "var(--font-label)" }}>How We Use Your Data</h2>
          <p>
            Your images are processed solely for the purpose of upscaling and enhancement. We do not use your images for training, marketing, or any purpose other than delivering the requested service.
          </p>

          <h2 className="text-on-surface font-bold text-xs uppercase tracking-widest pt-4" style={{ fontFamily: "var(--font-label)" }}>Data Retention</h2>
          <p>
            Uploaded images and processed outputs are stored temporarily. Waitlist email addresses are retained until the service launches or you request removal.
          </p>

          <h2 className="text-on-surface font-bold text-xs uppercase tracking-widest pt-4" style={{ fontFamily: "var(--font-label)" }}>Data Security</h2>
          <p>
            We implement appropriate technical measures to protect your data against unauthorized access, alteration, or destruction.
          </p>

          <h2 className="text-on-surface font-bold text-xs uppercase tracking-widest pt-4" style={{ fontFamily: "var(--font-label)" }}>Your Rights</h2>
          <p>
            You may request deletion of your data at any time by contacting us. We will respond to all data deletion requests within 30 days.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
