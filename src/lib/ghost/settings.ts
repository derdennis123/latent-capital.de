import { ghostFetch } from "@/lib/ghost/client";
import type { GhostSettings, GhostSettingsResponse } from "@/lib/ghost/types";

export async function getSettings(): Promise<GhostSettings> {
  const response = await ghostFetch<GhostSettingsResponse>("settings");

  return response.settings;
}
