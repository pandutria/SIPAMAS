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
		private.PUT("/auth/update", controllers.UpdateProfile)

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

		private.GET("/rab", controllers.GetAllRabHader)
		private.GET("/rab/:id", controllers.GetRabHaderById)
		private.POST("/rab/create", controllers.CreateRabHeader)
		private.DELETE("/rab/delete/:id", controllers.DeleteRab)

		private.GET("/rab/detail", controllers.GetAllRabDetail)
		private.POST("/rab/detail/create", controllers.CreateRabDetail)

		private.GET("/schedule", controllers.GetAllScheduleHeader)
		private.GET("/schedule/:id", controllers.GetScheduleHeaderById)
		private.POST("/schedule/create", controllers.CreateScheduleHeader)
		private.DELETE("/schedule/delete/:id", controllers.DeleteSchedule)

		private.GET("/schedule/item", controllers.GetAllScheduleItem)
		private.POST("/schedule/item/create", controllers.CreateScheduleItem)

		private.GET("/schedule/week", controllers.GetAllScheduleWeek)
		private.POST("/schedule/week/create", controllers.CreateScheduleWeek)

		private.GET("/realisasi", controllers.GetAllRealisasiHeader)
		private.POST("/realisasi/create", controllers.CreateRealisasiHeader)
	}
}
