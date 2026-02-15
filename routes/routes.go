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
		private.PUT("/identitas-proyek/update/:id", controllers.UpdateIdentitas)
		private.DELETE("/identitas-proyek/delete/:id", controllers.DeleteIdentitas)

		private.GET("/identitas-proyek/photo", controllers.GetAllIdentitasProyekPhoto)
		private.GET("/identitas-proyek/photo/:id", controllers.GetIdentitasProyekPhotoById)
		private.POST("/identitas-proyek/photo/create", controllers.CreateIdentitasProyekPhoto)

		private.GET("/identitas-proyek/document", controllers.GetAllIdentitasProyekDocument)
		private.GET("/identitas-proyek/document/:id", controllers.GetIdentitasProyekDocumentById)
		private.POST("/identitas-proyek/document/create", controllers.CreateIdentitasProyekDocument)
	}
}
