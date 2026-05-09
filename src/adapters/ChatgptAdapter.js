export class ChatGPTAdapter {

  static matches(hostname) {

    return (
      hostname.includes("chatgpt.com")
      ||
      hostname.includes("chat.openai.com")
    )

  }

  static parseConversation(data) {

    if (!data?.mapping)
      return null

    const messages = []

    Object.values(data.mapping)
      .forEach(node => {

        const message =
          node.message

        if (!message)
          return

        const role =
          message.author?.role

        const parts =
          message.content?.parts

        if (
          !parts
          ||
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