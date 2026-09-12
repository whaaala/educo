/**
 * Background library — a big, browsable set of ready-made backgrounds users can apply to ANY block, the
 * parallel of the icon library (RULE E). Everything here is **pure CSS and self-contained** (no external
 * assets), so it exports cleanly and re-themes for free where it references design tokens.
 *
 * Three kinds, each a preset with a `css` value that goes straight into `background-image`:
 *   • GRADIENTS  — linear/radial/conic gradients (fill the box; no tiling)
 *   • MESH       — layered multi-radial "mesh" gradients (fill the box; no tiling)
 *   • PATTERNS   — repeating motifs (dots, grid, lines…) that need a `tile` (background-size) + repeat
 *
 * "Themed" presets use `var(--eu-color-*)` tokens so they follow the active theme; the rest are curated
 * colour palettes, generated from a big palette table so the set is large and easy to grow. Photos are handled
 * separately (URL / upload / optional Unsplash key) — binary images can't be inlined self-contained like CSS.
 */

export type BgPreset = { id: string; label: string; css: string; tile?: string; group: "themed" | "gradient" | "mesh" | "pattern" };

// ── Themed (follow the active Educo theme via tokens) ──
const THEMED: BgPreset[] = [
  { id: "brand-fade", label: "Brand fade", group: "themed", css: "linear-gradient(135deg, var(--eu-color-brand), var(--eu-color-brand-600, var(--eu-color-brand)))" },
  { id: "brand-surface", label: "Brand → surface", group: "themed", css: "linear-gradient(160deg, var(--eu-color-brand), var(--eu-color-surface))" },
  { id: "surface-soft", label: "Soft surface", group: "themed", css: "linear-gradient(180deg, var(--eu-color-surface), var(--eu-color-surface-2, var(--eu-color-surface)))" },
  { id: "accent-glow", label: "Accent glow", group: "themed", css: "radial-gradient(120% 120% at 50% 0%, var(--eu-color-brand), var(--eu-color-surface) 70%)" },
  { id: "brand-radial", label: "Brand spotlight", group: "themed", css: "radial-gradient(circle at 30% 20%, var(--eu-color-brand), var(--eu-color-surface-2, var(--eu-color-surface)))" },
  { id: "brand-diag", label: "Brand diagonal", group: "themed", css: "linear-gradient(45deg, var(--eu-color-brand), var(--eu-color-accent, var(--eu-color-brand)))" },
];

