window.MindBridgeSchema = {

  /* =====================================
  Normalize Chats
  ====================================== */

  normalizeChats(chats) {

    return chats.map(chat => ({

      schemaVersion:
        "1.0",

      platform:
        chat.platform
        || "unknown",

      conversationId:
        chat.conversationId
        || crypto.randomUUID(),

      title:
        chat.title
        || "Untitled",

      timestamp:
        chat.timestamp
        || Date.now(),

      messages:

        (chat.messages || [])

          .filter(message =>

            message.content
            &&
            message.content.trim()
          )

          .map(message => ({

            role:

              message.role === "human"
                ? "user"
                : message.role,

            content:
              message.content.trim()

          }))

    }))

  }

}