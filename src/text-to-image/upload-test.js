const axios = require("axios");
const FormData = require("form-data");
const { toBuffer } = require("./convert");

const share = async (data, config) => {
  try {
    const axiosInstance = axios.create({
      baseURL: "https://api.weibo.com/",
      timeout: 120000,
      validateStatus: status => {
        return status >= 200 && status < 300; // default
      }
    });
    const response = await axiosInstance.post(
      "/statuses/share.json",
      data,
      config
    );
    const {
      data: {
        user: { idstr }
      }
    } = response;
    // share link address
    return `https://weibo.com/${idstr}/profile`;
  } catch (error) {
    console.log("error 01", error);
    throw new Error(`failed to share: [${error}].`);
  }
};

module.exports = { share };
