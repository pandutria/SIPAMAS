package models

import "time"

type ScheduleHeader struct {
	ID              uint      `gorm:"primaryKey" json:"id"`
	ScheduleGroupId *uint     `gorm:"index" json:"schedule_group_id"`
	RabId           uint      `json:"rab_id"`
	AlasanCount     *int      `json:"alasan_count"`
	AlasanText      *string   `json:"alasan_text"`
	TanggalMulai    *string   `json:"tanggal_mulai"`
	TanggalAkhir    *string   `json:"tanggal_akhir"`
	CreatedById     uint      `json:"created_by_id"`
	CreatedAt       time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt       time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	CreatedBy *User      `gorm:"foreignKey:CreatedById" json:"created_by"`
	Rab       *RabHeader `gorm:"foreignKey:RabId" json:"rab"`
}
