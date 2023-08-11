package wxcallback

import (
<<<<<<< HEAD
=======
	"bytes"
	JSON "encoding/json"
>>>>>>> 40e7226 (Change json merge)
	"io/ioutil"
	"net/http"
	"time"

	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/errno"
	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/log"

	"github.com/WeixinCloud/wxcloudrun-wxcomponent/db/dao"
	"github.com/WeixinCloud/wxcloudrun-wxcomponent/db/model"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

type wxCallbackBizRecord struct {
	CreateTime int64  `json:"CreateTime"`
	ToUserName string `json:"ToUserName"`
	MsgType    string `json:"MsgType"`
	Event      string `json:"Event"`
}

func bizHandler(c *gin.Context) {
	// 记录到数据库
	body, _ := ioutil.ReadAll(c.Request.Body)
	var json wxCallbackBizRecord
	if err := binding.JSON.BindBody(body, &json); err != nil {
		c.JSON(http.StatusOK, errno.ErrInvalidParam.WithData(err.Error()))
		return
	}
	r := model.WxCallbackBizRecord{
		CreateTime:  time.Unix(json.CreateTime, 0),
		ReceiveTime: time.Now(),
		Appid:       c.Param("appid"),
		ToUserName:  json.ToUserName,
		MsgType:     json.MsgType,
		Event:       json.Event,
		PostBody:    string(body),
	}
	if json.CreateTime == 0 {
		r.CreateTime = time.Unix(1, 0)
	}
	if err := dao.AddBizCallBackRecord(&r); err != nil {
		c.JSON(http.StatusOK, errno.ErrSystemError.WithData(err.Error()))
		return
	}
<<<<<<< HEAD
=======
	userInfo, err := dao.GetAuthorizerByUserName(json.ToUserName)
	if err != nil {
	} else {
		if json.MsgType == "event" {
			userinfoJson, userinfoErr := JSON.Marshal(userInfo)
			bodyJSon, bodyErr := JSON.Marshal(r)
			if userinfoErr != nil || bodyErr != nil {
			} else {
				http.Post(os.Getenv("WXCOMPONENT_CALLBACK_AUDIT_URL"), "application/json", bytes.NewReader(mergeJSON(userinfoJson, bodyJSon)))
			}
		}
	}
>>>>>>> 40e7226 (Change json merge)

	// 转发到用户配置的地址
	proxyOpen, err := proxyCallbackMsg("", json.MsgType, json.Event, string(body), c)
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusOK, errno.ErrSystemError.WithData(err.Error()))
		return
	}
	if !proxyOpen {
		c.String(http.StatusOK, "success")
	}
}

func mergeJSON(json1, json2 []byte) []byte {
	merged := make(map[string]interface{})
	err := JSON.Unmarshal(json1, &merged)
	if err != nil {
		log.Error("解析 JSON1 失败:", err)
		return nil
	}

	err = JSON.Unmarshal(json2, &merged)
	if err != nil {
		log.Error("解析 JSON2 失败:", err)
		return nil
	}

	result, err := JSON.Marshal(merged)
	if err != nil {
		log.Error("转换合并后的 JSON 失败:", err)
		return nil
	}

	return result
}
