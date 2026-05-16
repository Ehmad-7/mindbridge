const ClaudeAdapter = {

  /* =====================================
  Detect Claude
  ====================================== */

  detect() {

    return (
      location.hostname.includes(
        "claude.ai"
      )
    )

  },

  /* =====================================
  Parse Conversation
  ====================================== */

  parseConversation(
    data,
    url
  ) {

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

    let conversationId =
      null

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

}

ClaudeAdapter.name =
  "Claude"

window
  .MindBridgeAdapters
  .register(
    ClaudeAdapter
  )