# Design System Strategy: The High-Fidelity Lens

## 1. Overview & Creative North Star
**The Creative North Star: "The Synthetic Precision"**

This design system is engineered to feel like a high-end optical instrument—a digital microscope for the AI era. It moves beyond "standard" dark mode by embracing a hyper-technical, editorial aesthetic that emphasizes the power of the underlying AI. We avoid the "template" look by utilizing intentional asymmetry, expansive breathing room, and high-contrast typographic scales that prioritize clarity and technical authority.

The experience should feel like looking through a precision lens: sharp edges, translucent layers, and focused light. We are not just building an interface; we are building a cockpit for image restoration.

## 2. Color Strategy: Light as Information
Our palette utilizes a deep, architectural foundation (`#0c0e12`) punctuated by high-energy neon accents. Color is never decorative; it is functional, used to signify "processing," "power," or "focal points."

*   **The "No-Line" Rule:** Do not use 1px solid borders to section the interface. Separation is achieved through background shifts. A `surface-container-low` component should sit on a `surface` background to define its boundaries.
*   **Surface Hierarchy & Nesting:** Treat the UI as stacked sheets of tinted glass.
    *   **Base:** `surface` (#0c0e12)
    *   **Primary Containers:** `surface-container` (#171a1f)
    *   **Interactive Elements:** `surface-container-high` (#1d2025)
*   **The "Glass & Gradient" Rule:** To achieve a premium "Slick" feel, floating panels must use Glassmorphism. Apply `surface-variant` at 60% opacity with a `backdrop-filter: blur(20px)`. 
*   **Signature Textures:** For high-intent areas like the "Upscale" button or "Processing" bars, use a linear gradient from `primary` (#8ff5ff) to `primary-container` (#00eefc) at a 135-degree angle. This provides a "shimmer" of energy that flat colors cannot replicate.

## 3. Typography: Sharp & Technical
The typography system relies on the interplay between the geometric precision of **Space Grotesk** and the clean, functional readability of **Manrope**.

*   **Display & Headline (Space Grotesk):** Used for "Hero" moments and technical data. The sharp terminals and eccentric character shapes of Space Grotesk communicate high-tech sophistication. Use `display-lg` for impact, ensuring letter-spacing is set to -0.02em to maintain a tight, "machined" look.
*   **Title & Body (Manrope):** Used for user instructions and metadata. Manrope provides a neutral, humanist balance to the aggressive tech-feel of the headlines.
*   **Labels (Space Grotesk):** All micro-copy and technical specs (e.g., "RESOLUTION: 4000px") must use `label-md` in all-caps with 0.05em tracking to mimic blueprints.

## 4. Elevation & Depth: Tonal Layering
In this system, depth is a result of light behavior, not structural shadows.

*   **The Layering Principle:** Avoid traditional shadows. To lift a card, place a `surface-container-highest` element on a `surface-dim` background. The contrast in value creates a "natural" lift.
*   **Ambient Glow:** For "Active" states (like a selected image), replace shadows with an ambient glow. Use the `primary` color at 10% opacity with a 40px blur. This makes the component appear to be emitting light, fitting the "Neon" theme.
*   **The "Ghost Border" Fallback:** If a container requires a boundary (e.g., an image preview), use the `outline-variant` token at 15% opacity. It should feel like a faint laser-etched line, not a box.
*   **Glassmorphism Depth:** When using glass layers, use a top-down inner highlight (1px linear gradient, `on-surface` at 10% to transparent) to simulate the "edge" of a glass pane.

## 5. Components: Precision Primitives

*   **Primary Action (The Power Button):**
    *   **Style:** Gradient fill (`primary` to `primary-container`). 
    *   **Typography:** `title-sm`, all-caps, bold. 
    *   **Radius:** `DEFAULT` (0.25rem) for a sharp, technical look.
*   **Input Fields (The Data Entry):**
    *   **Style:** No background fill. Only a `surface-container-highest` bottom border (2px).
    *   **Focus State:** The bottom border transitions to `primary` with a subtle `primary_dim` glow beneath it.
*   **Chips (Metadata Tags):**
    *   **Style:** `surface-container-high` background with `label-sm` text.
    *   **Interaction:** On hover, the text color shifts to `secondary` (#ac89ff) to signal "Active AI" processing.
*   **Cards & Lists (The Workflow):**
    *   **Rule:** Forbid divider lines. Use `surface-container-low` for even items and `surface-container-lowest` for odd items, or simply use 24px of vertical white space to separate logic blocks.
*   **AI Progress Bars:**
    *   **Style:** A 2px thin track (`surface-variant`). The indicator is a `primary` to `tertiary` gradient shimmer. It should feel like a pulse of energy moving through the system.

## 6. Do's and Don'ts

### Do:
*   **Use Asymmetry:** Place technical metadata (labels) in the corners of containers to create an "industrial" layout.
*   **Embrace High Contrast:** Keep the background dark (`#0c0e12`) so that neon accents (`#8ff5ff`) feel like they are cutting through the dark.
*   **Prioritize Breathing Room:** High-tech doesn't mean "cluttered." Use generous margins to let the AI-generated imagery be the hero.

### Don't:
*   **Don't Use Large Radii:** Avoid `xl` or `full` rounded corners for main UI blocks. It feels too "friendly." Stick to `DEFAULT` (0.25rem) or `none` for a professional, sharp-edged aesthetic.
*   **Don't Use Grey Shadows:** Never use `#000000` or neutral grey for shadows. If you must use a shadow, tint it with `surface-tint` to maintain the color harmony of the dark theme.
*   **Don't Use Standard "Success" Greens:** Use the `tertiary` (#afffd2) for success states. It is a "Mint Neon" that feels more high-tech than a standard utility green.
