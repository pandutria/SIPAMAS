package models

import "time"

type RealisasiHeader struct {
	ID               uint      `gorm:"primaryKey" json:"id"`
	ScheduleHeaderId uint      `json:"schedule_header_id"`
	CreatedById      uint      `json:"user_id"`
	CreatedAt        time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt        time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	CreatedBy *User `gorm:"foreignKey:CreatedById" json:"created_by"`
}
