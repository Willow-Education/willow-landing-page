// Puts the FAQ in front of people using the partnership workspace: a card on
// the workspace home page and an entry in its menu. The workspace is a
// separate app this site forwards to, so middleware.ts adds this script to its
// pages on the way through instead of changing the workspace itself.
//
// The script runs after the workspace has loaded, works only with plain DOM
// (inline styles, because the workspace's stylesheet only has the classes it
// uses), re-adds its links when the workspace re-renders, and stands down for
// good once the workspace ships its own link to the FAQ.

const FAQ_PATH = "/one-goal-planning/faq";

function workspaceLinksScript() {
  const FAQ = "/one-goal-planning/faq";
  const MARK = "data-willow-faq";

  const hasNativeLink = () =>
    Array.from(document.querySelectorAll(`a[href="${FAQ}"]`)).some((link) => !link.hasAttribute(MARK));

  const menuLink = () => {
    const link = document.createElement("a");
    link.href = FAQ;
    link.setAttribute(MARK, "menu");
    link.textContent = "FAQ";
    link.style.cssText =
      "display:flex;align-items:center;border-radius:9999px;padding:12px 16px;font-size:15px;font-weight:600;color:#59635f;text-decoration:none;";
    link.onmouseenter = () => {
      link.style.background = "rgba(255,255,255,0.75)";
      link.style.color = "#171b4a";
    };
    link.onmouseleave = () => {
      link.style.background = "";
      link.style.color = "#59635f";
    };
    return link;
  };

  const homeCard = () => {
    const card = document.createElement("a");
    card.href = FAQ;
    card.setAttribute(MARK, "card");
    card.style.cssText =
      "display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;margin-top:16px;padding:20px 28px;border:1px solid rgba(23,27,74,0.1);border-radius:16px;background:rgba(255,255,255,0.85);box-shadow:0 1px 3px rgba(23,27,74,0.08);text-decoration:none;";
    card.innerHTML =
      '<span style="display:block;min-width:0;flex:1 1 320px">' +
      '<span style="display:block;font-size:12px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;color:#c93623">For sales and implementation teams</span>' +
      '<span style="display:block;margin-top:6px;font-size:20px;font-weight:600;letter-spacing:-0.02em;color:#171b4a">Partnership FAQ</span>' +
      '<span style="display:block;margin-top:4px;font-size:14px;line-height:24px;color:#535862">Answers on the offer, pricing, curriculum, implementation, and technology, updated every week from this workspace.</span>' +
      "</span>" +
      '<span style="display:inline-flex;align-items:center;gap:8px;border-radius:9999px;background:#171b4a;padding:10px 20px;font-size:14px;font-weight:700;color:#fff">Open the FAQ <span aria-hidden="true">→</span></span>';
    return card;
  };

  let observer: MutationObserver | null = null;
  let queued = false;

  const ensure = () => {
    queued = false;

    if (hasNativeLink()) {
      document.querySelectorAll(`[${MARK}]`).forEach((node) => node.remove());
      observer?.disconnect();
      return;
    }

    document.querySelectorAll('nav[aria-label="Partnership workspace pages"]').forEach((nav) => {
      if (!nav.querySelector(`[${MARK}="menu"]`)) {
        nav.appendChild(menuLink());
      }
    });

    const isHome = /^\/one-goal-planning\/?$/.test(window.location.pathname);
    const header = isHome ? document.querySelector("header#overview") : null;

    if (header && !document.querySelector(`[${MARK}="card"]`)) {
      header.insertAdjacentElement("afterend", homeCard());
    }
  };

  const start = () => {
    ensure();
    // The workspace swaps page content on navigation; put the links back.
    observer = new MutationObserver(() => {
      if (!queued) {
        queued = true;
        window.requestAnimationFrame(ensure);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };

  // Wait until the workspace has finished hydrating, so nothing added here is
  // ever part of what React compares against the server's HTML.
  if (document.readyState === "complete") {
    window.setTimeout(start, 0);
  } else {
    window.addEventListener("load", () => window.setTimeout(start, 0));
  }
}

export const WORKSPACE_LINKS_SCRIPT = `<script data-willow-faq-links>(${workspaceLinksScript.toString()})();</script>`;

export function isFaqPath(pathname: string) {
  return pathname === FAQ_PATH || pathname.startsWith(`${FAQ_PATH}/`);
}
