package main

import (
	"gin-gorm/config"
	"gin-gorm/models"
	"gin-gorm/routes"

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
)

func main() {
	r := gin.Default()

	r.SetTrustedProxies(nil)
	r.Static("/assets", "./assets")

	config.ConnectDB()

	config.DB.AutoMigrate(
		&models.User{},
	)

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}))
	
	routes.SetupRoutes(r)

	r.Run("0.0.0.0:8081")
}