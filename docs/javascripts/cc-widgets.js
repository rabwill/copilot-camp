/**
 * cc-widgets.js  —  Copilot Camp lab UI widgets
 * Drop into: docs/javascripts/cc-widgets.js
 * Add to mkdocs.yml extra_javascript: [javascripts/cc-widgets.js]
 *
 * HOW IT WORKS
 * ────────────
 * MkDocs Material uses instant navigation (XHR page swaps). Inline <script>
 * tags in markdown DO NOT re-run after navigation. So instead of calling
 * widget functions from inline scripts, we read configuration from
 * data-* attributes on placeholder <div>s, then render them.
 *
 * The render pass is triggered:
 *   1. On initial DOMContentLoaded
 *   2. On every MkDocs instant-navigation via document$.subscribe()
 *
 * USAGE IN MARKDOWN
 * ─────────────────
 * Place a single <div> with data-widget="name" and data-* config attrs.
 * No <script> tags needed anywhere.
 *
 * ─── WIDGET REFERENCE ────────────────────────────────────────────────────
 *
 * Hero:
 *   <div data-widget="hero"
 *        data-badge="Prerequisites · Lab E0+"
 *        data-badge-color="amber"
 *        data-icon="🔧"
 *        data-title="Prerequisites & Concepts"
 *        data-subtitle="Install every tool…"
 *        data-time="45–60 min"
 *        data-requires="None — first lab"
 *        data-toolkit="Windows / Mac / Linux"></div>
 *
 * Checklist ("What you'll have by the end"):
 *   Items are pipe-separated; main~sub within each item (sub optional).
 *   <div data-widget="checklist"
 *        data-items="M365 tenant configured~Custom app uploads enabled|Node.js 22 LTS~Verified with node -v"></div>
 *
 * Concepts grid (each card has its own color):
 *   Cards are || separated; each card = label::color::title::body
 *   body may contain HTML.
 *   <div data-widget="concepts"
 *        data-cards="Microsoft 365 Copilot::blue::The AI host::The underlying LLM…||Declarative Agent::purple::Your focused persona::A set of three JSON files…"></div>
 *
 * Architecture diagram:
 *   Rows are || separated. Each row is either:
 *     label::<text>
 *     row::<box1title>::<box1color>::<box1sub>|<box2title>::<box2color>::<box2sub>|…
 *   <div data-widget="arch"
 *        data-rows="row::Microsoft 365 Copilot::copilot::Receives user query|Declarative Agent::agent::declarativeAgent.json + instruction.txt||label::reads ai-plugin.json → calls MCP tool||row::Dev Tunnel::tunnel::Public HTTPS ↔ localhost:3001|MCP Server::mcp::Handles tool calls|Azurite::data::Table Storage emulator"></div>
 *
 * Callout:
 *   type: info | tip | warn | concept
 *   <div data-widget="callout"
 *        data-type="tip"
 *        data-title="Optional title"
 *        data-body="Body text, may contain &lt;code&gt;HTML&lt;/code&gt;."></div>
 *
 * Step header:
 *   <div data-widget="step" data-n="1" data-title="Enable custom app uploads"></div>
 *
 * Verify box (teal, dark-green code block):
 *   Lines starting with # are dimmed. Use \n in data-cmd for line breaks.
 *   <div data-widget="verify"
 *        data-label="Node.js version"
 *        data-cmd="node -v\n# Expected: v22.x.x"></div>
 *
 * Terminal (macOS chrome):
 *   <div data-widget="terminal"
 *        data-label="install azurite"
 *        data-cmd="npm install -g azurite\nazurite --version\n# Expected: 3.x.x"></div>
 *
 * File tree:
 *   Lines are | separated. Within a line, wrap segments in [hi:text] or [dim:text].
 *   <div data-widget="tree"
 *        data-lines="appPackage/|├── declarativeAgent.json   [dim:# lists ai-plugin.json]|├── [hi:ai-plugin.json]          [dim:# generated]|├── instruction.txt|└── manifest.json"></div>
 *
 * Lab nav (prev/next footer):
 *   <div data-widget="labnav"
 *        data-prev="prereq-lab.md"
 *        data-prev-label="E0+ Prerequisites"
 *        data-next="e-intro-lab.md"
 *        data-next-label="Lab E-Intro"></div>
 *
 * Bundle card:
 *   <div data-widget="bundle"
 *        data-icon="🔌"
 *        data-label="Bundle A"
 *        data-label-color="teal"
 *        data-title="MCP Foundations: Build it, then secure it"
 *        data-tagline="Stand up a real MCP server…"
 *        data-time="~4 hrs"
 *        data-lab1-badge="Lab E8"
 *        data-lab1-badge-color="blue"
 *        data-lab1-title="Connect Declarative Agent to MCP Server"
 *        data-lab1-items="Run Azurite + seed claims data|Start the Zava MCP server (15 tools)|Scaffold agent with Agents Toolkit"
 *        data-transition="add auth"
 *        data-lab2-badge="Lab E10"
 *        data-lab2-badge-color="purple"
 *        data-lab2-title="OAuth-Protected MCP Server"
 *        data-lab2-items="Register app in Microsoft Entra ID|Add client secret + expose API scope|Rebuild server with JWT validation"
 *        data-arc="Here's a working MCP server — now make it production-grade"
 *        data-start-url="https://microsoft.github.io/…"></div>
 */

