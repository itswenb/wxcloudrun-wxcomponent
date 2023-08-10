package wxcallback

import (
	"bytes"
	"encoding/json"
	"io"
	"io/ioutil"
	"net/http"
	"os"
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

// {
// "ToUserName":"gh_e3dc25c7ce84",
// "FromUserName":"ohWOKlbtxDs7ZGIjjt-5Q",
// "CreateTime":1644982569,
// "MsgType":"event",
// "Event":"wxa_privacy_apply",
//
//	"result_info":{
//	   "api_name":"wx.choosePoi",
//	   "apply_time":"1644975588",
//	   "audit_id":"4211202267",
//	   "audit_time":"1644982569",
//	   "reason":"小程序内未含有相应使用场景",
//	   "status":"2"
//	 }
//	}

type wxCallbackAuditRecord struct {
	CreateTime   int64  `json:"CreateTime"`
	FromUserName string `json:"FromUserName"`
	ToUserName   string `json:"ToUserName"`
	MsgType      string `json:"MsgType"`
	Event        string `json:"Event"`
	ResultInfo   struct {
		ApiName   string `json:"api_name"`
		ApplyTime string `json:"apply_time"`
		AuditID   string `json:"audit_id"`
		AuditTime string `json:"audit_time"`
		Reason    string `json:"reason"`
		Status    string `json:"status"`
	} `json:"result_info"`
}

func auditHandler(c *gin.Context) {
	var body wxCallbackAuditRecord
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusOK, errno.ErrInvalidParam.WithData(err.Error()))
		return
	}
	info, infoErr := dao.GetAuthorizerByUserName(body.ToUserName)
	if infoErr != nil {
		c.JSON(http.StatusOK, errno.ErrSystemError.WithData(infoErr.Error()))
		return
	}
	url := os.Getenv("WXCOMPONENT_CALLBACK_AUDIT_URL")

	bodyJSON, bodyErr := json.Marshal(body)
	if bodyErr != nil {
		c.JSON(http.StatusOK, errno.ErrSystemError.WithData(bodyErr.Error()))
		return
	}

	infoJSON, infoJSONErr := json.Marshal(info)
	if infoJSONErr != nil {
		c.JSON(http.StatusOK, errno.ErrSystemError.WithData(infoJSONErr.Error()))
		return
	}
	req, reqErr := http.NewRequest("POST", url, io.MultiReader(
		bytes.NewReader(bodyJSON),
		bytes.NewReader(infoJSON),
	))
	if reqErr != nil {
		log.Error(reqErr)
		c.JSON(http.StatusOK, errno.ErrSystemError.WithData(reqErr.Error()))
		return
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusOK, errno.ErrSystemError.WithData(err.Error()))
		return
	}
	defer resp.Body.Close()

	c.String(http.StatusOK, "success")
}
