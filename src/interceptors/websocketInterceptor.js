export const interceptWebSocket = () => {

  const OriginalWebSocket =
    window.WebSocket

  window.WebSocket =
    function (...args) {

      console.log(
        "WebSocket detected:",
        args[0]
      )

      return new OriginalWebSocket(
        ...args
      )

    }

}