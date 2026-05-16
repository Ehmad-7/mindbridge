window.MindBridgeStorage = {

  /* =====================================
  Get Chats
  ====================================== */

  async getChats() {

    const result =

      await chrome.storage.local.get(
        "mindbridge_chats"
      )

    return (
      result.mindbridge_chats
      || []
    )

  },

  /* =====================================
  Save Chats
  ====================================== */

  async saveChats(chats) {

    await chrome.storage.local.set({

      mindbridge_chats:
        chats

    })

  },

  /* =====================================
  Clear Chats
  ====================================== */

  async clearChats() {

    await chrome.storage.local.remove(
      "mindbridge_chats"
    )

  },

  /* =====================================
  Add Chat
  ====================================== */

  async addChat(chat) {

    const chats =
      await this.getChats()

    const exists =

      chats.some(
        existing =>

          existing.conversationId
          ===
          chat.conversationId

          &&

          existing.platform
          ===
          chat.platform
      )

    if (exists) {

      console.log(
        "Duplicate skipped"
      )

      return

    }

    chats.push(chat)

    await this.saveChats(
      chats
    )

    console.log(
      "Universal chat saved"
    )

  }

}