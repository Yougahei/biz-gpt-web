import { atom, selector } from "recoil"

const convUID = atom({
  key: "convUID",
  default: undefined,
})

const convUIDState = selector({
  key: "convUIDState",
  get: async ({ get }) => {
    const id = get(convUID)
    if (id === undefined) {
      return undefined
    } else {
      const res = await fetch(
        "http://192.168.31.37:5000/api/v1/chat/dialogue/new",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_mode: "chat_normal",
          }),
        }
      )
      const data = await res.json()
      return data.data
    }
  },
})





export {convUIDState}
