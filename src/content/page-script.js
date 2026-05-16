console.log("MindBridge page script active");

/* =========================================
Send chat to extension
========================================= */

const sendChatToExtension = (chat) => {
  window.postMessage({
    type: "MINDBRIDGE_SAVE_CHAT",

    payload: chat,
  });
};

/* =========================================
Find Adapter
========================================= */
const getAdapter =
(name) => {

  return window
    .MindBridgeAdapters
    .getAdapters()
    .find(adapter =>

      adapter.name === name

    )

}
/* =========================================
ChatGPT Parser
========================================= */

/* =========================================
Claude Parser
========================================= */

/* =========================================
Fetch Interceptor
========================================= */

const originalFetch = window.fetch;

window.fetch = async (...args) => {
  const response = await originalFetch(...args);

  try {
    const request = args[0];

    const url = typeof request === "string" ? request : request.url;

    console.log("FETCH DETECTED:", url);

    /* =====================================
      CHATGPT
      ====================================== */

    if (url.includes("/conversation/")) {
      const cloned = response.clone();

      let data;

      try {
        data = await cloned.json();
      } catch {
        data = await cloned.text();
      }

      const universalChat = getAdapter(
  "ChatGPT"
)
?.parseConversation(
  data
)

      if (universalChat) {
        console.log("CHATGPT CHAT:", universalChat);

        sendChatToExtension(universalChat);
      }
    }

    /* =====================================
      CLAUDE INTERCEPT
      ====================================== */

    if (url.includes("chat_conversations") && url.includes("tree=True")) {
      console.log("CLAUDE CONVERSATION DETECTED");

      const cloned = response.clone();

      let data;

      try {
        data = await cloned.json();
      } catch {
        data = await cloned.text();
      }

      console.log("CLAUDE RAW:", data);

      const universalChat = getAdapter(
  "Claude"
)
?.parseConversation(
  data,
  url
)

      if (universalChat) {
        console.log("CLAUDE CHAT:", universalChat);

        sendChatToExtension(universalChat);
      }
    }
  } catch (error) {
    console.log("Fetch interceptor error:", error);
  }

  return response;
};

/* =========================================
WebSocket Detection
========================================= */

const OriginalWebSocket = window.WebSocket;

window.WebSocket = function (...args) {
  console.log("WebSocket detected:", args[0]);

  return new OriginalWebSocket(...args);
};

/* =========================================
Direct Claude Fetch
========================================= */

const fetchClaudeConversation = async () => {
  try {
    if (!location.hostname.includes("claude.ai")) return;

    const path = window.location.pathname;

    console.log("CLAUDE PATH:", path);

    const match = path.match(/chat\/(.+)/);

    if (!match) {
      console.log("No Claude conversation");

      return;
    }

    const conversationId = match[1];

    console.log("Claude Conversation ID:", conversationId);

    const orgMatch = document.documentElement.innerHTML.match(
      /"organization_uuid":"(.*?)"/,
    );

    if (!orgMatch) {
      console.log("Organization ID not found");

      return;
    }

    const organizationId = orgMatch[1];

    console.log("Organization ID:", organizationId);

    const endpoint = `/api/organizations/${organizationId}/chat_conversations/${conversationId}?tree=True&rendering_mode=messages&render_all_tools=true`;

    console.log("FETCHING CLAUDE:", endpoint);

    const response = await fetch(endpoint);

    const data = await response.json();

    console.log("CLAUDE RAW:", data);

    const universalChat = getAdapter(
  "Claude"
)
?.parseConversation(
  data,
  endpoint
);

    if (!universalChat) return;

    console.log("CLAUDE CHAT:", universalChat);

    sendChatToExtension(universalChat);
  } catch (error) {
    console.log("Claude direct fetch error:", error);
  }
};

/* =========================================
Run Claude Fetch
========================================= */

setTimeout(fetchClaudeConversation, 3000);
