import { createCanvas, loadImage } from "canvas";
import concat from "concat-stream";
import FormData from "form-data";
import fs from "fs";

type GenerateOpts = {
  formData: { [key: string]: string };
  imageFieldKey: string;
  imageText: string;
  uploadUrl: string;
};

const randomBackgrounds = (dir: fs.PathLike): Promise<string> => {
  return new Promise((resolve, reject) => {
    // tslint:disable-next-line: non-literal-fs-path
    if (fs.existsSync(dir)) {
      // tslint:disable-next-line: non-literal-fs-path
      fs.readdir(dir, (err, files) => {
        if (err) {
          reject(err);
        }
        if (files.length === 0) {
          reject("images is empty");
        }
        // tslint:disable-next-line: insecure-random
        const randomBg = Math.floor(Math.random() * files.length);
        resolve(`${dir}//${files[randomBg]}`);
      });
    } else {
      reject("dir is undefined");
    }
  });
};

const generateImage = async (imageText: string): Promise<Buffer> => {
  try {
    const canvas = createCanvas(600, 600);
    const ctx = canvas.getContext("2d");
    let content = imageText.trim();
    const xOffset = 90;
    let yOffset = 160;
    const bgSrc = await randomBackgrounds("src/text-to-image/images");
    const image = await loadImage(bgSrc);
    ctx.drawImage(image, 0, 0, 600, 600);

    ctx.globalAlpha = 1;
    ctx.font = "bold 40px Helvetica, Arial, sans-serif";

    ctx.fillStyle = "#fff";
    // text area: 420 x 360, 7 line
    ctx.fillText('"', xOffset - ctx.measureText('"').width, yOffset);
    for (let index = 0; index < content.length; index++) {
      let currentRow = content.substring(0, index);
      const currentLength = ctx.measureText(content.substring(0, index)).width;
      if (index < content.length - 1) {
        const nextLength = ctx.measureText(content.substring(0, index + 1))
          .width;
        if (nextLength > 420) {
          const lastBlankIndex = currentRow.lastIndexOf(" ");
          if (lastBlankIndex > 0 && lastBlankIndex < index) {
            currentRow = content.substring(0, lastBlankIndex + 1);
            content = content.substring(lastBlankIndex + 1);
          } else {
            content = content.substring(index);
          }
          index = 0;
          ctx.fillText(currentRow, xOffset, yOffset);
          yOffset += 50;
          if (yOffset > 480) {
            ctx.fillText("...", xOffset + currentLength, yOffset - 50);
            break;
          }
          continue;
        }
      } else {
        ctx.fillText(`${content.substring(0)}"`, xOffset, yOffset);
      }
    }
    return new Promise((resolve, reject) => {
      const stream = canvas.createPNGStream();
      stream.pipe(
        concat(data => {
          resolve(data);
        })
      );
      stream.on("error", reject);
    });
  } catch (error) {
    throw error;
  }
};

// tslint:disable-next-line: no-any
const generateImageAndSend = async (opts: GenerateOpts): Promise<any> => {
  const { formData, imageText, imageFieldKey, uploadUrl } = opts;
  const fd = new FormData();
  for (const key of Object.keys(formData)) {
    fd.append(key, formData[key]);
  }
  const imageData = await generateImage(imageText);
  fd.append(imageFieldKey, imageData, {
    filename: "test.jpg",
    contentType: "image/png"
  });
  return new Promise((resolve, reject) => {
    fd.submit(uploadUrl, (error, res) => {
      if (error) {
        reject(error);
      }
      let str = "";
      res.on("data", chunk => {
        str += chunk;
      });
      res.on("end", () => {
        resolve({ data: JSON.parse(str) });
      });
      res.on("error", reject);
    });
  });
};

export { generateImageAndSend };
