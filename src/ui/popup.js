const output =
  document.getElementById(
    "output"
  )

const status =
  document.getElementById(
    "status"
  )

/* =========================================
Show Status
========================================= */

const showStatus = (
  message
) => {

  status.innerText =
    message

}

/* =========================================
Get Chats
========================================= */

const getChats =
async () => {

  const result =

    await chrome.storage.local.get(
      "mindbridge_chats"
    )

  return (
    result.mindbridge_chats
    || []
  )

}

/* =========================================
Save Chats
========================================= */

const saveChats =
async (chats) => {

  await chrome.storage.local.set({

    mindbridge_chats:
      chats

  })

}

/* =========================================
Render Single Chat
========================================= */

const renderConversation =
(chat) => {

  output.innerHTML = ""

  /* Back button */

  const backButton =
    document.createElement(
      "button"
    )

  backButton.innerText =
    "← Back"

  backButton.addEventListener(
    "click",
    async () => {

      const chats =
        await getChats()

      renderChats(chats)

    }
  )

  output.appendChild(
    backButton
  )

  /* Title */

  const title =
    document.createElement(
      "h2"
    )

  title.innerText =
    chat.title

  output.appendChild(
    title
  )

  /* Messages */

  chat.messages.forEach(
    message => {

      const bubble =
        document.createElement(
          "div"
        )

      bubble.className =
        `message ${message.role}`

      bubble.innerHTML = `

        <div class="message-role">
          ${message.role}
        </div>

        <div class="message-content">
          ${message.content}
        </div>

      `

      output.appendChild(
        bubble
      )

    }
  )

}

/* =========================================
Render Chat Cards
========================================= */

const renderChats = (
  chats
) => {

  if (!chats.length) {

    output.innerHTML =

      `<p>No chats found</p>`

    return

  }

  output.innerHTML = ""

  chats.forEach(chat => {

    const card =
      document.createElement(
        "div"
      )

    card.className =
      "chat-card"

    card.innerHTML = `

      <div class="chat-title">
        ${chat.title}
      </div>

      <div class="chat-platform">
        ${chat.platform}
      </div>

      <div class="chat-meta">

        ${chat.messages.length}
        messages

      </div>

    `

    card.addEventListener(
      "click",
      () => {

        renderConversation(
          chat
        )

      }
    )

    output.appendChild(card)

  })

}

/* =========================================
Show Memory
========================================= */

document
  .getElementById(
    "showMemory"
  )
  .addEventListener(
    "click",
    async () => {

      const chats =
        await getChats()

      renderChats(
        chats
      )

      showStatus(
        `${chats.length} chats loaded`
      )

    }
  )

/* =========================================
Export Memory
========================================= */

document
  .getElementById(
    "exportMemory"
  )
  .addEventListener(
    "click",
    async () => {

      const chats =
        await getChats()

      const blob =

        new Blob(

          [
            JSON.stringify(
              chats,
              null,
              2
            )
          ],

          {
            type:
              "application/json"
          }

        )

      const url =

        URL.createObjectURL(
          blob
        )

      const a =
        document.createElement(
          "a"
        )

      a.href = url

      a.download =
        "mindbridge-export.json"

      a.click()

      URL.revokeObjectURL(
        url
      )

      showStatus(
        "Memory exported"
      )

    }
  )

/* =========================================
Import Memory
========================================= */

document
  .getElementById(
    "importMemory"
  )
  .addEventListener(
    "click",
    () => {

      document
        .getElementById(
          "importFile"
        )
        .click()

    }
  )

/* =========================================
Handle Import
========================================= */

document
  .getElementById(
    "importFile"
  )
  .addEventListener(
    "change",
    async (event) => {

      const file =
        event.target.files[0]

      if (!file)
        return

      const reader =
        new FileReader()

      reader.onload =
        async (e) => {

          try {

            const importedChats =

              JSON.parse(
                e.target.result
              )

            if (
              !Array.isArray(
                importedChats
              )
            ) {

              throw new Error(
                "Invalid format"
              )

            }

            await saveChats(
              importedChats
            )

            renderChats(
              importedChats
            )

            showStatus(
              `${importedChats.length} chats imported`
            )

          }

          catch (error) {

            console.log(
              "Import error:",
              error
            )

            showStatus(
              "Import failed"
            )

          }

        }

      reader.readAsText(file)

    }
  )

/* =========================================
Clear Memory
========================================= */

document
  .getElementById(
    "clearMemory"
  )
  .addEventListener(
    "click",
    async () => {

      await chrome.storage.local.remove(
        "mindbridge_chats"
      )

      output.innerHTML = ""

      showStatus(
        "Memory cleared"
      )

    }
  )