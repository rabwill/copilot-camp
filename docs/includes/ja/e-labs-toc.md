<div class="cc-lab-toc e-path">
    <img src="/copilot-camp/assets/images/path-icons/E-path-heading.png"></img>
    <div>
        <p>Microsoft 365 が AI モデルとオーケストレーションを提供する宣言型エージェントを構築したい場合は、次のラボを実施してください。</p>
        <ul id="lab-toc">
            <li><strong><a href="/copilot-camp/pages/extend-m365-copilot/index">🏁 ようこそ</a></strong></li>
            <li><strong><a href="/copilot-camp/pages/extend-m365-copilot/bundles">🧩 バンドル概要</a></strong></li>
            <li><strong>🚦 必須オンランプ</strong>
                <ul>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/00-prerequisites">ラボ E0 - 前提条件</a></li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/01-first-agent-new">ラボ E1  - 最初の宣言型エージェント</a></li>
                </ul>
            </li>
            <li><strong>🔌 バンドル A - MCP Foundations</strong>
                <ul>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/bundle-a">バンドル A を開始</a></li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/08-mcp-server">ラボ E8 - 宣言型エージェントを MCP サーバーに接続する</a></li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/10-mcp-auth">ラボ E10 - 宣言型エージェントを OAuth で保護された MCP サーバーに接続する</a></li>
                </ul>
            </li>
            <li><strong>🕸️ バンドル B - Multi-Agent Workflows in Copilot</strong>
                <ul>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/bundle-b">バンドル B を開始</a></li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/09-connected-agent">ラボ E9 - 接続されたエージェント</a></li>
                </ul>
            </li>
            <li><strong>🖼️ バンドル C - MCP アプリ</strong>
                <ul>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/bundle-c">バンドル C を開始</a></li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/11-mcp-app">ラボ E11 - インタラクティブ ウィジェットを含む MCP アプリを構築する</a></li>
                </ul>
            </li>
            <li><strong>🧭 バンドル D - API ベースの宣言型エージェント</strong>
                <ul>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/bundle-d">バンドル D を開始</a></li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/02-build-the-api">ラボ E2 - バックエンド API を構築する</a></li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/03-add-declarative-agent">ラボ E3 - 宣言型エージェントと API プラグインを追加する</a></li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/04-enhance-api-plugin">ラボ E4 - API とプラグインを強化する</a></li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/05-add-adaptive-card">ラボ E5 - アダプティブカードを追加する</a></li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/06a-add-authentication-ttk">ラボ E6a - Entra ID 認証を追加する</a></li>
                </ul>
            </li>
            <li><strong>🔗 バンドル E - コネクタでエージェントをグラウンディングする</strong>
                <ul>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/bundle-e">バンドル E を開始</a></li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/07-add-graphconnector">ラボ E7 - Copilot コネクタを追加する</a></li>
                </ul>
            </li>
        </ul>
    </div>
</div>

<script>
(() => {

// This script decorates the table of contents with a "you are here" indicator.
const toc = document.getElementsByClassName('cc-lab-toc');
for (const div of toc) {
    const lis = div.querySelectorAll('li');
    for (const li of lis) {
        const anchor = li.querySelector('a');
        if (anchor) {            // Get the last segment of the current URL path
            const currentPath = window.location.pathname.slice(0, -1).split('/').pop();

            // Get the last segment of the link path
            const linkPath = anchor.getAttribute('href').split('/').pop().replace('.md', '');

            // Compare the last segments
            if (currentPath === linkPath) {
                const existingSpan = document.querySelector('span.you-are-here');
                if (existingSpan) {
                    existingSpan.remove();
                }
                const span = document.createElement("span");
                span.innerHTML = "YOU&nbsp;ARE&nbsp;HERE";
                span.className = "you-are-here";
                li.appendChild(span);
            }
        }
    }
}
})();
</script>