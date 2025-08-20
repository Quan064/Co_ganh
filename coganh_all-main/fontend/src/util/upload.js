
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import {firebaseApp} from "../firebase/config"

const storage = getStorage(firebaseApp);
console.log(storage)
const metadata = {
  contentType: 'image/jpeg'
};

export function uploadImage(image) {
  const storageRef = ref(storage, `image/${new Date().getTime()}.jpg`);
    
  return new Promise((resolve, reject) => {
    uploadBytes(storageRef, image, metadata).then((snapshot) => {
      console.log('Uploaded a blob or file!', snapshot);
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        resolve(downloadURL)
      });
    });
  })
}