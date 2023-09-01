package custom

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/errno"
	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/httputils"
	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/log"
	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/utils"
	"github.com/WeixinCloud/wxcloudrun-wxcomponent/db/dao"
	"github.com/gin-gonic/gin"
)

func notificationHandler(c *gin.Context) {
	requestParams, err := utils.GetOriginalRequest(c.Request.Body)
	if err != nil {
		log.Error(err.Error())
		c.JSON(http.StatusOK, errno.ErrSystemError.WithData(err.Error()))
		return
	}
	if utils.NotificationUrl == "" {
		log.Error("NotificationUrl is empty")
		c.JSON(http.StatusOK, errno.ErrSystemError.WithData("NotificationUrl is empty"))
		return
	}
	requestString, err := mapToJsonStringWithRealUserName(requestParams)
	if err != nil {
		log.Error(err.Error())
		c.JSON(http.StatusOK, errno.ErrSystemError.WithData(err.Error()))
		return
	}
	resp, err := httputils.PostJson(utils.NotificationUrl, gin.H{
		"msgtype": "markdown",
		"markdown": gin.H{
			"content": requestString,
		},
	})
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusOK, errno.ErrRequestErr.WithData(err.Error()))
		return
	}
	c.JSON(http.StatusOK, errno.OK.WithData(string(resp)))
}

func auditNotificationHandler(c *gin.Context) {
	requestParams, err := utils.GetOriginalRequest(c.Request.Body)
	if err != nil {
		log.Error(err.Error())
		c.JSON(http.StatusOK, errno.ErrSystemError.WithData(err.Error()))
		return
	}
	if utils.AuditNotificationUrl == "" {
		log.Error("AuditNotificationUrl is empty")
		c.JSON(http.StatusOK, errno.ErrSystemError.WithData("AuditNotificationUrl is empty"))
		return
	}
	requestString, err := mapToJsonStringWithRealUserName(requestParams)
	if err != nil {
		log.Error(err.Error())
		c.JSON(http.StatusOK, errno.ErrSystemError.WithData(err.Error()))
		return
	}

	resp, err := httputils.PostJson(utils.AuditNotificationUrl, gin.H{
		"msgtype": "markdown",
		"markdown": gin.H{
			"content": requestString,
		},
	})
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusOK, errno.ErrRequestErr.WithData(err.Error()))
		return
	}
	c.JSON(http.StatusOK, errno.OK.WithData(string(resp)))
}

func mapToJsonStringWithRealUserName(requestParams interface{}) (string, error) {
	// 从 requestParams 中提取 ToUserName 字段的值
	toUserName, ok := requestParams.(map[string]interface{})["ToUserName"].(string)
	if !ok {
		return "", errors.New("ToUserName field not found or not a string")
	}

	// 在数据库中根据 ToUserName 查询 authorizer
	authorizer, err := dao.GetAuthorizerByUserName(toUserName)
	if err != nil {
		return "", err
	}

	var toUserRealName string = ""
	if len(authorizer) > 0 {
		var appType string = ""
		if authorizer[0].AppType == '1' {
			appType = "小程序"
		} else {
			appType = "公众号"
		}
		toUserRealName = fmt.Sprintf("%s(%s)", authorizer[0].NickName, appType)
	}

	// 将 ToUserRealName 添加到 requestParams 中
	requestParamsMap, ok := requestParams.(map[string]interface{})
	if !ok {
		return "", errors.New("requestParams is not a map")
	}
	requestParamsMap["ToRealUserName"] = toUserRealName

	paramByte, marshalErr := json.Marshal(requestParamsMap)
	if marshalErr != nil {
		return "", marshalErr
	}
	var formattedJSON bytes.Buffer
	indentError := json.Indent(&formattedJSON, paramByte, "", "\t")
	if indentError != nil {
		return "", indentError
	}
	return fmt.Sprintf("```JSON\n%s\n```", formattedJSON.String()), nil
}