// ── Gradient palette table → generated presets (big set, easy to grow) ──
type Pal = { id: string; label: string; stops: string[]; angle?: number; kind?: "linear" | "radial" | "conic" };
const gradCss = (p: Pal) => {
  const s = p.stops.join(", ");
  if (p.kind === "radial") return `radial-gradient(circle at 30% 25%, ${s})`;
  if (p.kind === "conic") return `conic-gradient(from 210deg at 50% 50%, ${s})`;
  return `linear-gradient(${p.angle ?? 135}deg, ${s})`;
};
const GRAD_PALETTES: Pal[] = [
  { id: "sunset", label: "Sunset", stops: ["#ff9a9e", "#fecfef"] },
  { id: "peach", label: "Peach", stops: ["#ffd1a1", "#ff8f71"] },
  { id: "ocean", label: "Ocean", stops: ["#2193b0", "#6dd5ed"] },
  { id: "aqua", label: "Aqua", stops: ["#43cea2", "#185a9d"] },
  { id: "grape", label: "Grape", stops: ["#667eea", "#764ba2"] },
  { id: "violet", label: "Violet", stops: ["#a18cd1", "#fbc2eb"] },
  { id: "royal", label: "Royal", stops: ["#4776e6", "#8e54e9"] },
  { id: "flamingo", label: "Flamingo", stops: ["#f093fb", "#f5576c"] },
  { id: "cherry", label: "Cherry", stops: ["#eb3349", "#f45c43"] },
  { id: "mango", label: "Mango", stops: ["#ffe259", "#ffa751"] },
  { id: "lime", label: "Lime", stops: ["#a8e063", "#56ab2f"] },
  { id: "forest", label: "Forest", stops: ["#134e5e", "#71b280"] },
  { id: "teal", label: "Teal", stops: ["#11998e", "#38ef7d"] },
  { id: "sky", label: "Sky", stops: ["#89f7fe", "#66a6ff"] },
  { id: "twilight", label: "Twilight", stops: ["#0f2027", "#203a43", "#2c5364"] },
  { id: "midnight", label: "Midnight", stops: ["#232526", "#414345"] },
  { id: "aurora", label: "Aurora", stops: ["#00c6ff", "#0072ff"] },
  { id: "candy", label: "Candy", stops: ["#ff6a88", "#ff99ac", "#fecfef"] },
  { id: "rose-gold", label: "Rose gold", stops: ["#b76e79", "#eacda3"] },
  { id: "slate", label: "Slate", stops: ["#bdc3c7", "#2c3e50"] },
  { id: "paper", label: "Paper", stops: ["#fdfbfb", "#ebedee"], angle: 180 },
  { id: "mint", label: "Mint", stops: ["#d4fc79", "#96e6a1"] },
  { id: "blush", label: "Blush", stops: ["#ffdde1", "#ee9ca7"] },
  { id: "coral-reef", label: "Coral reef", stops: ["#ff5f6d", "#ffc371"] },
  { id: "emerald", label: "Emerald", stops: ["#348f50", "#56b4d3"] },
  { id: "lavender", label: "Lavender", stops: ["#e0c3fc", "#8ec5fc"] },
  { id: "sea-morning", label: "Sea morning", stops: ["#4facfe", "#00f2fe"] },
  { id: "warm-flame", label: "Warm flame", stops: ["#ff9a9e", "#fad0c4"] },
  { id: "night-fade", label: "Night fade", stops: ["#a18cd1", "#fbc2eb"], angle: 120 },
  { id: "spring-warmth", label: "Spring warmth", stops: ["#fad0c4", "#ffd1ff"] },
  { id: "juicy-peach", label: "Juicy peach", stops: ["#ffecd2", "#fcb69f"] },
  { id: "young-passion", label: "Young passion", stops: ["#ff8177", "#ff867a", "#cf556c"] },
  { id: "lady-lips", label: "Lady lips", stops: ["#ff9a9e", "#fecfef", "#fecfef"] },
  { id: "sunny-morning", label: "Sunny morning", stops: ["#f6d365", "#fda085"] },
  { id: "rainy-ashville", label: "Rainy Ashville", stops: ["#fbc2eb", "#a6c1ee"] },
  { id: "frozen-dreams", label: "Frozen dreams", stops: ["#fdcbf1", "#e6dee9"] },
  { id: "winter-neva", label: "Winter Neva", stops: ["#a1c4fd", "#c2e9fb"] },
  { id: "dusty-grass", label: "Dusty grass", stops: ["#d4fc79", "#96e6a1"] },
  { id: "tempting-azure", label: "Tempting azure", stops: ["#84fab0", "#8fd3f4"] },
  { id: "heavy-rain", label: "Heavy rain", stops: ["#cfd9df", "#e2ebf0"] },
  { id: "amy-crisp", label: "Amy crisp", stops: ["#a6c0fe", "#f68084"] },
  { id: "mean-fruit", label: "Mean fruit", stops: ["#fccb90", "#d57eeb"] },
  { id: "deep-blue", label: "Deep blue", stops: ["#6a11cb", "#2575fc"] },
  { id: "ripe-malin", label: "Ripe malinka", stops: ["#f093fb", "#f5576c"] },
  { id: "morpheus-den", label: "Morpheus den", stops: ["#30cfd0", "#330867"] },
  { id: "rare-wind", label: "Rare wind", stops: ["#a8edea", "#fed6e3"] },
  { id: "near-moon", label: "Near moon", stops: ["#5ee7df", "#b490ca"] },
  { id: "wild-apple", label: "Wild apple", stops: ["#d299c2", "#fef9d7"] },
  { id: "saint-petersburg", label: "St Petersburg", stops: ["#f5f7fa", "#c3cfe2"] },
  { id: "plum-plate", label: "Plum plate", stops: ["#667eea", "#764ba2"], angle: 120 },
  { id: "everlasting-sky", label: "Everlasting sky", stops: ["#fdfcfb", "#e2d1c3"] },
  { id: "happy-fisher", label: "Happy fisher", stops: ["#89f7fe", "#66a6ff"] },
  { id: "blessing", label: "Blessing", stops: ["#fddb92", "#d1fdff"] },
  { id: "sharpeye-eagle", label: "Sharp eagle", stops: ["#9890e3", "#b1f4cf"] },
  { id: "ladoga-bottom", label: "Ladoga bottom", stops: ["#ebc0fd", "#d9ded8"] },
  { id: "lemon-gate", label: "Lemon gate", stops: ["#96fbc4", "#f9f586"] },
  { id: "itmeo-branding", label: "Teal love", stops: ["#2af598", "#009efd"] },
  { id: "confident-cloud", label: "Confident cloud", stops: ["#dad4ec", "#dad4ec", "#f3e7e9"] },
  { id: "le-cocktail", label: "Le cocktail", stops: ["#874da2", "#c43a30"] },
  { id: "river-city", label: "River city", stops: ["#4481eb", "#04befe"] },
  { id: "burning-spring", label: "Burning spring", stops: ["#4fb576", "#44c489", "#28a9ae", "#28a2b7"] },
  { id: "flying-lemon", label: "Flying lemon", stops: ["#64b3f4", "#c2e59c"] },
  { id: "new-retrowave", label: "Retrowave", stops: ["#3b41c5", "#a981bb", "#ffc8a9"] },
  { id: "hidden-jaguar", label: "Hidden jaguar", stops: ["#0fd850", "#f9f047"] },
  { id: "above-clouds", label: "Above the clouds", stops: ["#dbeafe", "#f8fafc"], angle: 180 },
  { id: "sunny-days", label: "Sunny days", stops: ["#edfa79", "#8bffd0"] },
  { id: "midnight-city", label: "Midnight city", stops: ["#232526", "#414345"], angle: 120 },
  { id: "cool-sky", label: "Cool sky", stops: ["#2980b9", "#6dd5fa", "#ffffff"] },
  { id: "dark-ocean", label: "Dark ocean", stops: ["#373b44", "#4286f4"] },
  { id: "purple-love", label: "Purple love", stops: ["#cc2b5e", "#753a88"] },
  { id: "sunset-red", label: "Sunset red", stops: ["#e96443", "#904e95"] },
  { id: "moonlit-asteroid", label: "Moonlit asteroid", stops: ["#0f2027", "#203a43", "#2c5364"], angle: 120 },
  { id: "jshine", label: "JShine", stops: ["#12c2e9", "#c471ed", "#f64f59"] },
  { id: "megatron", label: "Megatron", stops: ["#c6ffdd", "#fbd786", "#f7797d"] },
  { id: "cool-blues", label: "Cool blues", stops: ["#2193b0", "#6dd5ed"], angle: 120 },
  { id: "citrus-peel", label: "Citrus peel", stops: ["#fdc830", "#f37335"] },
  { id: "mango-pulp", label: "Mango pulp", stops: ["#f09819", "#edde5d"] },
  { id: "sin-city-red", label: "Sin city red", stops: ["#ed213a", "#93291e"] },
  { id: "electric-violet", label: "Electric violet", stops: ["#4776e6", "#8e54e9"] },
  { id: "orange-glow", label: "Orange glow", stops: ["#ff9966", "#ff5e62"], kind: "radial" },
  { id: "violet-glow", label: "Violet glow", stops: ["#8e2de2", "#4a00e0"], kind: "radial" },
  { id: "teal-glow", label: "Teal glow", stops: ["#11998e", "#38ef7d"], kind: "radial" },
  { id: "rose-glow", label: "Rose glow", stops: ["#ee9ca7", "#ffdde1"], kind: "radial" },
  { id: "blue-glow", label: "Blue glow", stops: ["#2b5876", "#4e4376"], kind: "radial" },
  { id: "conic-rainbow", label: "Conic rainbow", stops: ["#ff0000", "#ffa500", "#ffff00", "#008000", "#0000ff", "#4b0082", "#ff0000"], kind: "conic" },
  { id: "conic-candy", label: "Conic candy", stops: ["#f6d365", "#fda085", "#f6d365"], kind: "conic" },
  { id: "conic-cool", label: "Conic cool", stops: ["#4facfe", "#00f2fe", "#4facfe"], kind: "conic" },
  // — more variety —
  { id: "bloody-mary", label: "Bloody Mary", stops: ["#ff512f", "#dd2476"] },
  { id: "aubergine", label: "Aubergine", stops: ["#aa076b", "#61045f"] },
  { id: "harmonic-energy", label: "Harmonic", stops: ["#16a085", "#f4d03f"] },
  { id: "purple-bliss", label: "Purple bliss", stops: ["#360033", "#0b8793"] },
  { id: "kyoo-tah", label: "Kyoo Tah", stops: ["#544a7d", "#ffd452"] },
  { id: "kyoo-pal", label: "Kyoo Pal", stops: ["#dd3e54", "#6be585"] },
  { id: "yoda", label: "Yoda", stops: ["#ff0099", "#493240"] },
  { id: "dark-knight", label: "Dark knight", stops: ["#ba8b02", "#181818"] },
  { id: "shroom-haze", label: "Shroom haze", stops: ["#5c258d", "#4389a2"] },
  { id: "mirage", label: "Mirage", stops: ["#16222a", "#3a6073"] },
  { id: "steel-gray", label: "Steel gray", stops: ["#1f1c2c", "#928dab"] },
  { id: "kashmir", label: "Kashmir", stops: ["#614385", "#516395"] },
  { id: "electric-blue", label: "Electric blue", stops: ["#00c6ff", "#0072ff"] },
  { id: "veagas-gold", label: "Vegas gold", stops: ["#c6ffdd", "#fbd786", "#f7797d"] },
  { id: "shifty", label: "Shifty", stops: ["#636363", "#a2ab58"] },
  { id: "vanusa", label: "Vanusa", stops: ["#da4453", "#89216b"] },
  { id: "evening-night", label: "Evening night", stops: ["#005aa7", "#fffde4"] },
  { id: "magic", label: "Magic", stops: ["#59c173", "#a17fe0", "#5d26c1"] },
  { id: "margo", label: "Margo", stops: ["#ffefba", "#ffffff"], angle: 180 },
  { id: "ultra-violet", label: "Ultra violet", stops: ["#654ea3", "#eaafc8"] },
  { id: "cherryblossoms", label: "Cherry blossom", stops: ["#fbd3e9", "#bb377d"] },
  { id: "parklife", label: "Parklife", stops: ["#add100", "#7b920a"] },
  { id: "dance-to-forget", label: "Warm dusk", stops: ["#ff4e50", "#f9d423"] },
  { id: "starfall", label: "Starfall", stops: ["#f0c27b", "#4b1248"] },
  { id: "red-mist", label: "Red mist", stops: ["#000000", "#e74c3c"] },
  { id: "teal-love", label: "Teal love", stops: ["#aaffa9", "#11ffbd"] },
  { id: "neon-life", label: "Neon life", stops: ["#b3ffab", "#12fff7"] },
  { id: "man-of-steel", label: "Man of steel", stops: ["#780206", "#061161"] },
  { id: "amethyst", label: "Amethyst", stops: ["#9d50bb", "#6e48aa"] },
  { id: "cheer-up", label: "Cheer up", stops: ["#556270", "#ff6b6b"] },
  { id: "shore", label: "Shore", stops: ["#70e1f5", "#ffd194"] },
  { id: "facebook-msg", label: "Cool sky", stops: ["#00c6ff", "#0072ff"], angle: 120 },
  { id: "cosmic-fusion", label: "Cosmic fusion", stops: ["#ff00cc", "#333399"] },
  { id: "snapchat", label: "Sunny", stops: ["#fffc00", "#ffffff"], angle: 180 },
  { id: "ed-sunset", label: "Ed's sunset", stops: ["#355c7d", "#6c5b7b", "#c06c84"] },
  { id: "brady", label: "Brady", stops: ["#4568dc", "#b06ab3"] },
  { id: "back-to-earth", label: "Back to earth", stops: ["#00c9ff", "#92fe9d"] },
  { id: "deep-purple", label: "Deep purple", stops: ["#673ab7", "#512da8"] },
  { id: "little-leaf", label: "Little leaf", stops: ["#76b852", "#8dc26f"] },
  { id: "netflix", label: "Crimson", stops: ["#8e0e00", "#1f1c18"] },
  { id: "light-orange", label: "Light orange", stops: ["#ffb75e", "#ed8f03"] },
  { id: "green-beach", label: "Green beach", stops: ["#02aab0", "#00cdac"] },
  { id: "intuitive-purple", label: "Intuitive purple", stops: ["#da22ff", "#9733ee"] },
  { id: "emerald-water", label: "Emerald water", stops: ["#348f50", "#56b4d3"] },
  { id: "lemon-twist", label: "Lemon twist", stops: ["#3ca55c", "#b5ac49"] },
  { id: "horizon", label: "Horizon", stops: ["#003973", "#e5e5be"] },
  { id: "rose-water", label: "Rose water", stops: ["#e55d87", "#5fc3e4"] },
  { id: "frozen", label: "Frozen", stops: ["#403b4a", "#e7e9bb"] },
  { id: "mango-pulp2", label: "Golden hour", stops: ["#f09819", "#edde5d"], angle: 120 },
  { id: "sunrise2", label: "Amber sun", stops: ["#ff512f", "#f09819"] },
];
const GRADIENTS: BgPreset[] = GRAD_PALETTES.map((p) => ({ id: p.id, label: p.label, group: "gradient", css: gradCss(p) }));

