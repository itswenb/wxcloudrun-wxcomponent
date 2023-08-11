// 启动一个api服务，用于接收github的webhook请求

import express, { Request, Response } from "express";
import mysql from "mysql2";
const WXCOMPONENT_CALLBACK_AUDIT_URL =
  "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=d56f2849-4a96-4d28-a03f-d05d22cd7671";
// 创建数据库连接池
export const pool = mysql.createPool({
  host: process.env.MYSQL_ADDRESS,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: "wxcomponent",
});

// 创建 Express 应用程序
const app = express();
app.use(express.json());

// 处理审核信息
// app.get("/webhook/audit", (req: Request, res: Response) => {
//   // 处理获取用户列表的请求
//   const users = [
//     { id: 1, name: "John" },
//     { id: 2, name: "Jane" },
//     { id: 3, name: "Alice" },
//   ];
//   res.json(users);
// });

// 处理审核信息
app.post("/webhook/audit", async (req: Request, res: Response) => {
  const getAppInfo = async (username: string) => {
    return new Promise((resolve, reject) => {
      // 从连接池获取连接
      pool.getConnection((err, connection) => {
        if (err) {
          console.error("无法建立数据库连接:", err);
          reject(err);
          return;
        }
        // 执行查询
        connection.query(
          `SELECT * FROM authorizers WHERE username=${username}`,
          (error, results) => {
            // 释放连接
            connection.release();

            if (error) {
              console.error("查询失败:", error);
              reject(error);
              return;
            }
            resolve(results);
            // 处理查询结果
            console.log("查询结果:", results);
          }
        );
      });
    });
  };
  // {
  // "ToUserName":"gh_e3dc25c7ce84",
  // "FromUserName":"ohWOKlbtxDs7ZGIjjt-5Q",
  // "CreateTime":1644982569,
  // "MsgType":"event",
  // "Event":"wxa_privacy_apply",
  // "result_info":{
  //    "api_name":"wx.choosePoi",
  //    "apply_time":"1644975588",
  //    "audit_id":"4211202267",
  //    "audit_time":"1644982569",
  //    "reason":"小程序内未含有相应使用场景",
  //    "status":"2"
  //  }
  // }
  // 处理创建用户的请求
  const { ToUserName } = req.body;
  try {
    const appInfo: any = await getAppInfo(ToUserName);

    // 发送企业微信消息
    const axios = require("axios");
    const data = {
      msgtype: "markdown",
      markdown: {
        content: `#### 审核结果通知
> **应用名称：** ${appInfo[0].nick_name}
> **应用ID：** ${appInfo[0].authorizer_appid}
> **审核结果：** ${req.body.result_info.status === "1" ? "通过" : "未通过"}
> **审核时间：** ${new Date(
          parseInt(req.body.result_info.audit_time) * 1000
        ).toLocaleString()}
> **审核原因：** ${req.body.result_info.reason}
> **审核详情：** [点击查看](https://mp.weixin.qq.com/wxa/auditing?action=get_audit_detail&appid=${
          appInfo[0].authorizer_appid
        }&auditid=${req.body.result_info.audit_id}&token=${
          appInfo[0].authorizer_access_token
        }&lang=zh_CN)
`,
      },
    };
    const result = await axios.post(
      WXCOMPONENT_CALLBACK_AUDIT_URL,
      JSON.stringify(data)
    );
    console.log("企业微信消息发送结果", result.data);
    if (result.data.errcode === 0) {
      res.status(200).json({ message: "审核结果通知发送成功" });
    } else {
      res.status(500).json({ message: "审核结果通知发送失败" });
    }
  } catch (err) {
    console.log("查询失败", err);
    res.status(500).json({ message: "查询失败" + err.message });
  }
});

// 启动服务器
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
