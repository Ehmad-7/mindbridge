import {
  adapters
}
from "../adapters/registry.js"

import {
  saveUniversalChat
}
from "../memory/storage.js"

export const interceptFetch = () => {

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

          typeof request === "string"

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

        const adapter =
          adapters.find(a =>
            a.matches(
              location.hostname
            )
          )

        if (!adapter)
          return response

        const universalChat =
          adapter.parseConversation(
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

}