const NEURAL_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuByzPqlsiWeO_iMly1SOTouWuoU4vEGXUJR2eyYX3aWyyXRr2lRw7PDBfo_spylMVtKevWeE-dJ62GGtKNlS2p_OCrGJ_e77EvlPctzYizz3nIpbJn11tFUWosHOjFCxYPxWC7ec9bO1Bxn_zlH11-RmIwJhu7OijJN1SFTcJcDpvDuujaIOI85Wc4WuZiRqFTBPvr9u0HvkdOCDDha1ygQNuv4CkOAS8QtpqAhmdyWuhJmLAlYm8KyG9rFIuDV3_LuYya9yrDjD3o";

const AI_NODES_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCVBn9FNNhRTnDXs_Sbf0L5r_6f-zP56mxHBnQ88RoKoycaFYz11XbFS2U8R-MS-k1-YX-Np8t6u7BxdQGfDevO_QdJDKPsZbaRFB0Wupb2klljPqjhydZgREbOGmbatn-dD2D-muq9V3JEyeXFinBHrSvUH6vjQ2oyca5MKY8Z8Kdae283FM-2OE8T1vc8KpNVRuJn6WHtuR5Gb5H0OBnXBd-iBGlpRA1vFD4RjFaCOH_MDgwNDVLnwaOSE56DPWWizPI71Ez1cBQ";

export default function FeaturesBento() {
  return (
    <section className="py-32 px-8 max-w-screen-2xl mx-auto">
      <div className="grid md:grid-cols-3 gap-6">

        {/* Large feature — Hyper-Speed */}
        <div
          className="md:col-span-2 glass-panel p-12 relative overflow-hidden group"
        >
          <div className="relative z-10 space-y-4">
            {/* Bolt icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            <h3
              className="text-4xl font-bold"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              HYPER-SPEED INFERENCE
            </h3>
            <p className="text-on-surface-variant max-w-sm leading-relaxed">
              Our proprietary TensorCore-V4 hardware architecture allows for 8K
              upscaling in under 3 seconds. Real-time processing for professional
              workflows.
            </p>
            <div className="pt-6">
              <span
                className="text-xs tracking-widest text-primary border-b border-primary/30 pb-1"
                style={{ fontFamily: "var(--font-label)" }}
              >
                LEARN ABOUT ARCHITECTURE
              </span>
            </div>
          </div>
          {/* Background image */}
          <div className="absolute right-0 bottom-0 w-2/3 h-full opacity-20 pointer-events-none grayscale group-hover:grayscale-0 transition-all duration-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={NEURAL_IMG}
              alt="Neural network visualization"
              className="w-full h-full object-cover object-left-bottom"
            />
          </div>
        </div>

        {/* Pixel Precision */}
        <div
          className="p-8 flex flex-col justify-between border border-outline-variant/10"
          style={{ backgroundColor: "#171a1f" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
          </svg>
          <div className="space-y-2">
            <h3
              className="text-2xl font-bold uppercase tracking-tight"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              Pixel Precision
            </h3>
            <p className="text-on-surface-variant text-sm">
              Synthetic hallucination is minimized through recursive neural
              loops, ensuring authentic texture reconstruction.
            </p>
          </div>
        </div>

        {/* API Integrated */}
        <div
          className="p-8 flex flex-col justify-between border border-outline-variant/10"
          style={{ backgroundColor: "#171a1f" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <div className="space-y-2">
            <h3
              className="text-2xl font-bold uppercase tracking-tight"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              API Integrated
            </h3>
            <p className="text-on-surface-variant text-sm">
              Zero-latency API endpoints for developers. Seamlessly integrate
              upscaling into your own production stack.
            </p>
          </div>
        </div>

        {/* AI Restoration */}
        <div
          className="md:col-span-2 p-8 flex flex-col md:flex-row gap-8 items-center border border-outline-variant/10"
          style={{ backgroundColor: "#1d2025" }}
        >
          <div className="flex-1 space-y-4">
            <h3
              className="text-3xl font-bold uppercase"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              AI-Powered Restoration
            </h3>
            <p className="text-on-surface-variant">
              Beyond simple upscaling, our engine identifies noise, compression
              artifacts, and chromatic aberration, cleaning them at a molecular
              level.
            </p>
            <div className="flex gap-3 flex-wrap">
              {["DENOISE", "SHARPEN", "RELIGHT"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-on-surface text-[10px] tracking-widest"
                  style={{ fontFamily: "var(--font-label)", backgroundColor: "#23262c" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div
            className="w-full md:w-48 aspect-video md:aspect-square overflow-hidden flex-shrink-0"
            style={{ backgroundColor: "#0c0e12", borderRadius: "var(--radius)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={AI_NODES_IMG}
              alt="AI neural network"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
