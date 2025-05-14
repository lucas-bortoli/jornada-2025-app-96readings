import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { execSync } from "node:child_process";
import { defineConfig } from "vite";
import vitePluginSvgr from "vite-plugin-svgr";

const branchName = execSync("git rev-parse --abbrev-ref HEAD").toString().trimEnd();
const commitHash = execSync("git rev-parse HEAD").toString().trimEnd();
const upstreamUrl = execSync("git config --get remote.origin.url")
  .toString()
  .replace(".git", "")
  .trimEnd();

process.env.VITE_GIT_BRANCH_NAME = branchName;
process.env.VITE_GIT_COMMIT_HASH = commitHash;
process.env.VITE_GIT_UPSTREAM_URL = upstreamUrl;
process.env.VITE_BUILD_DATE = Date.now().toString();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), vitePluginSvgr(), tailwindcss()],
});
