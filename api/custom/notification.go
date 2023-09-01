package custom

import (
	"net/http"

	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/errno"
	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/httputils"
	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/log"
	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/utils"
	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/wx"
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
		log.Error("notificationUrl is empty")
		c.JSON(http.StatusOK, errno.ErrSystemError.WithData("notificationUrl is empty"))
		return
	}
	paramString, marshalErr := wx.WxJson.MarshalToString(requestParams)
	if marshalErr != nil {
		log.Error(marshalErr.Error())
		c.JSON(http.StatusOK, errno.ErrSystemError.WithData(marshalErr.Error()))
		return
	}
	resp, err := httputils.PostJson(utils.NotificationUrl, gin.H{
		"msgtype": "markdown",
		"markdown": gin.H{
			"content": paramString,
		},
	})
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusOK, errno.ErrRequestErr.WithData(err.Error()))
		return
	}
	c.JSON(http.StatusOK, errno.OK.WithData(string(resp)))
}
