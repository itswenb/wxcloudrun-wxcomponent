package admin

import (
	"fmt"
	"net/http"

	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/errno"
	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/log"
	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/wx"
	"github.com/gin-gonic/gin"
)

// errcode	number	错误码
// errmsg	string	错误信息
// info_list	Array.<cloudEnvItem>	数据
type cloudEnvListResp struct {
	ErrCode  int            `json:"errcode" wx:"errcode"`
	ErrMsg   string         `json:"errmsg" wx:"errmsg"`
	InfoList []cloudEnvItem `json:"info_list" wx:"info_list"`
}

// env	String	环境ID
// alias	String	环境别名
// create_time	String	创建时间
// update_ime	String	最后修改时间
// status	String	环境状态
// package_id	String	tcb产品套餐ID
// package_name	String	套餐中文名称
// dbinstance_id	String	数据库示例ID
// bucket_id	String	静态存储ID
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
	// 获取 component_access_token
	token, err := wx.GetComponentAccessToken()
	log.Errorf("getComponentAccessToken token, %s", token)
	if err != nil {
		log.Error(err.Error())
		c.JSON(http.StatusOK, errno.ErrSystemError.WithData(err.Error()))
		return
	}
	_, body, err := wx.PostWxJsonWithComponentToken(fmt.Sprintf("/componenttcb/describeenvs?access_token=%s", token), "", "")
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
