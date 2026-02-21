import { getTenantById } from "@/lib/mockTenants";
import type { TranslationProvider, TenantTranslationConfig } from "@/types/school";

export const runtime = "nodejs";

interface TranslateRequestBody {
  text: string;
  from?: string; // BCP-47 or primary subtag, e.g. "en", "am", "en-US"
  to: string; // BCP-47 or primary subtag
  tenantId?: string;
  provider?: TranslationProvider;
}

function primary(tag: string | undefined): string {
  const t = (tag || "").trim();
  if (!t) return "";
  return t.split("-")[0].toLowerCase();
}

function toDeepLTarget(tag: string): string | null {
  // DeepL target language codes:
  // https://www.deepl.com/docs-api/translate-text/translate-text
  const t = (tag || "").toLowerCase();
  if (!t) return null;

  // Handle common regional variants.
  if (t === "en-gb") return "EN-GB";
  if (t === "en-us") return "EN-US";
  if (t === "pt-br") return "PT-BR";
  if (t === "pt-pt") return "PT-PT";

  const p = primary(t).toUpperCase();
  const supported = new Set([
    "BG",
    "CS",
    "DA",
    "DE",
    "EL",
    "EN",
    "ES",
    "ET",
    "FI",
    "FR",
    "HU",
    "ID",
    "IT",
    "JA",
    "KO",
    "LT",
    "LV",
    "NB",
    "NL",
    "PL",
    "PT",
    "RO",
    "RU",
    "SK",
    "SL",
    "SV",
    "TR",
    "UK",
    "ZH",
  ]);
  return supported.has(p) ? p : null;
}

function toDeepLSource(tag: string): string | null {
  // DeepL source language codes are typically the base code.
  const p = primary(tag).toUpperCase();
  if (!p) return null;
  const supported = new Set([
    "BG",
    "CS",
    "DA",
    "DE",
    "EL",
    "EN",
    "ES",
    "ET",
    "FI",
    "FR",
    "HU",
    "ID",
    "IT",
    "JA",
    "KO",
    "LT",
    "LV",
    "NB",
    "NL",
    "PL",
    "PT",
    "RO",
    "RU",
    "SK",
    "SL",
    "SV",
    "TR",
    "UK",
    "ZH",
  ]);
  return supported.has(p) ? p : null;
}

async function translateWithDeepL(
  text: string,
  from: string,
  to: string,
  authKey: string
): Promise<string | null> {
  const targetLang = toDeepLTarget(to);
  if (!targetLang) return null;

  const params = new URLSearchParams();
  params.set("auth_key", authKey);
  params.set("text", text);
  params.set("target_lang", targetLang);

  const sourceLang = toDeepLSource(from);
  if (sourceLang) params.set("source_lang", sourceLang);

  const res = await fetch("https://api-free.deepl.com/v2/translate", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: params.toString(),
    cache: "no-store",
  });
  if (!res.ok) return null;

  const data = (await res.json()) as { translations?: Array<{ text?: string }> };
  const out = (data.translations?.[0]?.text || "").trim();
  return out || null;
}

async function translateWithGoogle(text: string, from: string, to: string): Promise<string | null> {
  // Unofficial but widely used endpoint; returns nested arrays.
  const sl = from || "auto";
  const tl = to;
  const url =
    `https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=${encodeURIComponent(sl)}` +
    `&tl=${encodeURIComponent(tl)}&q=${encodeURIComponent(text)}`;

  const res = await fetch(url, { method: "GET", cache: "no-store" });
  if (!res.ok) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await res.json();
  const parts = Array.isArray(data?.[0]) ? data[0] : null;
  if (!parts) return null;
  const out = parts
    // each part looks like: [translated, original, ...]
    .map((p: unknown) => (Array.isArray(p) ? String(p[0] ?? "") : ""))
    .join("");
  return out.trim() ? out : null;
}

async function translateWithGoogleCloud(
  text: string,
  from: string,
  to: string,
  apiKey: string
): Promise<string | null> {
  // Official Google Cloud Translation API v2 (paid)
  const url = `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(apiKey)}`;
  const body: Record<string, unknown> = {
    q: text,
    target: to || "en",
    format: "text",
  };
  if (from) body.source = from;

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) return null;

  const data = (await res.json()) as {
    data?: { translations?: Array<{ translatedText?: string }> };
  };
  const out = (data.data?.translations?.[0]?.translatedText || "").trim();
  return out || null;
}

