console.log(
  "MindBridge page script active"
)

/* =========================================
Send chat to extension
========================================= */

const sendChatToExtension =
(chat) => {

  window.postMessage({

    type:
      "MINDBRIDGE_SAVE_CHAT",

    payload:
      chat

  })

}

/* =========================================
ChatGPT Parser
========================================= */

const parseChatGPTConversation =
(data) => {

  if (!data?.mapping)
    return null

  const messages = []

  Object.values(
    data.mapping
  ).forEach(node => {

    const message =
      node.message

    if (!message)
      return

    const role =
      message.author?.role

    const parts =
      message.content?.parts

    if (
      !parts ||
      !parts.length
    ) return

    messages.push({

      role,

      content:
        parts.join(" ")

    })

  })

  return {

    platform:
      "chatgpt",

    conversationId:
      data.conversation_id
      || null,

    title:
      data.title
      || "Untitled",

    timestamp:
      Date.now(),

    messages

  }

}

/* =========================================
Claude Parser
========================================= */

const parseClaudeConversation =
(data, url) => {

  if (!data?.chat_messages)
    return null

  const messages =

    data.chat_messages.map(
      message => ({

        role:
          message.sender
          || "assistant",

        content:

          message.content
            ?.map(block =>
              block.text || ""
            )
            .join(" ")

          || ""

      })
    )

  let conversationId = null

  try {

    conversationId =

      url.split(
        "/chat_conversations/"
      )[1]?.split("?")[0]

  }

  catch {

    conversationId =
      crypto.randomUUID()

  }

  return {

    platform:
      "claude",

    conversationId,

    title:
      data.name
      || "Claude Chat",

    timestamp:
      Date.now(),

    messages

  }

}

/* =========================================
Fetch Interceptor
========================================= */

const originalFetch =
  window.fetch

window.fetch =
  async (...args) => {

    const response =
      await originalFetch(...args)

    try {

      const request =
        args[0]

      const url =

        typeof request ===
        "string"

          ? request

          : request.url

      console.log(
        "FETCH DETECTED:",
        url
      )

      /* =====================================
      CHATGPT
      ====================================== */

      if (
        url.includes(
          "/conversation/"
        )
      ) {

        const cloned =
          response.clone()

        let data

        try {

          data =
            await cloned.json()

        }

        catch {

          data =
            await cloned.text()

        }

        const universalChat =

          parseChatGPTConversation(
            data
          )

        if (
          universalChat
        ) {

          console.log(
            "CHATGPT CHAT:",
            universalChat
          )

          sendChatToExtension(
            universalChat
          )

        }

      }

      /* =====================================
      CLAUDE INTERCEPT
      ====================================== */

      if (
        url.includes(
          "chat_conversations"
        )

        &&

        url.includes(
          "tree=True"
        )
      ) {

        console.log(
          "CLAUDE CONVERSATION DETECTED"
        )

        const cloned =
          response.clone()

        let data

        try {

          data =
            await cloned.json()

        }

        catch {

          data =
            await cloned.text()

        }

        console.log(
          "CLAUDE RAW:",
          data
        )

        const universalChat =

          parseClaudeConversation(
            data,
            url
          )

        if (
          universalChat
        ) {

          console.log(
            "CLAUDE CHAT:",
            universalChat
          )

          sendChatToExtension(
            universalChat
          )

        }

      }

    }

    catch (error) {

      console.log(
        "Fetch interceptor error:",
        error
      )

    }

    return response

}

/* =========================================
WebSocket Detection
========================================= */

const OriginalWebSocket =
  window.WebSocket

window.WebSocket =
  function (...args) {

    console.log(
      "WebSocket detected:",
      args[0]
    )

    return new OriginalWebSocket(
      ...args
    )

}

/* =========================================
Direct Claude Fetch
========================================= */

const fetchClaudeConversation =
async () => {

  try {

    if (
      !location.hostname.includes(
        "claude.ai"
      )
    ) return

    const path =
      window.location.pathname

    console.log(
      "CLAUDE PATH:",
      path
    )

    const match =

      path.match(
        /chat\/(.+)/
      )

    if (!match) {

      console.log(
        "No Claude conversation"
      )

      return

    }

    const conversationId =
      match[1]

    console.log(
      "Claude Conversation ID:",
      conversationId
    )

    const orgMatch =

      document.documentElement
        .innerHTML
        .match(
          /"organization_uuid":"(.*?)"/
        )

    if (!orgMatch) {

      console.log(
        "Organization ID not found"
      )

      return

    }

    const organizationId =
      orgMatch[1]

    console.log(
      "Organization ID:",
      organizationId
    )

    const endpoint =

`/api/organizations/${organizationId}/chat_conversations/${conversationId}?tree=True&rendering_mode=messages&render_all_tools=true`

    console.log(
      "FETCHING CLAUDE:",
      endpoint
    )

    const response =
      await fetch(endpoint)

    const data =
      await response.json()

    console.log(
      "CLAUDE RAW:",
      data
    )

    const universalChat =

      parseClaudeConversation(
        data,
        endpoint
      )

    if (!universalChat)
      return

    console.log(
      "CLAUDE CHAT:",
      universalChat
    )

    sendChatToExtension(
      universalChat
    )

  }

  catch (error) {

    console.log(
      "Claude direct fetch error:",
      error
    )

  }

}

/* =========================================
Run Claude Fetch
========================================= */

setTimeout(
  fetchClaudeConversation,
  3000
)