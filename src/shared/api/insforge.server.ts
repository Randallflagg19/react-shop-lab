import "server-only";
import { createClient } from "@insforge/sdk";

const baseUrl = process.env.INSFORGE_URL;
const anonKey = process.env.INSFORGE_ANON_KEY;

if (!baseUrl || !anonKey) {
  throw new Error("Server InsForge URL or anon key is not defined");
}

export const insforgeServer = createClient({
  baseUrl,
  anonKey,
});