// ── Mesh palettes → generated presets ──
const MESH_PALETTES: { id: string; label: string; a: string; b: string; c: string; base: string }[] = [
  { id: "sunrise", label: "Sunrise", a: "#ffb199", b: "#ff0844", c: "#ffcc70", base: "#ff7e5f" },
  { id: "lagoon", label: "Lagoon", a: "#00dbde", b: "#16a085", c: "#0083b0", base: "#00b4db" },
  { id: "orchid", label: "Orchid", a: "#c471f5", b: "#fa71cd", c: "#7873f5", base: "#b06ab3" },
  { id: "citrus", label: "Citrus", a: "#f9d423", b: "#ff4e50", c: "#f9d423", base: "#ff8008" },
  { id: "arctic", label: "Arctic", a: "#a1c4fd", b: "#c2e9fb", c: "#d4fc79", base: "#a1c4fd" },
  { id: "berry", label: "Berry", a: "#ff6a88", b: "#a044ff", c: "#6a3093", base: "#a044ff" },
  { id: "meadow", label: "Meadow", a: "#b2fefa", b: "#43e97b", c: "#38f9d7", base: "#43e97b" },
  { id: "dusk", label: "Dusk", a: "#4b6cb7", b: "#182848", c: "#6a11cb", base: "#2b5876" },
  { id: "cotton", label: "Cotton candy", a: "#fbc2eb", b: "#a6c1ee", c: "#fbc2eb", base: "#a6c1ee" },
  { id: "ember", label: "Ember", a: "#f83600", b: "#fe8c00", c: "#f83600", base: "#fe8c00" },
  { id: "nebula", label: "Nebula", a: "#7f00ff", b: "#e100ff", c: "#00d2ff", base: "#3a1c71" },
  { id: "coral", label: "Coral", a: "#ff9a9e", b: "#fecfef", c: "#ff6a88", base: "#ff9a9e" },
  { id: "jade", label: "Jade", a: "#43e97b", b: "#38f9d7", c: "#0ba360", base: "#3cba92" },
  { id: "grapefruit", label: "Grapefruit", a: "#fc5c7d", b: "#6a82fb", c: "#fc5c7d", base: "#6a82fb" },
  { id: "peacock", label: "Peacock", a: "#00c3ff", b: "#ffff1c", c: "#00c3ff", base: "#0575e6" },
  { id: "candyfloss", label: "Candyfloss", a: "#ff9a9e", b: "#fecfef", c: "#a18cd1", base: "#fbc2eb" },
  { id: "deep-sea", label: "Deep sea", a: "#2c3e50", b: "#4ca1af", c: "#2c3e50", base: "#3a6073" },
  { id: "flare", label: "Flare", a: "#f12711", b: "#f5af19", c: "#f12711", base: "#f5af19" },
  { id: "iris", label: "Iris", a: "#ec008c", b: "#fc6767", c: "#ec008c", base: "#7b4397" },
  { id: "spruce", label: "Spruce", a: "#134e5e", b: "#71b280", c: "#134e5e", base: "#3b7a57" },
  { id: "aurora", label: "Aurora", a: "#00c9ff", b: "#92fe9d", c: "#00c9ff", base: "#0cebeb" },
  { id: "twilight2", label: "Twilight", a: "#0f0c29", b: "#302b63", c: "#24243e", base: "#302b63" },
  { id: "cosmic", label: "Cosmic", a: "#ff00cc", b: "#333399", c: "#ff00cc", base: "#333399" },
  { id: "candy2", label: "Bubblegum", a: "#fc466b", b: "#3f5efb", c: "#fc466b", base: "#3f5efb" },
  { id: "sunbeam", label: "Sunbeam", a: "#fceabb", b: "#f8b500", c: "#fceabb", base: "#f8b500" },
  { id: "moss", label: "Moss", a: "#2af598", b: "#009efd", c: "#2af598", base: "#134e5e" },
  { id: "plum2", label: "Plum", a: "#c94b4b", b: "#4b134f", c: "#c94b4b", base: "#4b134f" },
  { id: "reef", label: "Reef", a: "#00d2ff", b: "#3a47d5", c: "#00d2ff", base: "#3a47d5" },
  { id: "fireice", label: "Fire & ice", a: "#ff512f", b: "#1e3c72", c: "#ff512f", base: "#2a5298" },
  { id: "peachy", label: "Peachy", a: "#ee9ca7", b: "#ffdde1", c: "#ee9ca7", base: "#ffdde1" },
  { id: "royal2", label: "Royal", a: "#141e30", b: "#243b55", c: "#141e30", base: "#243b55" },
  { id: "seafoam", label: "Seafoam", a: "#a8ff78", b: "#78ffd6", c: "#a8ff78", base: "#78ffd6" },
  { id: "flare2", label: "Solar", a: "#f12711", b: "#f5af19", c: "#f12711", base: "#f5af19" },
];
// NB: the base MUST be a gradient layer, not a bare colour — a bare colour is an invalid background-image
// value and would blank the ENTIRE layered background. `linear-gradient(base, base)` = a valid solid fill.
const meshCss = (m: { a: string; b: string; c: string; base: string }) =>
  `radial-gradient(at 18% 20%, ${m.a} 0px, transparent 50%), radial-gradient(at 82% 12%, ${m.b} 0px, transparent 50%), radial-gradient(at 50% 92%, ${m.c} 0px, transparent 50%), radial-gradient(at 12% 80%, ${m.a} 0px, transparent 45%), linear-gradient(${m.base}, ${m.base})`;
