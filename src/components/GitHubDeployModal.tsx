import React, { useState } from "react";
import {
  Github,
  Server,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink,
  Code2,
  Terminal,
  Cloud,
  Check,
} from "lucide-react";
import { getServerStatus } from "@/lib/api";

interface GitHubDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GitHubDeployModal({ isOpen, onClose }: GitHubDeployModalProps) {
  const [activeTab, setActiveTab] = useState<"diagnosis" | "actions" | "node">("diagnosis");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const isServerLive = getServerStatus();

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const gitCommands = `# 1. Clone or connect to your existing GitHub repository
cd /path/to/your/repo
git remote -v
# Ensure remote points to: https://github.com/prxtyushaggarwal/Grahraksha.git

# 2. Build the production static distribution
npm install
npm run build

# 3. Commit and push changes
git add .
git commit -m "feat: Complete SIH26001 GrahRaksha Suite with 3D Cesium & Dual-Engine Fallback"
git branch -M main
git push -u origin main`;

  const githubActionWorkflow = `name: Deploy GrahRaksha to GitHub Pages

on:
  push:
    branches: [ "main" ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-800 text-white border border-slate-700 shadow-inner">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">GitHub Host & Deployment Bridge</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  prxtyushaggarwal.github.io/Grahraksha
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Fixing static GitHub Pages server limitations and synchronizing the full application
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 text-xs px-4">
          <button
            onClick={() => setActiveTab("diagnosis")}
            className={`py-3 px-4 font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "diagnosis"
                ? "border-cyan-500 text-cyan-400 bg-slate-900/60"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            Diagnosis & Architecture Fix
          </button>
          <button
            onClick={() => setActiveTab("actions")}
            className={`py-3 px-4 font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "actions"
                ? "border-cyan-500 text-cyan-400 bg-slate-900/60"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            GitHub Pages CI/CD Workflow
          </button>
          <button
            onClick={() => setActiveTab("node")}
            className={`py-3 px-4 font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "node"
                ? "border-cyan-500 text-cyan-400 bg-slate-900/60"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            Full-Stack Node Hosting (Vercel/Render)
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-sm">
          {activeTab === "diagnosis" && (
            <div className="space-y-4">
              {/* Root Cause Card */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-amber-300">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  Why the original GitHub Pages site was failing:
                </div>
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  <strong>GitHub Pages is strictly a static file web host</strong> (serves HTML, CSS, JS). It cannot execute Node.js Express server routes (like <code className="bg-amber-950 px-1 py-0.5 rounded text-amber-300">/api/ml/predict</code>, <code className="bg-amber-950 px-1 py-0.5 rounded text-amber-300">/api/alerts/subscribe</code>, or Gemini backend keys). Therefore, interactive tools on static GitHub Pages would encounter <code className="bg-amber-950 px-1 py-0.5 rounded text-amber-300">404 Not Found</code> errors.
                </p>
              </div>

              {/* Solution Card */}
              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-slate-200 space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm text-cyan-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  How we solved it: Dual-Engine Universal Architecture
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    <span className="font-bold text-cyan-400 block mb-1">1. Static Fallback Engine</span>
                    When deployed to GitHub Pages, the app automatically switches to the in-browser Mathematical ML Engine (Random Forest, XGBoost, Terrain CNN, and Weather LSTM weights computed locally in TypeScript) with zero 404 errors!
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    <span className="font-bold text-emerald-400 block mb-1">2. Full-Stack Node Proxy</span>
                    When deployed on Cloud Run, Render, or Railway, the app seamlessly proxies requests to the Express backend with persistent storage and live Gemini AI analysis.
                  </div>
                </div>
              </div>

              {/* Current Status Indicator */}
              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-300">Current Execution Mode:</span>
                <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  {isServerLive ? "Full-Stack Express + Client Engine Ready" : "Standalone Universal Client Engine"}
                </span>
              </div>

              {/* Quick Git Push Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    Quick Terminal Commands to Update Your Repo:
                  </span>
                  <button
                    onClick={() => copyToClipboard(gitCommands, "git")}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === "git" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedKey === "git" ? "Copied" : "Copy"}
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-cyan-200 overflow-x-auto leading-relaxed">
                  {gitCommands}
                </pre>
              </div>
            </div>
          )}

          {activeTab === "actions" && (
            <div className="space-y-4">
              <div className="text-xs text-slate-300 space-y-2">
                <p>
                  To make your GitHub Pages site auto-update whenever you push to{" "}
                  <code className="bg-slate-800 px-1 py-0.5 rounded text-cyan-300">main</code>, add this file to your repository at:
                </p>
                <code className="block bg-slate-950 p-2 rounded border border-slate-800 font-mono text-cyan-300 text-xs">
                  .github/workflows/deploy.yml
                </code>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    GitHub Actions Deployment Workflow:
                  </span>
                  <button
                    onClick={() => copyToClipboard(githubActionWorkflow, "workflow")}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === "workflow" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedKey === "workflow" ? "Copied" : "Copy Workflow"}
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-64 leading-relaxed">
                  {githubActionWorkflow}
                </pre>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/60 text-xs text-slate-300 space-y-1.5">
                <div className="font-bold text-cyan-400">Settings on GitHub:</div>
                <div>1. Go to your repository on GitHub: <a href="https://github.com/prxtyushaggarwal/Grahraksha/settings/pages" target="_blank" rel="noreferrer" className="text-cyan-400 underline inline-flex items-center gap-1">Settings &gt; Pages <ExternalLink className="w-3 h-3" /></a></div>
                <div>2. Under <strong>Build and deployment &gt; Source</strong>, choose <strong>GitHub Actions</strong>.</div>
                <div>3. Push your code! GitHub will automatically run the workflow and publish the site.</div>
              </div>
            </div>
          )}

          {activeTab === "node" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                If you want live server-side capabilities (real-time SMS dispatches via Twilio, Gemini LLM API calls, persistent multi-user databases), deploy this full-stack project to one of these free Node hosting platforms:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-white text-xs flex items-center justify-between">
                    <span>Render</span>
                    <span className="text-[10px] text-emerald-400 font-normal">Free Tier</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Connect repo as Web Service. Build: <code className="text-cyan-300">npm run build</code>. Start: <code className="text-cyan-300">node dist/server.cjs</code>.
                  </p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-white text-xs flex items-center justify-between">
                    <span>Railway</span>
                    <span className="text-[10px] text-emerald-400 font-normal">One-Click</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Auto-detects Dockerfile/Node. Supports persistent environment variables and custom domains.
                  </p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-white text-xs flex items-center justify-between">
                    <span>Vercel / Cloud Run</span>
                    <span className="text-[10px] text-emerald-400 font-normal">Serverless</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Can deploy standard static frontend to Vercel and backend Express container to Google Cloud Run.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Target Host: <strong className="text-cyan-300">https://prxtyushaggarwal.github.io/Grahraksha/</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
