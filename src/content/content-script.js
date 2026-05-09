console.log(
  "MindBridge content script active"
)

/* =========================================
Inject page script
========================================= */

const script =
  document.createElement("script")

script.src =
  chrome.runtime.getURL(
    "src/content/page-script.js"
  )

script.onload = () => {

  script.remove()

}

document.documentElement.appendChild(
  script
)

/* =========================================
Memory Injection
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