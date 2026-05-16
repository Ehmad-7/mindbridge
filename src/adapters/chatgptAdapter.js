const ChatGPTAdapter = {

  /* =====================================
  Detect ChatGPT
  ====================================== */

  detect() {

    return (
      location.hostname.includes(
        "chatgpt.com"
      )
    )

  },

  /* =====================================
  Parse Conversation
  ====================================== */

  parseConversation(data) {

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

}

ChatGPTAdapter.name =
  "ChatGPT"

window
  .MindBridgeAdapters
  .register(
    ChatGPTAdapter
  )