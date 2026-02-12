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

		private.GET("/identitas-proyek", controllers.GetAllIdentitas)
		private.GET("/identitas-proyek/:id", controllers.GetIdentitasById)
		private.POST("/identitas-proyek/create", controllers.CreateIdentitas)
		private.PUT("/identitas-proyek/update", controllers.UpdateIdentitas)
	}
}