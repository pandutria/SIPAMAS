package models

type ScheduleWeek struct {
	ID             uint   `gorm:"primaryKey" json:"id"`
	ScheduleItemId uint   `json:"schedule_item_id"`
	MingguNomor    int    `json:"minggu_nomor"`
	Nilai          string `json:"nilai"`
}
