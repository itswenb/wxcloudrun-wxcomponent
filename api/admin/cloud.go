package admin

import (
	"net/http"

	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/errno"
	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/log"
	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/wx"
	"github.com/gin-gonic/gin"
)

// appids	array<string>	是	要查询的appid
// source_type	number	是	请求环境源，填 1，表示云托管环境
type cloudEnvListReq struct {
	Appids     []string `json:"appids" wx:"appids"`
	SourceType int      `json:"source_type" wx:"source_type"`
}

type cloudEnvListResp struct {
	ErrCode  int            `json:"errcode" wx:"errcode"`
	ErrMsg   string         `json:"errmsg" wx:"errmsg"`
	InfoList []cloudEnvItem `json:"info_list" wx:"info_list"`
}

type cloudEnvItem struct {
	Env          string `json:"env" wx:"env"`
	Alias        string `json:"alias" wx:"alias"`
	CreateTime   string `json:"create_time" wx:"create_time"`
	UpdateTime   string `json:"update_time" wx:"update_time"`
	Status       string `json:"status" wx:"status"`
	PackageId    string `json:"package_id" wx:"package_id"`
	PackageName  string `json:"package_name" wx:"package_name"`
	DbinstanceId string `json:"dbinstance_id" wx:"dbinstance_id"`
	BucketId     string `json:"bucket_id" wx:"bucket_id"`
}

// POST https://api.weixin.qq.com/cgi-bin/component/modify_wxa_server_domain?access_token=ACCESS_TOKEN
func getCloudEnvListHandler(c *gin.Context) {
	var req cloudEnvListReq
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Error(err.Error())
		c.JSON(http.StatusOK, errno.ErrInvalidParam.WithData(err.Error()))
		return
	}
	_, body, err := wx.PostWxJsonWithComponentTokenTokenKey("/componenttcb/describeenvs", "", req)
	if err != nil {
		log.Error(err.Error())
		c.JSON(http.StatusOK, errno.ErrSystemError.WithData(err.Error()))
		return
	}
	var resp cloudEnvListResp
	if err := wx.WxJson.Unmarshal(body, &resp); err != nil {
		log.Errorf("Unmarshal err, %v", err)
		c.JSON(http.StatusOK, errno.ErrSystemError.WithData(err.Error()))
		return
	}
	c.JSON(http.StatusOK, errno.OK.WithData(resp.InfoList))
}
