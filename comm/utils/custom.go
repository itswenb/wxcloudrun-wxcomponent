package utils

import (
	"io"

	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/wx"
)

func GetOriginalRequest(body io.ReadCloser) (interface{}, error) {
	originalBody, err := io.ReadAll(body)
	if err != nil {
		return nil, err
	}
	var requestData interface{}
	err = wx.WxJson.Unmarshal(originalBody, &requestData)
	if err != nil {
		return nil, err
	}
	return requestData, nil
}
