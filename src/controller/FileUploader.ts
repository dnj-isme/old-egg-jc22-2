import { APIResponse, From } from "@/database/api";
import axios from "axios";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import ShowNotification from "./NotificationController";

// export default async function uploadImage(file: File, path: string) {
//   let stuff = file.name.split('.');
//   path += `/${v4()}.${stuff[stuff.length - 1]}`
//   const imageRef = ref(Conn.storage, path);
//   const uploaded = await uploadBytes(imageRef, file)
//   return await getDownloadURL(uploaded.ref);
// }

export default async function uploadImage(file: File, path: string) : Promise<APIResponse> {
  let stuff = file.name.split('.');
  path += (path.endsWith("/") ? "" : "/") +`${v4()}.${stuff[stuff.length - 1]}`

  try {
    const res = await axios({
    url: "https://firebasestorage.googleapis.com/v0/b/jc-oldegg.appspot.com/o?uploadType=media&name=" + path,
      method: "POST",
      headers: {
        "Content-Type": "image/jpeg"
      },
      data: file
    })

    path = path.replaceAll("/", "%2F")
    return {
      data: "https://firebasestorage.googleapis.com/v0/b/jc-oldegg.appspot.com/o/" + path + "?alt=media",
      raw: res,
      status: res.status,
      success: true
    }
  }
  catch(e: any) {
    return {
      raw: e,
      status: e.response.status,
      data: e.response.data.error,
      success: false
    }
  }
}