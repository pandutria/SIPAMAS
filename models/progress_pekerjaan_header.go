package models

import "time"

type ProgressPekerjaanHeader struct {
	ID             uint      `gorm:"primaryKey" json:"id"`
	ScheduleWeekId uint      `json:"schedule_week_id"`
	CreatedById    uint      `json:"created_by_id"`
	Catatan        *string   `json:"catatan"`
	CreatedAt      time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt      time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	CreatedBy       *User            `gorm:"foreignKey:CreatedById" json:"created_by"`
	Week *ScheduleWeek `gorm:"foreignKey:ScheduleWeekId" json:"week"`
}
