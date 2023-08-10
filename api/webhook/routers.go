package webhook

import (
	"github.com/gin-gonic/gin"
)

// Routers 路由
func Routers(e *gin.Engine) {
	e.POST("/webhook/audit", auditHandler)
}
