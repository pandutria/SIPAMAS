package config

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	dsn := "postgres://postgres:rayzen7@100.74.236.13:5432/postgres?sslmode=disable"

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("failed to connect database")
		return
	}

	DB = database
	log.Println("Connect db success")
}