import {createWriteStream} from "fs";
import {Upload} from "../types/Upload";

export function uploadImage({createReadStream, filename}: Upload, path: string): Promise<boolean> {
  return new Promise( (resolve, reject) => {
    createReadStream()
      .pipe(createWriteStream( path + filename))
      .on("finish", () => {
        resolve(true)
      })
      .on("error", () => {
        reject(false)
      })
  });
}
