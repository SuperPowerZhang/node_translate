// @ts-ignore
import { privateKey, appid } from "private.js"
import * as https from "https";
import * as querystring from "querystring";
import md5 = require("md5");

export const translate = (word: string) => {
  console.log('1111111')
  let q = word;
  let from = "en";
  let to = "zh";
  if (!/[a - zA - Z]/.test(word)) {
    from = "zh";
    to = "en";
  }
  const salt = Math.random();
  const sign = md5(appid + word + salt + privateKey);

  const queryOptions = {
    q,
    from,
    to,
    appid,
    salt,
    sign,
  };

  const query: String = querystring.stringify(queryOptions);
  const options = {
    hostname: "api.fanyi.baidu.com",
    port: 443,
    path: "/api/trans/vip/translate?" + query,
    method: "GET",
  };
  type ErrorMap = {
    [k: string]: string;
  };
  const errorMap: ErrorMap = {
    "52001": "请求超时",
    "52002": "系统错误",
    "52003": "管理员登录失败，喊ta登一下叭",
    "54000": "必填参数为空",
    "54001": "签名错误",
    "54003": "访问频率受限",
    "54004": "账户余额不足",
    "54005": "长query请求频繁	",
    "58000": "客户端IP非法",
    "58001": "译文语言方向不支持",
    "58002": "服务当前已关闭",
    "90107": "认证未通过或未生效",
  };
  const req = https.request(options, (res) => {
    let chunks: Buffer[] = [];

    type baiduResult = {
      from: string;
      to: string;
      trans_result: [{ src: string; dst: string }];
      error_code?: string;
      error_message?: string;
    };
    res.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });
    res.on("end", () => {
      const string = Buffer.concat(chunks).toString();
      const object: baiduResult = JSON.parse(string);
      if (object.error_code) {
        console.error(errorMap[object.error_code] || object.error_message);
      } else {
        object.trans_result.map((item) => {
          console.log(item["dst"]);
        });
      }
    });
  });

  req.on("error", (e) => {
    console.error(e);
  });
  req.end();
};
