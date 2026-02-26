package main

import (
	"gin-gorm/config"
	"gin-gorm/models"
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
}
