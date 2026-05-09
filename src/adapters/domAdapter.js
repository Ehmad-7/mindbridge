export class DOMAdapter {

  static injectMemory(memory) {

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

  }

}