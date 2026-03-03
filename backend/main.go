package main

import (
	"gin-gorm/config"
	"gin-gorm/models"
	"gin-gorm/routes"
	"gin-gorm/utils"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	r := gin.Default()

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	r.SetTrustedProxies(nil)
	r.Static("/uploads", "./uploads")

	config.ConnectDB()

	// config.DB.AutoMigrate(
	// 	&models.User{},
	// 	&models.IdentitasProyek{},
	// 	&models.IdentitasProyekPhoto{},
	// 	&models.IdentitasProyekDocument{},
	// 	&models.RabHeader{},
	// 	&models.RabDetail{},
	// 	&models.ScheduleHeader{},
	// 	&models.ScheduleItem{},
	// 	&models.ScheduleWeek{},
	// 	&models.RealisasiHeader{},
	// 	&models.RealisasiDetail{},
	// 	&models.Evaluasi{},
	// 	&models.Pengaduan{},
	// 	&models.PengaduanMedia{},
	// 	&models.PengaduanTimeline{},
	// 	&models.PengaduanReview{},
	// )

	SeedSuperAdmin()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	routes.SetupRoutes(r)

	r.Run("0.0.0.0:8083")
}

func SeedSuperAdmin() {
	var user models.User

	email := "superadmin@gmail.com"

	err := config.DB.Where("email = ?", email).First(&user).Error
	if err == nil {
		return
	}

	password := "SuperAdminss7617&"
	role := "super-admin"
	fullname := "Super Admin"
	isActive := "true"

	superAdmin := models.User{
		Email:    &email,
		Fullname: &fullname,
		Password: utils.HashSHA512(password),
		Role:     &role,
		IsActive: &isActive,
	}

	config.DB.Create(&superAdmin)
}
