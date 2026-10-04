// Alma, the partnership workspace guide, on every workspace page. Alma's own
// code lives in the workspace app (partnership-operationg-home), but that app
// only changes when it is republished, so middleware.ts adds this script to
// the workspace's pages on the way through, the same way it adds the FAQ links.
//
// The script answers through the workspace's own /api/ask on this domain with
// the visitor's session cookie, so it gets whatever the deployed workspace
// supports: today the archive assistant, and Alma's prompt and people context
// once the workspace is republished. It stands down for good as soon as the
// workspace renders its own Alma.
//
// Constraints: plain DOM and inline styles (the workspace's stylesheet only
// has the classes it uses), nothing referenced from outside the function
// (it is inlined with toString), and model output is only ever set as text.

function workspaceAlmaScript() {
  const BASE = "/one-goal-planning";
  const MARK = "data-willow-alma";
  const STORAGE_KEY = "willow-workspace-alma-v1";
  const NATIVE_LAUNCHER = '[aria-label="Ask Alma, the workspace guide"]';
  const NATIVE_DIALOG = '[aria-label="Alma, the workspace guide"]';
  // A page's own assistant panel already holds a chat; Alma steps aside.
  const PAGE_PANELS = 'section[aria-label="Ask the meeting archive"], section[aria-label="Make a request"]';
  const MAX_QUESTION = 1000;
  const MAX_HISTORY = 8;
  const MAX_HISTORY_CHARS = 4000;

  const NAVY = "#171b4a";
  const MUTED = "#59635f";
  const SOFT = "#737b78";
  const CORAL = "#ff4f35";
  const RED = "#c93623";
  const MINT = "#acf7b2";
  const AQUA = "#17bfc2";

  type Citation = { meetingNoteId: string; quote: string | null };
  type Turn = { role: "user" | "assistant"; content: string; citations?: Citation[] };
  type Meeting = { title: string; meetingDate: string | null };

  const appPath = () => window.location.pathname.slice(BASE.length) || "/";

  if (appPath() === "/access" || appPath().startsWith("/access/")) {
    return;
  }

  // --- State ----------------------------------------------------------------
  // Answers link to workspace pages with plain anchors, which reload the page,
  // so the conversation is kept for the tab in sessionStorage.

  let turns: Turn[] = [];
  let isOpen = false;

  try {
    const saved = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? "null");
    if (saved && Array.isArray(saved.turns)) {
      turns = saved.turns.filter(
        (turn: Turn) =>
          turn && (turn.role === "user" || turn.role === "assistant") && typeof turn.content === "string",
      );
      isOpen = saved.isOpen === true;
    }
  } catch {
    // Storage can be unavailable; Alma still works for this page.
  }

  const save = () => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ turns: turns.slice(-20), isOpen }));
    } catch {
      // Ignore: the conversation just won't survive a reload.
    }
  };

  let isPending = false;
  let error = "";
  let meetings: Map<string, Meeting> | null = null;

  // --- Small DOM helpers ----------------------------------------------------

  const el = (tag: string, style = "", text?: string) => {
    const node = document.createElement(tag);
    if (style) node.style.cssText = style;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const mark = (size: number) =>
    el(
      "span",
      `display:grid;place-items:center;flex-shrink:0;width:${size}px;height:${size}px;border-radius:9999px;background:${MINT};color:${NAVY};font-size:14px;font-weight:900;`,
      "A",
    );

  const hover = (node: HTMLElement, on: string, off: string) => {
    node.addEventListener("mouseenter", () => (node.style.cssText += on));
    node.addEventListener("mouseleave", () => (node.style.cssText += off));
  };

  const isWorkspaceHref = (href: string) => href === BASE || href.startsWith(`${BASE}/`);

  const link = (href: string, children: Node[]) => {
    const anchor = el("a", "color:#0f7c80;text-decoration:underline;text-underline-offset:2px;") as HTMLAnchorElement;
    anchor.href = href;
    if (!isWorkspaceHref(href)) {
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
    }
    children.forEach((child) => anchor.appendChild(child));
    return anchor;
  };

  // Inline markdown: **bold** and [text](url). Everything becomes text nodes;
  // only workspace paths and http(s) URLs become links.
  const inline = (text: string): Node[] => {
    const nodes: Node[] = [];
    const pattern = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
    let last = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(text))) {
      if (match.index > last) nodes.push(document.createTextNode(text.slice(last, match.index)));

      if (match[1] !== undefined) {
        nodes.push(el("strong", "font-weight:700;", match[1]));
      } else {
        const href = match[3];
        const label = [document.createTextNode(match[2])];
        nodes.push(isWorkspaceHref(href) || /^https?:\/\//.test(href) ? link(href, label) : label[0]);
      }

      last = pattern.lastIndex;
    }

    if (last < text.length) nodes.push(document.createTextNode(text.slice(last)));
    return nodes;
  };

  const markdown = (content: string) => {
    const wrapper = el("div", "min-width:0;overflow-wrap:anywhere;line-height:1.7;");
    const blocks = content.replace(/\r/g, "").split(/\n\s*\n/);

    blocks.forEach((block, index) => {
      const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
      if (lines.length === 0) return;

      const spacing = index === 0 ? "" : "margin-top:0.85rem;";
      const bullet = /^[-*]\s+/;
      const numbered = /^\d+[.)]\s+/;
      let node: HTMLElement;

      if (lines.every((line) => bullet.test(line)) || lines.every((line) => numbered.test(line))) {
        const ordered = numbered.test(lines[0]);
        node = el(ordered ? "ol" : "ul", `${spacing}padding-left:1.4rem;list-style:${ordered ? "decimal" : "disc"};`);
        lines.forEach((line, lineIndex) => {
          const item = el("li", lineIndex === 0 ? "" : "margin-top:0.6rem;");
          inline(line.replace(ordered ? numbered : bullet, "")).forEach((child) => item.appendChild(child));
          node.appendChild(item);
        });
      } else {
        node = el("p", spacing);
        lines.forEach((line, lineIndex) => {
          if (lineIndex > 0) node.appendChild(document.createElement("br"));
          inline(line.replace(/^#+\s+/, "")).forEach((child) => node.appendChild(child));
        });
      }

      wrapper.appendChild(node);
    });

    return wrapper;
  };

  const formatDate = (value: string | null) => {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return "Meeting date not captured";
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(
      new Date(`${value}T00:00:00Z`),
    );
  };

  // Titles for cited meetings. Newer workspaces send them with the answer;
  // older ones only send ids, so the archive is read once to name them.
  const loadMeetings = async () => {
    if (meetings) return meetings;
    meetings = new Map();
    try {
      const response = await fetch(`${BASE}/api/meeting-notes`, { cache: "no-store" });
      const payload = await response.json();
      if (payload && Array.isArray(payload.notes)) {
        payload.notes.forEach((note: { id?: unknown; title?: unknown; meetingDate?: unknown }) => {
          if (typeof note.id === "string" && typeof note.title === "string") {
            meetings!.set(note.id, {
              title: note.title,
              meetingDate: typeof note.meetingDate === "string" ? note.meetingDate : null,
            });
          }
        });
      }
    } catch {
      // Without titles the sources list is simply left out.
    }
    return meetings;
  };

  const starters = () => {
    const path = appPath();
    if (path.startsWith("/roadmap"))
      return [
        "Summarize the roadmap in plain language.",
        "What is still open for discussion on the roadmap?",
        "What is the difference between a must-have and a nice-to-have?",
      ];
    if (path.startsWith("/workstreams/"))
      return [
        "Explain this workstream in plain language.",
        "Who owns this workstream, and what are they on the hook for?",
        "What has changed in this workstream recently?",
      ];
    if (path.startsWith("/workstreams"))
      return [
        "What are the workstreams, in one line each?",
        "Which workstream covers district data and safety?",
        "Who owns each workstream?",
      ];
    if (path.startsWith("/meeting-notes") || path.startsWith("/meeting-agendas"))
      return [
        "What did we decide in the most recent meetings?",
        "What is still unresolved from the last few meetings?",
        "When do the two teams meet, and what is each meeting for?",
      ];
    if (path.startsWith("/action-items"))
      return [
        "What follow-ups came out of the last meeting?",
        "Who owns the follow-ups from the last meeting?",
        "Where do action items come from?",
      ];
    if (path.startsWith("/people"))
      return [
        "Who should I talk to about district data and safety?",
        "Who is on the OneGoal side, and what does each person do?",
        "Who owns each workstream?",
      ];
    return [
      "Give me the short version of this partnership.",
      "What is happening in the next 30 days?",
      "Where do I find the decisions we have made?",
    ];
  };

  // --- Skeleton -------------------------------------------------------------

  const root = el("div");
  root.setAttribute(MARK, "");

  const keyframes = el("style", "", `@keyframes willow-alma-spin{to{transform:rotate(360deg)}}`);
  root.appendChild(keyframes);

  const launcher = el(
    "button",
    `position:fixed;bottom:20px;right:20px;z-index:40;display:inline-flex;align-items:center;gap:10px;border:0;border-radius:9999px;background:${NAVY};padding:8px 20px 8px 8px;font:inherit;font-size:14px;font-weight:800;color:#fff;cursor:pointer;box-shadow:0 10px 28px rgba(23,27,74,0.28);transition:transform 150ms;`,
  ) as HTMLButtonElement;
  launcher.type = "button";
  launcher.setAttribute("aria-label", "Ask Alma, the partnership workspace guide");
  launcher.appendChild(mark(32));
  launcher.appendChild(document.createTextNode("Ask Alma"));
  hover(launcher, "transform:translateY(-2px);", "transform:none;");
  root.appendChild(launcher);

  const dialog = el(
    "section",
    "position:fixed;z-index:40;display:flex;flex-direction:column;overflow:hidden;background:#fff;color:#252b37;",
  );
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-label", "Alma, the partnership workspace guide");
  root.appendChild(dialog);

  const layout = () => {
    const wide = window.matchMedia("(min-width: 640px)").matches;
    dialog.style.cssText += wide
      ? "inset:auto 20px 20px auto;width:26rem;height:min(44rem, calc(100dvh - 2.5rem));border:1px solid rgba(23,27,74,0.1);border-radius:16px;box-shadow:0 18px 48px rgba(23,27,74,0.24);"
      : "inset:0;width:auto;height:auto;border:0;border-radius:0;box-shadow:none;";
  };
  layout();
  window.addEventListener("resize", layout);

  const header = el("header", "display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(23,27,74,0.1);padding:16px 20px;");
  header.appendChild(mark(36));
  const titles = el("div", "min-width:0;flex:1;");
  titles.appendChild(el("h2", `margin:0;font-size:18px;font-weight:600;letter-spacing:-0.03em;color:${NAVY};`, "Alma"));
  titles.appendChild(el("p", `margin:0;font-size:12px;color:${SOFT};`, "Your guide to the partnership workspace"));
  header.appendChild(titles);

  const startOver = el(
    "button",
    `flex-shrink:0;border:0;border-radius:9999px;background:transparent;padding:6px 12px;font:inherit;font-size:12px;font-weight:700;color:${MUTED};cursor:pointer;`,
    "Start over",
  ) as HTMLButtonElement;
  startOver.type = "button";
  hover(startOver, `background:#f1f1ed;color:${NAVY};`, `background:transparent;color:${MUTED};`);
  header.appendChild(startOver);

  const closeButton = el(
    "button",
    `display:grid;place-items:center;flex-shrink:0;width:36px;height:36px;border:1px solid rgba(23,27,74,0.1);border-radius:9999px;background:#fff;font:inherit;font-size:20px;line-height:1;color:${MUTED};cursor:pointer;`,
    "×",
  ) as HTMLButtonElement;
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close Alma");
  hover(closeButton, `border-color:${AQUA};color:${NAVY};`, `border-color:rgba(23,27,74,0.1);color:${MUTED};`);
  header.appendChild(closeButton);
  dialog.appendChild(header);

  const conversation = el("div", "min-height:0;flex:1;overflow-y:auto;overscroll-behavior:contain;padding:20px;");
  dialog.appendChild(conversation);

  const form = el("form", "border-top:1px solid rgba(23,27,74,0.1);padding:16px 20px;margin:0;") as HTMLFormElement;
  const errorBox = el(
    "p",
    "margin:0 0 12px;border-radius:12px;background:#fff0ed;padding:10px 14px;font-size:14px;font-weight:600;color:#a52d1f;",
  );
  errorBox.setAttribute("role", "alert");
  form.appendChild(errorBox);

  const input = el(
    "textarea",
    "display:block;box-sizing:border-box;width:100%;resize:none;border:1px solid rgba(23,27,74,0.15);border-radius:12px;background:#fff;padding:10px 14px;font:inherit;font-size:14px;line-height:24px;color:#252b37;outline:none;",
  ) as HTMLTextAreaElement;
  input.rows = 2;
  input.maxLength = MAX_QUESTION;
  input.placeholder = "Ask about the plan, a workstream, a meeting…";
  input.setAttribute("aria-label", "Your question for Alma");
  input.addEventListener("focus", () => (input.style.cssText += `border-color:${AQUA};box-shadow:0 0 0 4px rgba(23,225,227,0.15);`));
  input.addEventListener("blur", () => (input.style.cssText += "border-color:rgba(23,27,74,0.15);box-shadow:none;"));
  form.appendChild(input);

  const footer = el("div", "margin-top:10px;display:flex;align-items:center;justify-content:space-between;gap:12px;");
  footer.appendChild(el("span", "font-size:12px;color:#8b9692;", "Enter to send · Shift+Enter for a new line"));
  const submit = el(
    "button",
    `border:0;border-radius:9999px;background:${CORAL};padding:10px 20px;font:inherit;font-size:14px;font-weight:800;color:${NAVY};cursor:pointer;`,
    "Ask",
  ) as HTMLButtonElement;
  submit.type = "submit";
  footer.appendChild(submit);
  form.appendChild(footer);
  dialog.appendChild(form);

  // --- Rendering ------------------------------------------------------------

  const sources = (citations: Citation[]) => {
    const known = citations.filter((citation) => meetings?.has(citation.meetingNoteId));
    if (known.length === 0) return null;

    const box = el("div", "margin-top:16px;border-top:1px solid rgba(23,27,74,0.1);padding-top:12px;");
    box.appendChild(
      el("p", `margin:0;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.13em;color:${RED};`, "Sources"),
    );
    const list = el("ul", "margin:8px 0 0;padding:0;list-style:none;");

    known.forEach((citation, index) => {
      const meeting = meetings!.get(citation.meetingNoteId)!;
      const item = el("li", index === 0 ? "" : "margin-top:8px;");
      const anchor = el("a", "display:block;border-radius:8px;padding:6px 8px;text-decoration:none;") as HTMLAnchorElement;
      anchor.href = `${BASE}/meeting-notes#meeting-note-${encodeURIComponent(citation.meetingNoteId)}`;
      hover(anchor, "background:#f1f1ed;", "background:transparent;");
      anchor.appendChild(el("span", `display:block;font-size:13px;font-weight:700;color:${NAVY};`, meeting.title));
      anchor.appendChild(el("span", `display:block;font-size:12px;color:${SOFT};`, formatDate(meeting.meetingDate)));
      if (citation.quote) {
        anchor.appendChild(
          el(
            "span",
            `display:block;margin-top:6px;border-left:2px solid #17e1e3;padding-left:10px;font-size:12px;font-style:italic;line-height:20px;color:${MUTED};`,
            `“${citation.quote}”`,
          ),
        );
      }
      item.appendChild(anchor);
      list.appendChild(item);
    });

    box.appendChild(list);
    return box;
  };

  const renderConversation = () => {
    conversation.replaceChildren();

    if (turns.length === 0) {
      conversation.appendChild(
        el(
          "p",
          `margin:0;line-height:24px;color:${MUTED};`,
          "Hi, I'm Alma. Ask me anything about the partnership, or where to find something in this workspace. I answer from the operating plan, the workstreams, and the meeting record.",
        ),
      );
      conversation.appendChild(
        el(
          "p",
          `margin:20px 0 0;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.13em;color:${RED};`,
          "Try asking",
        ),
      );
      const list = el("div", "margin-top:12px;display:flex;flex-direction:column;gap:8px;");
      starters().forEach((starter) => {
        const button = el(
          "button",
          `width:100%;border:1px solid rgba(23,27,74,0.12);border-radius:12px;background:#fafaf7;padding:12px 14px;text-align:left;font:inherit;font-size:13px;font-weight:600;line-height:20px;color:${NAVY};cursor:pointer;`,
          starter,
        ) as HTMLButtonElement;
        button.type = "button";
        button.disabled = isPending;
        hover(button, `border-color:${AQUA};background:#fff;`, "border-color:rgba(23,27,74,0.12);background:#fafaf7;");
        button.addEventListener("click", () => void ask(starter));
        list.appendChild(button);
      });
      conversation.appendChild(list);
    } else {
      turns.forEach((turn, index) => {
        const spacing = index === 0 ? "" : "margin-top:20px;";
        if (turn.role === "user") {
          const row = el("div", `${spacing}display:flex;justify-content:flex-end;`);
          row.appendChild(
            el(
              "p",
              `margin:0;max-width:85%;border-radius:16px 16px 6px 16px;background:${NAVY};padding:10px 16px;font-size:14px;line-height:24px;color:#fff;white-space:pre-wrap;overflow-wrap:anywhere;`,
              turn.content,
            ),
          );
          conversation.appendChild(row);
        } else {
          const bubble = el(
            "div",
            `${spacing}border:1px solid rgba(23,27,74,0.1);border-radius:16px 16px 16px 6px;background:#fafaf7;padding:14px 16px;font-size:14px;color:#252b37;`,
          );
          bubble.appendChild(markdown(turn.content));
          const list = turn.citations ? sources(turn.citations) : null;
          if (list) bubble.appendChild(list);
          conversation.appendChild(bubble);
        }
      });
    }

    if (isPending) {
      const status = el(
        "div",
        "margin-top:20px;display:flex;align-items:center;gap:12px;border-radius:12px;background:#e8f9ea;padding:12px 16px;font-size:14px;font-weight:600;color:#315c3b;",
      );
      status.setAttribute("role", "status");
      status.appendChild(
        el(
          "span",
          "display:block;width:16px;height:16px;border-radius:9999px;border:2px solid rgba(49,92,59,0.25);border-top-color:#315c3b;animation:willow-alma-spin 0.8s linear infinite;",
        ),
      );
      status.appendChild(document.createTextNode("Alma is reading the workspace…"));
      conversation.appendChild(status);
    }

    conversation.scrollTop = conversation.scrollHeight;
  };

  const renderControls = () => {
    errorBox.textContent = error;
    errorBox.style.display = error ? "block" : "none";
    input.disabled = isPending;
    input.style.background = isPending ? "#f1f1ed" : "#fff";
    submit.textContent = isPending ? "Asking…" : "Ask";
    submit.disabled = isPending || input.value.trim().length === 0;
    submit.style.opacity = submit.disabled ? "0.5" : "1";
    submit.style.cursor = submit.disabled ? "not-allowed" : "pointer";
    startOver.style.display = turns.length > 0 ? "inline-block" : "none";
    startOver.disabled = isPending;
  };

  let isPanelOpen = false;

  const renderVisibility = () => {
    launcher.style.display = !isPanelOpen && !isOpen ? "inline-flex" : "none";
    dialog.style.display = !isPanelOpen && isOpen ? "flex" : "none";
  };

  const render = () => {
    renderConversation();
    renderControls();
    renderVisibility();
  };

  // --- Behaviour ------------------------------------------------------------

  const setOpen = (open: boolean) => {
    isOpen = open;
    save();
    renderVisibility();
    window.requestAnimationFrame(() => (open ? input.focus() : launcher.focus()));
  };

  async function ask(raw: string) {
    const question = raw.trim();
    if (!question || isPending) return;

    const history = turns.slice(-MAX_HISTORY).map(({ role, content }) => ({
      role,
      content: content.slice(0, MAX_HISTORY_CHARS),
    }));

    error = "";
    isPending = true;
    input.value = "";
    turns.push({ role: "user", content: question });
    render();

    try {
      const response = await fetch(`${BASE}/api/ask`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question, history, assistant: "alma", currentPage: appPath() }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload && typeof payload.error === "string" ? payload.error : "Alma could not answer that.");
      }

      if (!payload || typeof payload.answer !== "string" || !Array.isArray(payload.citations)) {
        throw new Error("Alma returned an incomplete answer.");
      }

      const citations: Citation[] = payload.citations.filter(
        (citation: Citation) =>
          citation && typeof citation.meetingNoteId === "string" && (citation.quote === null || typeof citation.quote === "string"),
      );

      if (Array.isArray(payload.citedMeetings)) {
        meetings = meetings ?? new Map();
        payload.citedMeetings.forEach((meeting: { id?: unknown; title?: unknown; meetingDate?: unknown }) => {
          if (typeof meeting.id === "string" && typeof meeting.title === "string") {
            meetings!.set(meeting.id, {
              title: meeting.title,
              meetingDate: typeof meeting.meetingDate === "string" ? meeting.meetingDate : null,
            });
          }
        });
      }

      if (citations.some((citation) => !meetings?.has(citation.meetingNoteId))) {
        await loadMeetings();
      }

      turns.push({ role: "assistant", content: payload.answer, citations });
    } catch (askError) {
      error = askError instanceof Error ? askError.message : "Alma could not answer that.";
      // Put the question back so a failed ask is one click from a retry.
      turns.pop();
      input.value = question;
    }

    isPending = false;
    save();
    render();
    input.focus();
  }

  launcher.addEventListener("click", () => setOpen(true));
  closeButton.addEventListener("click", () => setOpen(false));
  startOver.addEventListener("click", () => {
    turns = [];
    error = "";
    save();
    render();
    input.focus();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    void ask(input.value);
  });
  input.addEventListener("input", renderControls);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void ask(input.value);
    }
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen && dialog.style.display !== "none") setOpen(false);
  });

  // --- Mounting -------------------------------------------------------------

  const hasNativeAlma = () =>
    Array.from(document.querySelectorAll(`${NATIVE_LAUNCHER}, ${NATIVE_DIALOG}`)).some((node) => !root.contains(node));

  let observer: MutationObserver | null = null;
  let queued = false;

  const sync = () => {
    queued = false;

    if (hasNativeAlma()) {
      root.remove();
      observer?.disconnect();
      window.removeEventListener("resize", layout);
      return;
    }

    if (!root.isConnected) document.body.appendChild(root);

    const panelOpen = Boolean(document.querySelector(PAGE_PANELS));
    if (panelOpen !== isPanelOpen) {
      isPanelOpen = panelOpen;
      renderVisibility();
    }
  };

  const start = () => {
    render();
    sync();
    if (!root.isConnected) return;

    // Starter questions follow the page as the workspace navigates in place.
    let lastPath = appPath();
    observer = new MutationObserver(() => {
      if (appPath() !== lastPath) {
        lastPath = appPath();
        if (turns.length === 0) renderConversation();
      }
      if (!queued) {
        queued = true;
        window.requestAnimationFrame(sync);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };

  // Wait until the workspace has finished hydrating, as the FAQ links do.
  if (document.readyState === "complete") {
    window.setTimeout(start, 0);
  } else {
    window.addEventListener("load", () => window.setTimeout(start, 0));
  }
}

export const WORKSPACE_ALMA_SCRIPT = `<script data-willow-alma-script>(${workspaceAlmaScript.toString()})();</script>`;
