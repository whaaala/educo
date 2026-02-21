import { getTenantById, updateTenant } from "@/lib/mockTenants";
import type { TenantTranslationConfig, TranslationProvider } from "@/types/school";

export const runtime = "nodejs";

function normalizeProviders(input: unknown): TranslationProvider[] {
  if (!Array.isArray(input)) return [];
  const out: TranslationProvider[] = [];
  for (const v of input) {
    if (v === "deepl" || v === "google" || v === "google-cloud") out.push(v);
  }
  return Array.from(new Set(out));
}

function normalizeConfig(input: unknown, current?: TenantTranslationConfig): TenantTranslationConfig {
  const base: TenantTranslationConfig = current || {
    enabled: false,
    allowedProviders: ["deepl", "google", "google-cloud"],
    defaultProvider: "deepl",
  };

  if (!input || typeof input !== "object") return base;
  const obj = input as Record<string, unknown>;

  const enabled = typeof obj.enabled === "boolean" ? obj.enabled : base.enabled;
  const allowedProviders = normalizeProviders(obj.allowedProviders ?? base.allowedProviders);
  const safeAllowed: TranslationProvider[] = allowedProviders.length
    ? allowedProviders
    : ["google"];

  const dp = obj.defaultProvider;
  const requested: TranslationProvider =
    dp === "deepl" || dp === "google-cloud" || dp === "google"
      ? dp
      : base.defaultProvider;

  // Unofficial Google should never be selected as primary unless it's the only option.
  const defaultProvider: TranslationProvider =
    requested === "google"
      ? safeAllowed.includes("deepl")
        ? "deepl"
        : safeAllowed.includes("google-cloud")
          ? "google-cloud"
          : "google"
      : safeAllowed.includes(requested)
        ? requested
        : safeAllowed.includes("deepl")
          ? "deepl"
          : safeAllowed.includes("google-cloud")
            ? "google-cloud"
            : safeAllowed[0];

  return {
    enabled,
    allowedProviders: safeAllowed,
    defaultProvider,
  };
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const tenant = getTenantById(id);
  if (!tenant) return Response.json({ error: "Tenant not found" }, { status: 404 });
  return Response.json(
    { tenantId: tenant.id, translation: tenant.config.translation || null },
    { status: 200 }
  );
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const tenant = getTenantById(id);
  if (!tenant) return Response.json({ error: "Tenant not found" }, { status: 404 });

  let body: unknown = null;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const next = normalizeConfig((body as any)?.translation, tenant.config.translation);
  const updated = updateTenant(id, {
    config: {
      ...tenant.config,
      translation: next,
    },
  });

  return Response.json(
    { tenantId: updated?.id || id, translation: updated?.config.translation || next },
    { status: 200 }
  );
}

