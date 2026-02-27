package main

import (
	"gin-gorm/config"
	"gin-gorm/models"
	"gin-gorm/utils"
)

func main() {
	config.ConnectDB()

	config.DB.AutoMigrate(
		&models.User{},
		&models.IdentitasProyek{},
		&models.IdentitasProyekPhoto{},
		&models.IdentitasProyekDocument{},
		&models.RabHeader{},
		&models.RabDetail{},
		&models.ScheduleHeader{},
		&models.ScheduleItem{},
		&models.ScheduleWeek{},
		&models.RealisasiHeader{},
		&models.RealisasiDetail{},
		&models.Evaluasi{},
		&models.Pengaduan{},
		&models.PengaduanMedia{},
		&models.PengaduanTimeline{},
		&models.PengaduanReview{},
	)

	SeedSuperAdmin()
}

func SeedSuperAdmin() {
	var user models.User

	email := "superadmin"

	err := config.DB.Where("email = ?", email).First(&user).Error
	if err == nil {
		return
	}

	password := "SuperAdminss7617&"
	role := "superadmin"
	isActive := "true"

	superAdmin := models.User{
		Email:    &email,
		Password: utils.HashSHA512(password),
		Role:     &role,
		IsActive: &isActive,
	}

	config.DB.Create(&superAdmin)
}