const MESH: BgPreset[] = MESH_PALETTES.map((m) => ({ id: `mesh-${m.id}`, label: m.label, group: "mesh", css: meshCss(m) }));

// ── Patterns (need a tile size; use currentColor → re-theme with the block's colour) ──
// IMPORTANT: every `css` must be a pure comma-separated list of GRADIENTS (valid background-image). Positions
// go INSIDE gradients via `at X Y`; NEVER use background-shorthand position/size tokens (e.g. `… 12px 12px`
// or `/ 8px 8px`) — those are invalid in background-image and blank the whole background. `bgTile` sizes them.
export const PATTERNS: BgPreset[] = [
  { id: "dots", label: "Dots", group: "pattern", tile: "20px 20px", css: "radial-gradient(currentColor 1.5px, transparent 1.6px)" },
  { id: "dots-lg", label: "Big dots", group: "pattern", tile: "32px 32px", css: "radial-gradient(currentColor 2.5px, transparent 2.6px)" },
  { id: "dots-sm", label: "Fine dots", group: "pattern", tile: "12px 12px", css: "radial-gradient(currentColor 1px, transparent 1.1px)" },
  { id: "dot-grid", label: "Dot grid", group: "pattern", tile: "24px 24px", css: "radial-gradient(circle at 0 0, currentColor 1.5px, transparent 1.6px), radial-gradient(circle at 12px 12px, currentColor 1.5px, transparent 1.6px)" },
  { id: "confetti", label: "Confetti", group: "pattern", tile: "26px 26px", css: "radial-gradient(circle at 4px 4px, currentColor 2px, transparent 2.5px), radial-gradient(circle at 17px 17px, currentColor 2px, transparent 2.5px)" },
  { id: "grid", label: "Grid", group: "pattern", tile: "24px 24px", css: "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)" },
  { id: "grid-sm", label: "Fine grid", group: "pattern", tile: "12px 12px", css: "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)" },
  { id: "grid-lg", label: "Bold grid", group: "pattern", tile: "44px 44px", css: "linear-gradient(currentColor 1.5px, transparent 1.5px), linear-gradient(90deg, currentColor 1.5px, transparent 1.5px)" },
  { id: "lines-h", label: "Lines", group: "pattern", tile: "100% 10px", css: "linear-gradient(currentColor 1px, transparent 1px)" },
  { id: "lines-v", label: "Columns", group: "pattern", tile: "10px 100%", css: "linear-gradient(90deg, currentColor 1px, transparent 1px)" },
  { id: "lines-thick", label: "Thick lines", group: "pattern", tile: "100% 16px", css: "linear-gradient(currentColor 2px, transparent 2px)" },
  { id: "ribs", label: "Ribs", group: "pattern", tile: "12px 100%", css: "repeating-linear-gradient(90deg, currentColor 0, currentColor 2px, transparent 2px, transparent 12px)" },
  { id: "diagonal", label: "Diagonal", group: "pattern", tile: "16px 16px", css: "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)" },
  { id: "diagonal-wide", label: "Stripes", group: "pattern", tile: "40px 40px", css: "repeating-linear-gradient(45deg, currentColor 0, currentColor 2px, transparent 0, transparent 50%)" },
  { id: "diagonal-rev", label: "Back stripes", group: "pattern", tile: "24px 24px", css: "repeating-linear-gradient(-45deg, currentColor 0, currentColor 2px, transparent 0, transparent 50%)" },
  { id: "crosshatch", label: "Crosshatch", group: "pattern", tile: "20px 20px", css: "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%), repeating-linear-gradient(-45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)" },
  { id: "grid-diagonal", label: "Woven", group: "pattern", tile: "28px 28px", css: "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px), repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)" },
  { id: "checker", label: "Checkerboard", group: "pattern", tile: "32px 32px", css: "conic-gradient(currentColor 90deg, transparent 90deg 180deg, currentColor 180deg 270deg, transparent 270deg)" },
  { id: "checker-sm", label: "Fine checker", group: "pattern", tile: "16px 16px", css: "conic-gradient(currentColor 90deg, transparent 90deg 180deg, currentColor 180deg 270deg, transparent 270deg)" },
  { id: "zigzag", label: "Zigzag", group: "pattern", tile: "20px 20px", css: "linear-gradient(135deg, currentColor 25%, transparent 25%), linear-gradient(225deg, currentColor 25%, transparent 25%)" },
  { id: "triangles", label: "Triangles", group: "pattern", tile: "20px 20px", css: "linear-gradient(60deg, currentColor 25%, transparent 25.5%), linear-gradient(-60deg, currentColor 25%, transparent 25.5%)" },
  { id: "diamonds", label: "Diamonds", group: "pattern", tile: "24px 24px", css: "linear-gradient(135deg, currentColor 25%, transparent 25%), linear-gradient(225deg, currentColor 25%, transparent 25%), linear-gradient(45deg, currentColor 25%, transparent 25%), linear-gradient(315deg, currentColor 25%, transparent 25%)" },
  { id: "waves", label: "Waves", group: "pattern", tile: "40px 20px", css: "radial-gradient(circle at 10px -6px, transparent 12px, currentColor 12px, currentColor 13px, transparent 13px)" },
  { id: "scales", label: "Scales", group: "pattern", tile: "40px 20px", css: "radial-gradient(circle at 50% 100%, transparent 9px, currentColor 9px, currentColor 10px, transparent 10px)" },
  { id: "isometric", label: "Isometric", group: "pattern", tile: "28px 48px", css: "linear-gradient(30deg, currentColor 12%, transparent 12.5%, transparent 87%, currentColor 87.5%, currentColor), linear-gradient(150deg, currentColor 12%, transparent 12.5%, transparent 87%, currentColor 87.5%, currentColor)" },
];