async function translateWithMyMemory(text: string, from: string, to: string): Promise<string | null> {
  const langpair = `${from || "en"}|${to || "en"}`;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(
    langpair
  )}`;
  const res = await fetch(url, { method: "GET", cache: "no-store" });
  if (!res.ok) return null;
  const data = (await res.json()) as { responseData?: { translatedText?: string } };
  const t = (data.responseData?.translatedText || "").trim();
  return t || null;
}

function resolveTenantTranslationConfig(tenantId: string | undefined): {
  enabled: boolean;
  config: TenantTranslationConfig | null;
} {
  if (!tenantId) return { enabled: true, config: null };
  const tenant = getTenantById(tenantId);
  if (!tenant) return { enabled: true, config: null };
  const cfg = tenant.config.translation;
  if (!cfg) return { enabled: true, config: null };
  return { enabled: Boolean(cfg.enabled), config: cfg };
}

function pickProviders(cfg: TenantTranslationConfig | null): TranslationProvider[] {
  // Use tenant-selected primary engine first, then fall back.
  if (!cfg) return ["deepl", "google-cloud", "google"];
  const allowed = (cfg.allowedProviders || []).filter(
    (p) => p === "deepl" || p === "google-cloud" || p === "google"
  );
  if (allowed.length === 0) return [];
  const hasGoogle = allowed.includes("google");
  const primaryCandidates = allowed.filter((p) => p !== "google");
  const preferredPrimary =
    (cfg.defaultProvider !== "google" && primaryCandidates.includes(cfg.defaultProvider))
      ? cfg.defaultProvider
      : primaryCandidates[0];

  const order: TranslationProvider[] = [];
  if (preferredPrimary) order.push(preferredPrimary);
  for (const p of primaryCandidates) {
    if (p !== preferredPrimary) order.push(p);
  }
  if (hasGoogle) order.push("google"); // always last fallback
  return order;
}

export async function POST(req: Request) {
  let body: TranslateRequestBody | null = null;
  try {
    body = (await req.json()) as TranslateRequestBody;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const text = (body?.text || "").trim();
  const to = primary(body?.to);
  const from = primary(body?.from);
  const tenantId = (body?.tenantId || "").trim() || undefined;

  if (!text) return Response.json({ translatedText: "" }, { status: 200 });
  if (!to) return Response.json({ error: "`to` is required" }, { status: 400 });

  const deeplKey = process.env.DEEPL_AUTH_KEY || "";
  const googleCloudKey = process.env.GOOGLE_CLOUD_TRANSLATE_API_KEY || "";

  const { enabled, config } = resolveTenantTranslationConfig(tenantId);
  if (!enabled) {
    return Response.json({ error: "Translation disabled for tenant" }, { status: 403 });
  }

  const baseOrder = pickProviders(config);
  const requested =
    body?.provider === "deepl" || body?.provider === "google-cloud" || body?.provider === "google"
      ? body.provider
      : null;
  const providerOrder =
    requested && baseOrder.includes(requested)
      ? [requested, ...baseOrder.filter((p) => p !== requested)]
      : baseOrder;
  if (config && providerOrder.length === 0) {
    return Response.json({ error: "No translation providers allowed for tenant" }, { status: 403 });
  }

  for (const p of providerOrder.length ? providerOrder : (["deepl", "google-cloud", "google"] as const)) {
    if (p === "deepl") {
      if (!deeplKey) continue;
      const deepl = await translateWithDeepL(text, body?.from || "", body?.to || "", deeplKey);
      if (deepl) return Response.json({ translatedText: deepl, provider: "deepl" }, { status: 200 });
      continue;
    }
    if (p === "google-cloud") {
      if (!googleCloudKey) continue;
      const gc = await translateWithGoogleCloud(text, from, to, googleCloudKey);
      if (gc) return Response.json({ translatedText: gc, provider: "google-cloud" }, { status: 200 });
      continue;
    }
    if (p === "google") {
      const google = await translateWithGoogle(text, from, to);
      if (google) return Response.json({ translatedText: google, provider: "google" }, { status: 200 });
      continue;
    }
  }

  const mm = await translateWithMyMemory(text, from || "en", to);
  if (mm) return Response.json({ translatedText: mm, provider: "mymemory" }, { status: 200 });

  return Response.json({ error: "Translation failed" }, { status: 502 });
}

