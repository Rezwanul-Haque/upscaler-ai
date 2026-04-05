import { Header } from "@/features/landing";
import Footer from "@/features/landing/components/Footer";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="pt-28 pb-20 px-8 max-w-3xl mx-auto min-h-screen" style={{ backgroundColor: "#0c0e12" }}>
        <h1
          className="text-3xl font-extrabold tracking-tighter text-on-surface mb-8"
          style={{ fontFamily: "var(--font-headline)" }}
        >
          TERMS OF SERVICE
        </h1>

        <div className="space-y-6 text-on-surface-variant text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
          <p>
            Welcome to {process.env.NEXT_PUBLIC_BRAND_NAME ?? "Upscaler AI"}. By accessing or using our service, you agree to be bound by these terms.
          </p>

          <h2 className="text-on-surface font-bold text-xs uppercase tracking-widest pt-4" style={{ fontFamily: "var(--font-label)" }}>1. Use of Service</h2>
          <p>
            You may use our image upscaling service for personal and commercial purposes. You retain all rights to your uploaded images. We do not claim ownership of any content you upload.
          </p>

          <h2 className="text-on-surface font-bold text-xs uppercase tracking-widest pt-4" style={{ fontFamily: "var(--font-label)" }}>2. Acceptable Use</h2>
          <p>
            You agree not to upload content that is illegal, harmful, or infringes on the intellectual property rights of others. We reserve the right to remove any content that violates these terms.
          </p>

          <h2 className="text-on-surface font-bold text-xs uppercase tracking-widest pt-4" style={{ fontFamily: "var(--font-label)" }}>3. Data Storage</h2>
          <p>
            Uploaded images and processed outputs are stored temporarily for processing purposes. We do not guarantee permanent storage of your files. Please download your enhanced images promptly.
          </p>

          <h2 className="text-on-surface font-bold text-xs uppercase tracking-widest pt-4" style={{ fontFamily: "var(--font-label)" }}>4. Limitation of Liability</h2>
          <p>
            The service is provided &quot;as is&quot; without warranties of any kind. We are not liable for any damages arising from the use of our service, including but not limited to data loss or image quality issues.
          </p>

          <h2 className="text-on-surface font-bold text-xs uppercase tracking-widest pt-4" style={{ fontFamily: "var(--font-label)" }}>5. Changes to Terms</h2>
          <p>
            We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the updated terms.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