export const BG_PRESETS: BgPreset[] = [...THEMED, ...GRADIENTS, ...MESH, ...PATTERNS];

export { GRADIENTS, MESH };

export const BG_GROUPS: { id: BgPreset["group"] | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "themed", label: "Themed" },
  { id: "gradient", label: "Gradients" },
  { id: "mesh", label: "Mesh" },
  { id: "pattern", label: "Patterns" },
];

/** Browse filters shown in the picker — structural (by kind) + thematic (by mood). */
export type BgCategory = { id: string; label: string; match: (p: BgPreset) => boolean };
export const BG_CATEGORIES: BgCategory[] = [
  { id: "all", label: "All", match: () => true },
  { id: "themed", label: "Themed", match: (p) => p.group === "themed" },
  { id: "gradient", label: "Gradients", match: (p) => p.group === "gradient" },
  { id: "mesh", label: "Mesh", match: (p) => p.group === "mesh" },
  { id: "pattern", label: "Patterns", match: (p) => p.group === "pattern" },
  { id: "warm", label: "Warm", match: (p) => /sunset|peach|mango|candy|ember|citrus|coral|flamingo|cherry|blush|rose|sunrise|orchid|berry|flame|warm|juicy|passion|lips|sunny|amy|fruit|malin|apple|lemon|flare|iris|glow|red|orange|grapefruit/.test(p.id) },
  { id: "cool", label: "Cool", match: (p) => /ocean|aqua|sky|teal|arctic|lagoon|twilight|midnight|deep|slate|emerald|forest|meadow|mint|lime|dusk|royal|grape|violet|aurora|blue|azure|neva|winter|frozen|sea|river|jade|spruce|peacock|cool|morpheus|moon|wind/.test(p.id) },
  { id: "dark", label: "Dark", match: (p) => /midnight|twilight|deep|dusk|forest|royal|grape|slate|moonlit|dark|sin-city|nebula|purple-love|electric|le-cocktail/.test(p.id) },
  { id: "light", label: "Light", match: (p) => /paper|blush|cotton|mint|peach|sky|arctic|candy|surface|rare|heavy-rain|saint|everlasting|blessing|above|frozen|winter|ladoga|confident/.test(p.id) },
  { id: "vibrant", label: "Vibrant", match: (p) => p.group === "mesh" || /sunset|cherry|flamingo|candy|aurora|ember|citrus|berry|coral|mango|jshine|megatron|retrowave|rainbow|conic|hidden-jaguar|flare|iris/.test(p.id) },
];

export function bgPresetById(id?: string): BgPreset | undefined {
  return id ? BG_PRESETS.find((p) => p.id === id) : undefined;
}
