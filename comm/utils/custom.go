package utils

import (
	"errors"
	"io"
	"os"

	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/log"
	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/wx"
)

var notificationUrl string

func Init() error {
	notificationUrl = os.Getenv("WXCOMPONENT_CALLBACK_NOTIFICATION_URL")
	if notificationUrl == "" {
		log.Error("notificationUrl is empty")
		return errors.New("notificationUrl is empty")
	}
	return nil
}
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
