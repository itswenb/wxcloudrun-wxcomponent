package custom

import (
	"github.com/gin-gonic/gin"
)

func Routers(e *gin.Engine) {

	g := e.Group("/custom")

	g.POST("/notification", notificationHandler)
	g.POST("/auditNotification", auditNotificationHandler)
}
