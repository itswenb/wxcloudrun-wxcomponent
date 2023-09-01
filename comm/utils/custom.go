package utils

import (
	"errors"
	"io"
	"os"

	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/log"
	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/wx"
)

var NotificationUrl string

func Init() error {
	NotificationUrl = os.Getenv("WXCOMPONENT_CALLBACK_NOTIFICATION_URL")
	if NotificationUrl == "" {
		log.Error("NotificationUrl is empty")
		return errors.New("NotificationUrl is empty")
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