(function () {
  "use strict";

  /* ── palette ─────────────────────────────────────────────────────────── */
  const P = {
    blue:   { light:"#E6F1FB", mid:"#378ADD", dark:"#0C447C", text:"#185FA5" },
    teal:   { light:"#E1F5EE", mid:"#1D9E75", dark:"#085041", text:"#0F6E56" },
    amber:  { light:"#FAEEDA", mid:"#EF9F27", dark:"#633806", text:"#854F0B" },
    green:  { light:"#EAF3DE", mid:"#639922", dark:"#27500A", text:"#3B6D11" },
    purple: { light:"#EEEDFE", mid:"#7F77DD", dark:"#3C3489", text:"#534AB7" },
    coral:  { light:"#FAECE7", mid:"#D85A30", dark:"#712B13", text:"#993C1D" },
    gray:   { light:"#F1EFE8", mid:"#B4B2A9", dark:"#444441", text:"#5F5E5A" },
  };

  const ARCH_COLORS = {
    copilot: { bg:"#E6F1FB", border:"#378ADD", strong:"#0C447C" },
    agent:   { bg:"#EEEDFE", border:"#7F77DD", strong:"#534AB7" },
    mcp:     { bg:"#E1F5EE", border:"#1D9E75", strong:"#0F6E56" },
    tunnel:  { bg:"#F1EFE8", border:"rgba(0,0,0,.15)", strong:"#5F5E5A" },
    data:    { bg:"#FAEEDA", border:"#EF9F27", strong:"#854F0B" },
  };

  /* ── style injection (once) ──────────────────────────────────────────── */
  function injectStyles() {
    if (document.getElementById("ccw-styles")) return;
    const s = document.createElement("style");
    s.id = "ccw-styles";
    s.textContent = `
/* ─────────────────────────────────────────────────────────────────────────
   cc-widgets — font-size philosophy:
   Body copy inherits the site's 16px base throughout (no overrides).
   Only structural chrome gets explicit sizes: badges, labels, step numbers,
   code blocks, and tiny metadata pills — things intentionally smaller than
   body text. Everything else is layout + color only.
───────────────────────────────────────────────────────────────────────── */

/* ── hero ── */
.ccw-hero{padding:32px 0 24px;border-bottom:.5px solid rgba(0,0,0,.1);margin-bottom:28px}
.ccw-badge{display:inline-flex;align-items:center;gap:6px;font-size:.75rem;font-weight:600;
  padding:4px 12px;border-radius:20px;margin-bottom:14px;line-height:1}
.ccw-hero h1{margin:0 0 10px;line-height:1.2}
.ccw-hero-sub{color:var(--md-default-fg-color--light,#5F5E5A);margin:0 0 20px;
  max-width:600px;line-height:1.6}
.ccw-meta{display:flex;gap:8px;flex-wrap:wrap;margin-top:4px}
.ccw-pill{font-size:.75rem;color:var(--md-default-fg-color--light,#5F5E5A);
  background:var(--md-default-bg-color,#fff);border:.5px solid rgba(0,0,0,.12);
  border-radius:20px;padding:3px 12px;display:inline-flex;align-items:center;gap:5px}
.ccw-pill strong{color:var(--md-default-fg-color,#1a1a18);font-weight:600}

/* ── hero path breadcrumb ── */
.ccw-hero-path{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:20px}
.ccw-path-step{display:inline-flex;align-items:center;gap:6px;font-size:.8rem;
  background:var(--md-default-bg-color--light,#F9F8F5);
  border:.5px solid rgba(0,0,0,.12);border-radius:20px;padding:5px 12px;
  color:var(--md-default-fg-color--light,#5F5E5A)}
.ccw-path-step.active{background:#E6F1FB;border-color:#378ADD;color:#185FA5}
.ccw-path-num{width:20px;height:20px;border-radius:50%;background:#185FA5;
  color:#fff;font-size:.7rem;font-weight:700;display:flex;align-items:center;
  justify-content:center;flex-shrink:0}
.ccw-path-arrow{color:#B4B2A9}

/* ── checklist ── */
.ccw-checklist{background:var(--md-default-bg-color,#fff);
  border:.5px solid rgba(0,0,0,.12);border-radius:12px;
  padding:20px 24px;margin-bottom:32px}
.ccw-checklist h2{font-weight:600;margin:0 0 14px}
.ccw-cl-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.ccw-cl-item{display:flex;align-items:flex-start;gap:10px;padding:9px 12px;
  border-radius:8px;background:var(--md-default-bg-color--light,#F9F8F5);
  border:.5px solid rgba(0,0,0,.1)}
.ccw-cl-dot{width:18px;height:18px;border-radius:50%;border:1.5px solid rgba(0,0,0,.2);
  flex-shrink:0;margin-top:3px}
.ccw-cl-main{display:block;font-weight:600;
  color:var(--md-default-fg-color,#1a1a18)}
.ccw-cl-sub{display:block;font-size:.8rem;
  color:var(--md-default-fg-color--light,#888780);margin-top:1px}

/* ── concept grid ── */
.ccw-concept-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0 28px}
.ccw-concept{background:var(--md-default-bg-color,#fff);
  border:.5px solid rgba(0,0,0,.12);border-radius:8px;padding:16px}
.ccw-con-label{font-size:.7rem;font-weight:700;text-transform:uppercase;
  letter-spacing:.08em;margin-bottom:6px}
.ccw-concept h4{font-weight:600;margin:0 0 6px}
.ccw-concept p{color:var(--md-default-fg-color--light,#5F5E5A);
  margin:0;line-height:1.55}

/* ── arch diagram ── */
.ccw-arch{background:var(--md-default-bg-color,#fff);
  border:.5px solid rgba(0,0,0,.12);border-radius:12px;
  padding:20px;margin:20px 0;display:flex;flex-direction:column;gap:10px}
.ccw-arch-row{display:flex;align-items:stretch;gap:10px}
.ccw-arch-box{flex:1;border-radius:8px;padding:10px 14px;
  border:.5px solid rgba(0,0,0,.12)}
.ccw-arch-box strong{display:block;font-weight:600;margin-bottom:3px}
.ccw-arch-box span{font-size:.8rem;
  color:var(--md-default-fg-color--light,#5F5E5A);line-height:1.4}
.ccw-arch-arrow{color:#B4B2A9;font-size:1.2rem;
  flex:0 0 24px;display:flex;align-items:center;justify-content:center}
.ccw-arch-label{font-size:.8rem;color:#888780;text-align:center;
  padding:0;font-style:italic}

/* ── callout ── */
.ccw-callout{border-radius:0 8px 8px 0;padding:14px 18px;margin:20px 0;
  line-height:1.6;border-left:3px solid}
.ccw-callout strong{display:block;margin-bottom:4px;font-weight:600}
.ccw-callout a{color:inherit;text-decoration:underline}
.ccw-callout code{font-size:.85em;padding:1px 5px;border-radius:4px;
  background:rgba(0,0,0,.1)}
.ccw-callout.info   {background:#E6F1FB;border-color:#378ADD;color:#0C447C}
.ccw-callout.tip    {background:#E1F5EE;border-color:#1D9E75;color:#0F6E56}
.ccw-callout.warn   {background:#FAEEDA;border-color:#EF9F27;color:#854F0B}
.ccw-callout.concept{background:#EEEDFE;border-color:#7F77DD;color:#534AB7}

/* ── step header ── */
.ccw-step{display:flex;align-items:center;gap:12px;margin:28px 0 10px}
.ccw-step-num{width:28px;height:28px;border-radius:50%;background:#185FA5;color:#fff;
  font-size:.75rem;font-weight:700;display:flex;align-items:center;
  justify-content:center;flex-shrink:0}
.ccw-step h3{margin:0;font-weight:600}

/* ── verify box ── */
.ccw-verify{background:#E1F5EE;border:.5px solid #1D9E75;border-radius:8px;
  padding:14px 18px;margin:20px 0}
.ccw-verify-label{font-size:.7rem;font-weight:700;text-transform:uppercase;
  letter-spacing:.08em;color:#0F6E56;margin-bottom:10px}
.ccw-code-block{background:#0a2e22;border-radius:6px;padding:12px 16px;margin:0;
  overflow-x:auto;white-space:pre;
  font-family:var(--md-code-font,ui-monospace,monospace);
  font-size:var(--md-code-font-size,.85em);line-height:1.6;color:#c8fae0}
.ccw-dim{color:#5DCAA5;font-style:italic}

/* ── terminal ── */
.ccw-terminal{margin:16px 0 24px;border-radius:8px;overflow:hidden}
.ccw-term-bar{background:#3a3a38;padding:8px 14px;display:flex;align-items:center;gap:6px}
.ccw-term-dot{width:10px;height:10px;border-radius:50%;display:inline-block;flex-shrink:0}
.ccw-term-label{font-size:.7rem;color:#888780;margin-left:6px;
  font-family:var(--md-code-font,ui-monospace,monospace)}
.ccw-term-body{background:#2C2C2A;padding:14px 18px;overflow-x:auto;
  white-space:pre;font-family:var(--md-code-font,ui-monospace,monospace);
  font-size:var(--md-code-font-size,.85em);line-height:1.6;color:#e8e6de}

/* ── file tree ── */
.ccw-tree{background:var(--md-default-bg-color,#fff);
  border:.5px solid rgba(0,0,0,.12);border-radius:8px;
  padding:14px 18px;margin:12px 0 20px;
  font-family:var(--md-code-font,ui-monospace,monospace);
  font-size:var(--md-code-font-size,.85em);line-height:1.8}
.ccw-tree .ccw-hi {color:#185FA5;font-weight:600}
.ccw-tree .ccw-dim{color:#888780}

/* ── lab nav ── */
.ccw-lab-nav{display:flex;justify-content:space-between;align-items:center;
  margin-top:52px;padding-top:24px;border-top:.5px solid rgba(0,0,0,.12);
  gap:12px;flex-wrap:wrap}
.ccw-lab-nav a{text-decoration:none;border-radius:8px;padding:8px 16px;
  border:.5px solid rgba(0,0,0,.15);color:#185FA5;
  background:var(--md-default-bg-color,#fff)}
.ccw-lab-nav a.ccw-next{background:#185FA5;color:#fff;border-color:#185FA5}
.ccw-lab-nav a:hover{opacity:.85}

/* ── bundle card ── */
.ccw-bundle{background:var(--md-default-bg-color,#fff);
  border:.5px solid rgba(0,0,0,.12);border-radius:12px;
  overflow:hidden;margin:16px 0 32px}
.ccw-bundle-head{padding:18px 22px 14px;border-bottom:.5px solid rgba(0,0,0,.1);
  display:flex;align-items:flex-start;gap:14px}
.ccw-bicon{width:38px;height:38px;border-radius:8px;font-size:1.2rem;
  display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ccw-blabel{font-size:.7rem;font-weight:700;text-transform:uppercase;
  letter-spacing:.08em;margin-bottom:3px}
.ccw-bundle-head h2{margin:0 0 3px;font-weight:600}
.ccw-bsub{color:var(--md-default-fg-color--light,#5F5E5A);margin:0}
.ccw-btime{font-size:.75rem;color:#888780;
  background:var(--md-default-bg-color--light,#F9F8F5);
  border:.5px solid rgba(0,0,0,.1);border-radius:12px;padding:3px 10px;
  white-space:nowrap;margin-left:auto;flex-shrink:0;align-self:flex-start}
.ccw-bundle-labs{display:grid;grid-template-columns:1fr 64px 1fr;
  align-items:center;padding:18px 22px}
.ccw-lab-card{background:var(--md-default-bg-color--light,#F9F8F5);
  border:.5px solid rgba(0,0,0,.1);border-radius:8px;padding:14px 16px}
.ccw-lab-card .ccw-ln{font-size:.7rem;font-weight:700;padding:2px 8px;
  border-radius:10px;display:inline-block;margin-bottom:8px}
.ccw-lab-card h3{font-weight:600;margin:0 0 8px}
.ccw-lab-card ul{list-style:none;padding:0;margin:0}
.ccw-lab-card li{color:var(--md-default-fg-color--light,#5F5E5A);
  padding:2px 0 2px 14px;position:relative;font-size:.875rem}
.ccw-lab-card li::before{content:"·";position:absolute;left:4px;color:#B4B2A9}
.ccw-bundle-trans{text-align:center;color:#B4B2A9;line-height:1.3;font-size:.8rem}
.ccw-bundle-foot{border-top:.5px solid rgba(0,0,0,.1);padding:12px 22px;
  display:flex;align-items:center;justify-content:space-between;
  background:var(--md-default-bg-color--light,#F9F8F5);
  flex-wrap:wrap;gap:10px}
.ccw-bundle-foot em{color:var(--md-default-fg-color--light,#5F5E5A)}
.ccw-bundle-foot a{color:#185FA5;text-decoration:none;
  background:var(--md-default-bg-color,#fff);
  border:.5px solid rgba(0,0,0,.12);border-radius:7px;
  padding:6px 14px;font-weight:600}

/* ── da compare ── */
.ccw-explainer{background:var(--md-default-bg-color,#fff);
  border:.5px solid rgba(0,0,0,.12);border-radius:12px;
  padding:24px 28px;margin-bottom:32px}
.ccw-explainer h2{font-weight:600;margin:0 0 14px}
.ccw-cmp-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}
.ccw-cmp-box{background:var(--md-default-bg-color--light,#F9F8F5);
  border:.5px solid rgba(0,0,0,.12);border-radius:8px;padding:14px}
.ccw-cmp-box.good{border-color:#1D9E75}
.ccw-cmp-lbl{font-size:.7rem;font-weight:700;text-transform:uppercase;
  letter-spacing:.07em;color:#888780;margin-bottom:8px}
.ccw-cmp-box.good .ccw-cmp-lbl{color:#0F6E56}
.ccw-cmp-box p{color:var(--md-default-fg-color--light,#5F5E5A);margin:0;line-height:1.55}
.ccw-explainer-note{color:var(--md-default-fg-color--light,#5F5E5A);margin:0;line-height:1.6}

/* ── onramp strip ── */
.ccw-onramp{background:var(--md-default-bg-color,#fff);
  border:.5px solid rgba(0,0,0,.12);border-radius:12px;
  padding:24px 28px 20px;margin-bottom:32px}
.ccw-onramp-title{font-weight:600;margin:0 0 4px}
.ccw-onramp-sub{color:var(--md-default-fg-color--light,#5F5E5A);margin:0 0 18px}
.ccw-onramp-row{display:flex;align-items:stretch;gap:10px;flex-wrap:nowrap}
.ccw-ostep{flex:1 1 0;min-width:0;display:flex;flex-direction:column;
  background:var(--md-default-bg-color--light,#F9F8F5);
  border:.5px solid rgba(0,0,0,.1);border-radius:10px;padding:16px 18px}
.ccw-ostep-badge{font-size:.7rem;font-weight:700;padding:2px 8px;border-radius:10px;
  display:inline-block;margin-bottom:8px;align-self:flex-start}
.ccw-ostep h3{font-weight:600;margin:0 0 8px;line-height:1.35}
.ccw-ostep p{color:var(--md-default-fg-color--light,#5F5E5A);
  margin:0 0 12px;line-height:1.5;font-size:.875rem;flex:1}
.ccw-ostep a{color:#185FA5;text-decoration:none;font-weight:600;font-size:.875rem;align-self:flex-start}
.ccw-onramp-arr{flex:0 0 22px;display:flex;align-items:center;justify-content:center;
  text-align:center;color:#B4B2A9;font-size:1rem;padding-top:0}

/* ── section label ── */
.ccw-section-label{font-size:.7rem;font-weight:700;letter-spacing:.09em;
  text-transform:uppercase;color:#888780;margin:0 0 12px;display:block}

/* ── footer note ── */
.ccw-footer-note{margin-top:32px;color:#888780;text-align:center;line-height:1.6;
  font-size:.875rem}

/* ── bundle sequence stepper ── */
.ccw-bseq{padding:8px 0}
.ccw-bseq-step{display:flex;gap:16px;margin-bottom:0}
.ccw-bseq-indicator{display:flex;flex-direction:column;align-items:center;flex-shrink:0;width:32px}
.ccw-bseq-dot{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;
  justify-content:center;font-size:.8rem;font-weight:700;flex-shrink:0;z-index:1}
.ccw-bseq-step.done .ccw-bseq-dot{background:#1D9E75;color:#fff}
.ccw-bseq-step.current .ccw-bseq-dot{background:#185FA5;color:#fff;box-shadow:0 0 0 4px #E6F1FB}
.ccw-bseq-step.upcoming .ccw-bseq-dot{background:#E8E6DF;color:#888780}
.ccw-bseq-line{flex:1;width:2px;background:#E8E6DF;margin:4px 0;min-height:24px}
.ccw-bseq-step.done .ccw-bseq-line{background:#1D9E75}
.ccw-bseq-card{flex:1;background:var(--md-default-bg-color,#fff);
  border:.5px solid rgba(0,0,0,.1);border-radius:10px;padding:16px 18px;
  margin-bottom:16px;transition:border-color .15s,box-shadow .15s}
.ccw-bseq-step.current .ccw-bseq-card{border-color:#378ADD;box-shadow:0 2px 12px rgba(55,138,221,.12)}
.ccw-bseq-step.done .ccw-bseq-card{opacity:.7}
.ccw-bseq-step.upcoming .ccw-bseq-card{opacity:.5}
.ccw-bseq-card h3{font-weight:600;margin:6px 0 8px}
.ccw-bseq-card ul{list-style:none;padding:0;margin:0 0 12px}
.ccw-bseq-card li{color:var(--md-default-fg-color--light,#5F5E5A);
  padding:2px 0 2px 14px;position:relative;font-size:.875rem}
.ccw-bseq-card li::before{content:"·";position:absolute;left:4px;color:#B4B2A9}
.ccw-bseq-foot{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:8px}
.ccw-bseq-cta{font-weight:600;font-size:.875rem;color:#185FA5;text-decoration:none}
.ccw-bseq-cta.active{background:#185FA5;color:#fff;padding:6px 14px;border-radius:6px}
.ccw-bseq-cta.revisit{color:#888780;font-size:.875rem;text-decoration:none}
.ccw-bseq-btn{border:none;background:transparent;cursor:pointer;font-size:.75rem;
  color:#888780;padding:4px 8px;border-radius:4px;border:.5px solid #D9D8D1}
.ccw-bseq-btn:hover{background:#F1EFE8}
.ccw-bseq-complete{margin-top:8px;padding:16px 20px;background:#E1F5EE;
  border-radius:10px;font-weight:600;color:#0F6E56;text-align:center}
.ccw-bseq-complete a{color:#0F6E56;margin-left:8px}

/* ── responsive ── */
@media(max-width:600px){
  .ccw-cl-grid,.ccw-concept-grid,.ccw-bundle-labs,.ccw-cmp-grid{grid-template-columns:1fr}
  .ccw-arch-row{flex-direction:column}
  .ccw-bundle-trans,.ccw-onramp-arr{display:none}
  .ccw-onramp-row{flex-direction:column}
}
    `;
    document.head.appendChild(s);
  }

  /* ── helpers ─────────────────────────────────────────────────────────── */
  function esc(s) {
    return String(s || "")
      .replace(/&/g,"&amp;").replace(/</g,"&lt;")
      .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }

  /* render cmd string: escape, then dim lines starting with # */
  function renderCmd(cmd) {
    const raw = String(cmd).replace(/\\n/g, "\n");
    return raw.split("\n").map(line => {
      const safe = esc(line);
      return line.trimStart().startsWith("#")
        ? `<span class="ccw-dim">${safe}</span>` : safe;
    }).join("\n");
  }

  /* parse tree line: "[hi:text]" / "[dim:text]" markers → spans */
  function renderTreeLine(line) {
    return esc(line)
      .replace(/\[hi:([^\]]+)\]/g, (_, t) => `<span class="ccw-hi">${t}</span>`)
      .replace(/\[dim:([^\]]+)\]/g, (_, t) => `<span class="ccw-dim">${t}</span>`);
  }

  /* ── renderers ───────────────────────────────────────────────────────── */

  function renderHero(el) {
    const d = el.dataset;
    const c = P[d.badgeColor] || P.amber;
    const pills = [
      d.time     && `<span class="ccw-pill">⏱ <strong>${esc(d.time)}</strong></span>`,
      d.requires && `<span class="ccw-pill">📋 Requires: <strong>${esc(d.requires)}</strong></span>`,
      d.toolkit  && `<span class="ccw-pill">🧰 <strong>${esc(d.toolkit)}</strong></span>`,
      d.extra    && `<span class="ccw-pill">${d.extra}</span>`,
    ].filter(Boolean).join("");
    el.innerHTML = `
      <div class="ccw-hero">
        <div class="ccw-badge" style="background:${c.light};color:${c.dark}">
          ${d.icon || ""} ${esc(d.badge)}
        </div>
        <h1>${esc(d.title)}</h1>
        <p class="ccw-hero-sub">${esc(d.subtitle)}</p>
        ${pills ? `<div class="ccw-meta">${pills}</div>` : ""}
      </div>`;
  }

  function renderChecklist(el) {
    const items = (el.dataset.items || "").split("|").filter(Boolean).map(raw => {
      const [main, sub] = raw.split("~");
      return `
        <div class="ccw-cl-item">
          <div class="ccw-cl-dot"></div>
          <div>
            <span class="ccw-cl-main">${esc(main.trim())}</span>
            ${sub ? `<span class="ccw-cl-sub">${esc(sub.trim())}</span>` : ""}
          </div>
        </div>`;
    }).join("");
    el.innerHTML = `
      <div class="ccw-checklist">
        <h2>✅ What you'll have by the end</h2>
        <div class="ccw-cl-grid">${items}</div>
      </div>`;
  }

  function renderConcepts(el) {
    const cards = (el.dataset.cards || "").split("||").filter(Boolean).map(raw => {
      const [label, color, title, ...bodyParts] = raw.split("::");
      const body = bodyParts.join("::");
      const c = P[color] || P.blue;
      return `
        <div class="ccw-concept">
          <div class="ccw-con-label" style="color:${c.text}">${esc(label.trim())}</div>
          <h4>${esc(title.trim())}</h4>
          <p>${body.trim()}</p>
        </div>`;
    }).join("");
    el.innerHTML = `<div class="ccw-concept-grid">${cards}</div>`;
  }

  function renderArch(el) {
    const rows = (el.dataset.rows || "").split("||").filter(Boolean).map(raw => {
      const trimmed = raw.trim();
      if (trimmed.startsWith("label::")) {
        return `<div class="ccw-arch-label">${esc(trimmed.slice(7))}</div>`;
      }
      // row::title::color::sub|title::color::sub|…
      const parts = trimmed.replace(/^row::/, "").split("|");
      const boxes = parts.map((b, i) => {
        const [title, color, sub] = b.split("::");
        const c = ARCH_COLORS[color] || ARCH_COLORS.tunnel;
        const arrow = i < parts.length - 1
          ? `<div class="ccw-arch-arrow">→</div>` : "";
        return `
          <div class="ccw-arch-box" style="background:${c.bg};border-color:${c.border}">
            <strong style="color:${c.strong}">${esc(title.trim())}</strong>
            ${sub ? `<span>${esc(sub.trim())}</span>` : ""}
          </div>${arrow}`;
      }).join("");
      return `<div class="ccw-arch-row">${boxes}</div>`;
    }).join("");
    el.innerHTML = `<div class="ccw-arch">${rows}</div>`;
  }

  function renderCallout(el) {
    const d = el.dataset;
    el.innerHTML = `
      <div class="ccw-callout ${esc(d.type || "info")}">
        ${d.title ? `<strong>${esc(d.title)}</strong>` : ""}
        ${d.body || ""}
      </div>`;
  }

  function renderStep(el) {
    el.innerHTML = `
      <div class="ccw-step">
        <div class="ccw-step-num">${esc(el.dataset.n)}</div>
        <h3>${esc(el.dataset.title)}</h3>
      </div>`;
  }

  function renderVerify(el) {
    el.innerHTML = `
      <div class="ccw-verify">
        <div class="ccw-verify-label">✓ ${esc(el.dataset.label)}</div>
        <div class="ccw-code-block">${renderCmd(el.dataset.cmd || "")}</div>
      </div>`;
  }

  function renderTerminal(el) {
    el.innerHTML = `
      <div class="ccw-terminal">
        <div class="ccw-term-bar">
          <span class="ccw-term-dot" style="background:#E24B4A"></span>
          <span class="ccw-term-dot" style="background:#EF9F27"></span>
          <span class="ccw-term-dot" style="background:#639922"></span>
          ${el.dataset.label
            ? `<span class="ccw-term-label">${esc(el.dataset.label)}</span>` : ""}
        </div>
        <div class="ccw-term-body">${renderCmd(el.dataset.cmd || "")}</div>
      </div>`;
  }

  function renderTree(el) {
    const lines = (el.dataset.lines || "").split("|").map(renderTreeLine).join("<br>");
    el.innerHTML = `<div class="ccw-tree">${lines}</div>`;
  }

  function renderLabNav(el) {
    const d = el.dataset;
    el.innerHTML = `
      <div class="ccw-lab-nav">
        ${d.prev
          ? `<a href="${esc(d.prev)}">← ${esc(d.prevLabel)}</a>`
          : "<span></span>"}
        ${d.next
          ? `<a href="${esc(d.next)}" class="ccw-next">${esc(d.nextLabel)} →</a>`
          : ""}
      </div>`;
  }

  function renderBundle(el) {
    const d = el.dataset;
    const lc = P[d.labelColor] || P.teal;

    function labCard(prefix) {
      const badge = d[prefix + "Badge"] || "";
      const badgeColor = d[prefix + "BadgeColor"] || "blue";
      const title = d[prefix + "Title"] || "";
      const items = (d[prefix + "Items"] || "").split("|").filter(Boolean)
        .map(i => `<li>${esc(i.trim())}</li>`).join("");
      const bc = P[badgeColor] || P.blue;
      return `
        <div class="ccw-lab-card">
          <span class="ccw-ln" style="background:${bc.light};color:${bc.dark}">
            ${esc(badge)}
          </span>
          <h3>${esc(title)}</h3>
          <ul>${items}</ul>
        </div>`;
    }

    el.innerHTML = `
      <div class="ccw-bundle">
        <div class="ccw-bundle-head">
          <div class="ccw-bicon" style="background:${lc.light}">${d.icon || ""}</div>
          <div>
            <div class="ccw-blabel" style="color:${lc.text}">${esc(d.label)}</div>
            <h2>${esc(d.title)}</h2>
            <p class="ccw-bsub">${esc(d.tagline)}</p>
          </div>
          <div class="ccw-btime">⏱ ${esc(d.time)}</div>
        </div>
        <div class="ccw-bundle-labs">
          ${labCard("lab1")}
          <div class="ccw-bundle-trans">→<br><small>${esc(d.transition || "")}</small></div>
          ${labCard("lab2")}
        </div>
        <div class="ccw-bundle-foot">
          <em>${esc(d.arc)}</em>
          <a href="${esc(d.startUrl)}">Start ${esc(d.label)} →</a>
        </div>
      </div>`;
  }

  /* landing hero — bigger h1 + path breadcrumb strip
     data-path = pipe-separated steps; prefix with * to mark active
     e.g. "0::Prerequisites (E0)|1::First Agent (E-Intro)|*A::Bundle A — MCP Foundations|*B::Bundle B — MCP at Scale"
  */
  function renderLandingHero(el) {
    const d = el.dataset;
    const c = P[d.badgeColor] || P.blue;
    const steps = (d.path || "").split("|").filter(Boolean).map(raw => {
      const active = raw.startsWith("*");
      const clean  = active ? raw.slice(1) : raw;
      const [num, ...labelParts] = clean.split("::");
      const label = labelParts.join("::");
      return `
        <div class="ccw-path-step${active ? " active" : ""}">
          <div class="ccw-path-num">${esc(num)}</div>
          ${esc(label)}
        </div>`;
    });
    /* interleave arrows */
    const pathHtml = steps.reduce((acc, s, i) =>
      acc + s + (i < steps.length - 1
        ? `<span class="ccw-path-arrow">${i === steps.length - 2 ? "+" : "→"}</span>`
        : ""), "");
    el.innerHTML = `
      <div class="ccw-hero">
        <div class="ccw-badge" style="background:${c.light};color:${c.dark}">
          ${d.icon || ""} ${esc(d.badge)}
        </div>
        <h1 style="font-size:2rem">${esc(d.title)}</h1>
        <p class="ccw-hero-sub">${esc(d.subtitle)}</p>
        ${pathHtml ? `<div class="ccw-hero-path">${pathHtml}</div>` : ""}
      </div>`;
  }

  /* DA compare — explainer box with two side-by-side comparison cards + note
     data-left-label, data-left-body, data-right-label, data-right-body, data-note
  */
  function renderDaCompare(el) {
    const d = el.dataset;
    el.innerHTML = `
      <div class="ccw-explainer">
        <h2>${esc(d.title || "What is a Declarative Agent?")}</h2>
        <div class="ccw-cmp-grid">
          <div class="ccw-cmp-box">
            <div class="ccw-cmp-lbl">${esc(d.leftLabel)}</div>
            <p>${d.leftBody}</p>
          </div>
          <div class="ccw-cmp-box good">
            <div class="ccw-cmp-lbl">${esc(d.rightLabel)}</div>
            <p>${d.rightBody}</p>
          </div>
        </div>
        ${d.note ? `<p class="ccw-explainer-note">${d.note}</p>` : ""}
      </div>`;
  }

  /* On-ramp strip — 3 step cards with arrows between them
     Each step: label::badgeColor::title::body::linkText::linkHref
     Steps are pipe-separated.
  */
  function renderOnramp(el) {
    const d = el.dataset;
    const steps = (d.steps || "").split("|").filter(Boolean);
    const BADGE_COLORS = {
      prereq: { bg:"#FAEEDA", color:"#854F0B" },
      lab:    { bg:"#E1F5EE", color:"#0F6E56" },
      bundle: { bg:"#E6F1FB", color:"#0C447C" },
    };
    const cards = steps.map((raw, i) => {
      const [label, badgeKey, title, body, linkText, linkHref] = raw.split("::");
      const bc = BADGE_COLORS[badgeKey] || BADGE_COLORS.lab;
      const arrow = i < steps.length - 1
        ? `<div class="ccw-onramp-arr">→</div>` : "";
      return `
        <div class="ccw-ostep">
          <span class="ccw-ostep-badge"
            style="background:${bc.bg};color:${bc.color}">${esc(label)}</span>
          <h3>${esc(title)}</h3>
          <p>${esc(body)}</p>
          ${linkText && linkHref
            ? `<a href="${esc(linkHref)}">${esc(linkText)} →</a>` : ""}
        </div>${arrow}`;
    }).join("");
    el.innerHTML = `
      <div class="ccw-onramp">
        <p class="ccw-onramp-title">${esc(d.title || "Start here before the bundles")}</p>
        <p class="ccw-onramp-sub">${esc(d.sub || "")}</p>
        <div class="ccw-onramp-row">${cards}</div>
      </div>`;
  }

  /* simple section label */
  function renderSectionLabel(el) {
    el.innerHTML = `<p class="ccw-section-label">${esc(el.dataset.text)}</p>`;
  }

  /* footer note */
  function renderFooterNote(el) {
    el.innerHTML = `<div class="ccw-footer-note">${el.dataset.text}</div>`;
  }

  /* Bundle sequence stepper — Option 1 + dynamic nav
     Each step: labKey::badge::badgeColor::title::item1~item2~item3::url
     Steps are pipe-separated.
     Completion tracked via localStorage key: ccw-done-{labKey}
  */
  function renderBundleSeq(el) {
    const d = el.dataset;
    const DONE_KEY = k => `ccw-done-${k}`;

    const steps = (d.steps || "").split("|").filter(Boolean).map(raw => {
      const parts = raw.split("::");
      return {
        key:        parts[0] || "",
        badge:      parts[1] || "",
        badgeColor: parts[2] || "blue",
        title:      parts[3] || "",
        items:      (parts[4] || "").split("~").filter(Boolean),
        url:        parts[5] || "#",
      };
    });

    function isDone(key) {
      return localStorage.getItem(DONE_KEY(key)) === "true";
    }

    function toggle(key) {
      localStorage.setItem(DONE_KEY(key), String(!isDone(key)));
      render();
    }

    function render() {
      let foundCurrent = false;
      const stepsHtml = steps.map((step, i) => {
        const done     = isDone(step.key);
        const current  = !done && !foundCurrent;
        if (current) foundCurrent = true;
        const upcoming = !done && !current;
        const bc       = P[step.badgeColor] || P.blue;
        const isLast   = i === steps.length - 1;
        const cls      = done ? "done" : current ? "current" : "upcoming";
        const dot      = done ? "✓" : String(i + 1);
        const items    = step.items.map(it => `<li>${esc(it)}</li>`).join("");
        const ctaClass = done ? "revisit" : current ? "active" : "";
        const ctaText  = done ? "Revisit →" : current ? "Start Lab →" : "Go to Lab →";
        return `
          <div class="ccw-bseq-step ${cls}">
            <div class="ccw-bseq-indicator">
              <div class="ccw-bseq-dot">${dot}</div>
              ${!isLast ? `<div class="ccw-bseq-line"></div>` : ""}
            </div>
            <div class="ccw-bseq-card">
              <span class="ccw-ln" style="background:${bc.light};color:${bc.dark}">${esc(step.badge)}</span>
              <h3>${esc(step.title)}</h3>
              ${items ? `<ul>${items}</ul>` : ""}
              <div class="ccw-bseq-foot">
                <a href="${esc(step.url)}" class="ccw-bseq-cta ${ctaClass}">${ctaText}</a>
                <button class="ccw-bseq-btn" data-key="${esc(step.key)}">${done ? "Undo" : "Mark done ✓"}</button>
              </div>
            </div>
          </div>`;
      }).join("");

      const allDone = steps.every(s => isDone(s.key));
      const celebration = allDone
        ? `<div class="ccw-bseq-complete">🎉 Bundle complete! <a href="../bundles/">Choose another bundle →</a></div>`
        : "";

      el.innerHTML = `<div class="ccw-bseq">${stepsHtml}${celebration}</div>`;

      el.querySelectorAll(".ccw-bseq-btn").forEach(btn => {
        btn.addEventListener("click", () => toggle(btn.dataset.key));
      });
    }

    render();
  }

  /* ── dispatch table ──────────────────────────────────────────────────── */
  const RENDERERS = {
    hero:          renderHero,
    landinghero:   renderLandingHero,
    dacompare:     renderDaCompare,
    onramp:        renderOnramp,
    sectionlabel:  renderSectionLabel,
    footernote:    renderFooterNote,
    checklist:     renderChecklist,
    concepts:      renderConcepts,
    arch:          renderArch,
    callout:       renderCallout,
    step:          renderStep,
    verify:        renderVerify,
    terminal:      renderTerminal,
    tree:          renderTree,
    labnav:        renderLabNav,
    bundle:        renderBundle,
    bundleseq:     renderBundleSeq,
  };

  /* ── main render pass ────────────────────────────────────────────────── */
  function renderAll() {
    injectStyles();
    document.querySelectorAll("[data-widget]").forEach(el => {
      const name = el.dataset.widget;
      const fn = RENDERERS[name];
      if (fn) {
        try { fn(el); }
        catch (e) { console.warn("ccw: error rendering", name, e); }
      }
    });
  }

  /* ── MkDocs Material instant-nav hook ───────────────────────────────── */
  /* document$ is the RxJS observable exposed by MkDocs Material.          */
  /* It emits on every page load, including XHR navigations.               */
  if (typeof document$ !== "undefined") {
    document$.subscribe(renderAll);
  } else {
    /* Fallback for non-instant-nav or local preview */
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", renderAll);
    } else {
      renderAll();
    }
  }

})();
