package config

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
<<<<<<< HEAD
	dsn := "host=localhost user=sipamas_user password=sipamas_db dbname=sipamas port=5432 sslmode=disable"
=======
	dsn := "host=100.74.236.13 user=postgres password=rayzen7 dbname=sipamas port=5432 sslmode=disable"
	// dsn := "host=103.170.89.225 user=postgres password=engineermuda dbname=sipamas port=5432"
>>>>>>> cbb274a0bf3feadbc967901d9d5bd08536116427

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("failed to connect database")
		log.Fatal(err.Error())
		return
	}

	DB = database
	log.Println("Connect db success")
}
