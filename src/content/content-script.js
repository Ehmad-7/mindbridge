console.log(
  "MindBridge content script active"
)

/* =========================================
Inject page script
========================================= */

const script =
  document.createElement(
    "script"
  )

script.src =
  chrome.runtime.getURL(
    "src/content/page-script.js"
  )

script.onload = () => {

  script.remove()

}

document.documentElement
  .appendChild(script)

/* =========================================
Save Chat
========================================= */

const saveUniversalChat =
async (chat) => {

  const result =

    await chrome.storage.local.get(
      "mindbridge_chats"
    )

  const existing =

    result.mindbridge_chats
    || []

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

  await chrome.storage.local.set({

    mindbridge_chats:
      existing

  })

  console.log(
    "Universal chat saved"
  )

}

/* =========================================
Listen from page script
========================================= */

window.addEventListener(
  "message",

  async (event) => {

    if (
      event.source !== window
    ) return

    const data =
      event.data

    if (
      data.type !==
      "MINDBRIDGE_SAVE_CHAT"
    ) return

    console.log(
      "Received chat from page:",
      data.payload
    )

    await saveUniversalChat(
      data.payload
    )

  }
)

/* =========================================
Inject Memory
========================================= */

setTimeout(() => {

  try {

    const textarea =
      document.querySelector(
        "textarea"
      )

    if (!textarea) {

      console.log(
        "No textarea found"
      )

      return

    }

    textarea.focus()

    const memory =

`User Memory:
- User uses multiple AI models
- User is building MindBridge
- User wants AI portability`

    const nativeSetter =

      Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement
          .prototype,
        "value"
      ).set

    nativeSetter.call(
      textarea,
      memory
    )

    textarea.dispatchEvent(
      new Event("input", {
        bubbles: true
      })
    )

    console.log(
      "Memory injected"
    )

  }

  catch (error) {

    console.log(
      "Injection error:",
      error
    )

  }

}, 4000)