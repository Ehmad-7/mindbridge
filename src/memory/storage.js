export const saveUniversalChat = (
  chat
) => {

  const existing =

    JSON.parse(

      localStorage.getItem(
        "mindbridge_chats"
      ) || "[]"

    )

  existing.push(chat)

  localStorage.setItem(

    "mindbridge_chats",

    JSON.stringify(existing)

  )

  console.log(
    "Universal chat saved"
  )

}

export const getUniversalChats = () => {

  return JSON.parse(

    localStorage.getItem(
      "mindbridge_chats"
    ) || "[]"

  )

}