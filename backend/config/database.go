package config

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	// dsn := "host=100.74.236.13 user=postgres password=rayzen7 dbname=sipamas port=5432 sslmode=disable"
	// dsn := "host=103.170.89.225 user=postgres password=engineermuda dbname=sipamas port=5432"
	dsn := "host=localhost user=sipamas_user password=sipamas_db dbname=sipamas port=5432"

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("failed to connect database")
		log.Fatal(err.Error())
		return
	}

	DB = database
	log.Println("Connect db success")
}
