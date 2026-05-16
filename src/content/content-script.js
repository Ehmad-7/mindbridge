

console.log(
  "MindBridge content script active"
)

/* =========================================
Inject page script
========================================= */

const injectPageScript =
() => {

  const scripts = [

    "src/adapters/registry.js",

    "src/adapters/chatgptAdapter.js",

    "src/adapters/claudeAdapter.js",

    "src/content/page-script.js"

  ]

  scripts.forEach(src => {

    const script =
      document.createElement(
        "script"
      )

    script.src =
      chrome.runtime.getURL(
        src
      )

    script.onload =
      () => script.remove()

    document.documentElement
      .appendChild(script)

  })

}

/* =========================================
Handle incoming chats
========================================= */

const handleIncomingChat =
async (chat) => {

  try {

    await window
  .MindBridgeStorage
  .addChat(chat)

  }

  catch (error) {

    console.log(
      "Storage error:",
      error
    )

  }

}

/* =========================================
Listen from page script
========================================= */

const initializeMessageListener =
() => {

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

      await handleIncomingChat(
        data.payload
      )

    }

  )

}

/* =========================================
Inject Memory
========================================= */

const injectMemory =
() => {

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

      new Event(
        "input",
        {
          bubbles: true
        }
      )

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

}

/* =========================================
Initialize
========================================= */

const initializeMindBridge =
() => {

  injectPageScript()

  initializeMessageListener()

  setTimeout(
    injectMemory,
    4000
  )

}

initializeMindBridge()