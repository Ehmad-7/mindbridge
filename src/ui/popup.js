document
  .getElementById(
    "exportMemory"
  )
  .addEventListener(
    "click",
    () => {

      const chats =

        JSON.parse(

          localStorage.getItem(
            "mindbridge_chats"
          ) || "[]"

        )

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

    }
  )