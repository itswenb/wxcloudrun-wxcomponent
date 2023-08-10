package webhook

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"os"

	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/errno"
	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/log"
	"github.com/WeixinCloud/wxcloudrun-wxcomponent/db/dao"
	"github.com/gin-gonic/gin"
)

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
