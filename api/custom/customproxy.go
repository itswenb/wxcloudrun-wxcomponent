package custom

import (
	"net/http"

	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/errno"
	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/httputils"
	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/log"
	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/utils"
	"github.com/gin-gonic/gin"
)

func notificationHandler(c *gin.Context) {
	requestParams, err := utils.GetOriginalRequest(c.Request.Body)
	if err != nil {
		log.Error(err.Error())
		c.JSON(http.StatusOK, errno.ErrSystemError.WithData(err.Error()))
		return
	}
	if utils.notificationUrl == "" {
		log.Error("notificationUrl is empty")
		c.JSON(http.StatusOK, errno.ErrSystemError.WithData("notificationUrl is empty"))
		return
	}
	resp, err := httputils.PostJson(utils.notificationUrl, gin.H{
		msgtype: "markdown",
		markdown: gin.H{
			"content": string(requestParams),
		},
	})
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusOK, errno.ErrRequestErr.WithData(err.Error()))
		return
	}
	c.JSON(http.StatusOK, errno.OK.WithData(string(resp)))
}
