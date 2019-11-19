const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const concat = require("concat-stream");
const { share } = require("./upload-test");
const axios = require("axios");
const FormData = require("form-data");

const canvas = createCanvas(600, 600);
const ctx = canvas.getContext("2d");

const xOffset = 90;
let yOffset = 160;
let content =
  "I believe that telling our 中文文本 stories, first to ourselves and then to one another and the world, is a revolutionary act. 中文文本，不以空格分隔，不足一行直接结束，否则换行。";
content = content.trim();

const randomBackgrounds = dir => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dir)) {
      fs.readdir(dir, (err, files) => {
        if (err) {
          reject(err);
        }
        if (files.length === 0) {
          reject("images is empty");
        }
        const randomBg = Math.floor(Math.random() * files.length);
        resolve(`${dir}//${files[randomBg]}`);
      });
    } else {
      reject("dir is undefined");
    }
  });
};

const generateImage = async () => {
  try {
    let bgSrc = await randomBackgrounds("src/text-to-image/images");
    // Draw cat with lime helmet
    loadImage(bgSrc).then(image => {
      ctx.drawImage(image, 0, 0, 600, 600);

      ctx.globalAlpha = 1;
      ctx.font = "bold 40px Helvetica, Arial, sans-serif";

      ctx.fillStyle = "#fff";
      // 420 x 360, 最多 7 行；一行最大误差 20 px
      /**
       * 1. 计算一行最多能容纳多少字符，包括字母和汉字
       * 2. 英文单词默认以空格分割：逆向搜索最后一个空格，该空格之前为一行，之后放到下一行
       * 3. 开始下一行，纵轴加 50px, 横轴从 50 开始
       * 4. 第七行时，剩余字符大于一行最大宽度，执行 1，然后末尾补充 “..."
       * 5. 第七行时，剩余字符等于或小于一行最大宽度，结束
       * 6. 首尾补足 ""
       */
      ctx.fillText('"', xOffset - ctx.measureText('"').width, yOffset);
      for (let index = 0; index < content.length; index++) {
        let currentRow = content.substring(0, index);
        const currentLength = ctx.measureText(content.substring(0, index))
          .width;
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

      const out = fs.createWriteStream(__dirname + "/test.png");
      const stream = canvas.createPNGStream();
      stream.pipe(out);
      out.on("finish", () => {
        const fd = new FormData();
        fd.append("access_token", "2.00R1TKaC_dutRB1ef49208e80scvpU");
        fd.append(
          "status",
          `${"测试分享内容2"}${encodeURI("http://www.github.com")}`
        );
        // fd.append("pic", canvas.createPNGStream());
        fd.append("pic", fs.createReadStream(__dirname + "/test.png"));
        fd.submit("https://api.weibo.com/statuses/share.json", (error, res) => {
          if (error) {
            console.log("error", error);
          }
          res.resume();
          res.on("end", () => {
            if (!res.complete)
              console.error(
                "The connection was terminated while the message was still being sent"
              );
          });
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
};

generateImage();

/**
 * 1. 随机加载一张图片
 * 1.1 为图片增加文字
 * 2. canvas 创建 buffer
 * 3. axios 上传 buffer
 */

const toBuffer = async () => {
  const image = await loadImage("test.png");
  ctx.drawImage(image, 50, 0, 70, 70);
  return canvas.toBuffer();
};

module.exports = { toBuffer };
