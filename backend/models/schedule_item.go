package models

type ScheduleItem struct {
	ID               uint            `gorm:"primaryKey" json:"id"`
	ScheduleHeaderId uint            `json:"schedule_header_id"`
	Nomor            *string         `json:"nomor"`
	Keterangan       *string         `json:"keterangan"`
	Jumlah           *string         `json:"jumlah"`
	Bobot            *string         `json:"bobot"`
	Weeks            *[]ScheduleWeek `gorm:"foreignKey:ScheduleItemId " json:"weeks"`
}
