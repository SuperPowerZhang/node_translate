"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translate = void 0;
var private_1 = require("./private");
var https = __importStar(require("https"));
var querystring = __importStar(require("querystring"));
var md5 = require("md5");
exports.translate = function (word) {
    var q = word;
    var from = "en";
    var to = "zh";
    if (!/[a - zA - Z]/.test(word)) {
        from = "zh";
        to = "en";
    }
    var salt = Math.random();
    var sign = md5(private_1.appid + word + salt + private_1.privateKey);
    var queryOptions = {
        q: q,
        from: from,
        to: to,
        appid: private_1.appid,
        salt: salt,
        sign: sign,
    };
    var query = querystring.stringify(queryOptions);
    var options = {
        hostname: "api.fanyi.baidu.com",
        port: 443,
        path: "/api/trans/vip/translate?" + query,
        method: "GET",
    };
    var errorMap = {
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
    var req = https.request(options, function (res) {
        var chunks = [];
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });
        res.on("end", function () {
            var string = Buffer.concat(chunks).toString();
            var object = JSON.parse(string);
            if (object.error_code) {
                console.error(errorMap[object.error_code] || object.error_message);
            }
            else {
                object.trans_result.map(function (item) {
                    console.log(item["dst"]);
                });
            }
        });
    });
    req.on("error", function (e) {
        console.error(e);
    });
    req.end();
};
