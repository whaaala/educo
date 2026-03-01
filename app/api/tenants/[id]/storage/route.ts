import { getTenantById, updateTenant } from "@/lib/mockTenants";
import type { TenantStorageConfig, StorageProviderType } from "@/types/school";

export const runtime = "nodejs";

const VALID_PROVIDERS: StorageProviderType[] = ["supabase", "dropbox", "google-drive", "onedrive", "local"];
const VALID_CONFIG_MODES = ["platform", "tenant"] as const;

function normalizeConfig(
  input: unknown,
  current?: TenantStorageConfig
): TenantStorageConfig {
  const base: TenantStorageConfig = current || {
    enabled: true,
    provider: "supabase",
    configMode: "platform",
  };

  if (!input || typeof input !== "object") return base;
  const obj = input as Record<string, unknown>;

  const enabled = typeof obj.enabled === "boolean" ? obj.enabled : base.enabled;

  const provider: StorageProviderType = VALID_PROVIDERS.includes(obj.provider as StorageProviderType)
    ? (obj.provider as StorageProviderType)
    : base.provider;

  const configMode = VALID_CONFIG_MODES.includes(obj.configMode as "platform" | "tenant")
    ? (obj.configMode as "platform" | "tenant")
    : base.configMode;

  const userQuotaMb = typeof obj.userQuotaMb === "number" && obj.userQuotaMb >= 0
    ? obj.userQuotaMb
    : base.userQuotaMb;

  const rootFolderTemplate = typeof obj.rootFolderTemplate === "string"
    ? obj.rootFolderTemplate
    : base.rootFolderTemplate;

  const dropboxOverflowEnabled = typeof obj.dropboxOverflowEnabled === "boolean"
    ? obj.dropboxOverflowEnabled
    : base.dropboxOverflowEnabled;

  const supabaseBucketName = typeof obj.supabaseBucketName === "string"
    ? obj.supabaseBucketName
    : base.supabaseBucketName;

  return {
    enabled,
    provider,
    configMode,
    userQuotaMb,
    rootFolderTemplate,
    dropboxOverflowEnabled,
    supabaseBucketName,
  };
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const tenant = getTenantById(id);
  if (!tenant) return Response.json({ error: "Tenant not found" }, { status: 404 });
  return Response.json(
    { tenantId: tenant.id, storage: tenant.config.storage || null },
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

  const next = normalizeConfig((body as Record<string, unknown>)?.storage, tenant.config.storage);
  const updated = updateTenant(id, {
    config: {
      ...tenant.config,
      storage: next,
    },
  });

  return Response.json(
    { tenantId: updated?.id || id, storage: updated?.config.storage || next },
    { status: 200 }
  );
}
