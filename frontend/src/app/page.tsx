import {
  Header,
  HeroSection,
  UpscaleZone,
  FeaturesBento,
  CtaSection,
  Footer,
} from "@/features/landing";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="pt-24 overflow-x-hidden">
        <HeroSection />
        <UpscaleZone />
        <FeaturesBento />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
