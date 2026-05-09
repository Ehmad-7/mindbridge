console.log(
  "MindBridge page script active"
)

/* =========================================
Save chats
========================================= */

const saveUniversalChat =
(chat) => {

  const existing =

    JSON.parse(

      localStorage.getItem(
        "mindbridge_chats"
      ) || "[]"

    )

  const alreadyExists =

  existing.some(existingChat =>

    existingChat.conversationId
    ===
    chat.conversationId

  )

if (alreadyExists) {

  console.log(
    "Conversation already saved"
  )

  return

}

existing.push(chat)

  localStorage.setItem(

    "mindbridge_chats",

    JSON.stringify(existing)

  )

  console.log(
    "Universal chat saved"
  )

}

/* =========================================
ChatGPT Adapter
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

      if (
        !url.includes(
          "conversation"
        )
      ) {

        return response

      }

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
        "INTERCEPTED DATA:",
        data
      )

      const universalChat =

        parseChatGPTConversation(
          data
        )

      if (!universalChat)
        return response

      console.log(
        "UNIVERSAL CHAT:",
        universalChat
      )

      saveUniversalChat(
        universalChat
      )

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
WebSocket Interceptor
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