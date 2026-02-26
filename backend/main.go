package main

import (
	"gin-gorm/config"
	"gin-gorm/routes"
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
	r.Static("/assets", "./assets")

	config.ConnectDB()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	routes.SetupRoutes(r)

	r.Run("0.0.0.0:8083")
}
