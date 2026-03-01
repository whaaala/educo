/**
 * Supabase Bucket Setup API
 *
 * POST /api/storage/supabase/setup
 * Creates a per-tenant Supabase Storage bucket.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY (server-side only) because
 * the anon key cannot create buckets.
 *
 * This is called once when storage is first accessed for a tenant,
 * or during tenant creation. It is idempotent — safe to call multiple times.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const { tenantId } = await request.json();

    if (!tenantId) {
      return NextResponse.json(
        { error: "tenantId is required" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Supabase server configuration missing. Set SUPABASE_SERVICE_ROLE_KEY." },
        { status: 500 }
      );
    }

    // Use service role key for admin operations (bucket creation)
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const bucketName = `tenant-${tenantId}`;

    const { error } = await supabaseAdmin.storage.createBucket(bucketName, {
      public: false,
      fileSizeLimit: 150 * 1024 * 1024, // 150MB per file max
    });

    if (error) {
      // Bucket already exists — not an error
      if (error.message?.includes("already exists")) {
        return NextResponse.json({
          bucket: bucketName,
          created: false,
          message: "Bucket already exists",
        });
      }

      return NextResponse.json(
        { error: `Failed to create bucket: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      bucket: bucketName,
      created: true,
      message: `Bucket "${bucketName}" created successfully`,
    });
  } catch (err) {
    console.error("Supabase bucket setup error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
