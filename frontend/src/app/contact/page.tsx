import { Header } from "@/features/landing";
import Footer from "@/features/landing/components/Footer";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="pt-28 pb-20 px-8 max-w-3xl mx-auto min-h-screen" style={{ backgroundColor: "#0c0e12" }}>
        <h1
          className="text-3xl font-extrabold tracking-tighter text-on-surface mb-8"
          style={{ fontFamily: "var(--font-headline)" }}
        >
          CONTACT SUPPORT
        </h1>

        <div className="space-y-6 text-on-surface-variant text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
          <p>
            Need help with {process.env.NEXT_PUBLIC_BRAND_NAME ?? "Upscaler AI"}? We&apos;re here to assist you.
          </p>

          <h2 className="text-on-surface font-bold text-xs uppercase tracking-widest pt-4" style={{ fontFamily: "var(--font-label)" }}>General Inquiries</h2>
          <p>
            For questions about the service, features, or pricing, reach out to us at{" "}
            <a href="mailto:support@upscaler.ai" className="text-primary hover:underline">support@upscaler.ai</a>
          </p>

          <h2 className="text-on-surface font-bold text-xs uppercase tracking-widest pt-4" style={{ fontFamily: "var(--font-label)" }}>Technical Support</h2>
          <p>
            Experiencing issues with image processing or downloads? Please include details about the image format, file size, and any error messages you encountered.
          </p>

          <h2 className="text-on-surface font-bold text-xs uppercase tracking-widest pt-4" style={{ fontFamily: "var(--font-label)" }}>Data Requests</h2>
          <p>
            To request deletion of your data or waitlist entry, contact us with the email address associated with your account.
          </p>

          <h2 className="text-on-surface font-bold text-xs uppercase tracking-widest pt-4" style={{ fontFamily: "var(--font-label)" }}>Response Time</h2>
          <p>
            We aim to respond to all inquiries within 24-48 hours during business days.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
