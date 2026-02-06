package routes

import (
	"gin-gorm/controllers"
	"gin-gorm/middlewares"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	public := r.Group("/api")
	{
		public.POST("/user/create", controllers.CreateUser)
		public.POST("/auth/login", controllers.Login)
	}

	private := r.Group("/api")
	private.Use(middlewares.BearerAuth())
	{
		private.GET("/auth/me", controllers.Me)
	}
}