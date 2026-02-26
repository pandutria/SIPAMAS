package models

import "time"

type RabHeader struct {
	ID                uint      `gorm:"primaryKey" json:"id"`
	RabGroupId        *uint     `gorm:"index;" json:"rab_group_id"`
	IdentitasProyekId *uint     `json:"identitas_proyek_id"`
	AlasanCount       *int      `json:"alasan_count"`
	AlasanText        *string   `json:"alasan_text"`
	Program           *string   `json:"program"`
	CreatedById       uint      `json:"created_by_id"`
	CreatedAt         time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt         time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	CreatedBy       *User            `gorm:"foreignKey:CreatedById" json:"created_by"`
	IdentitasProyek *IdentitasProyek `gorm:"foreignKey:IdentitasProyekId" json:"proyek"`
	Details         []*RabDetail     `gorm:"foreignKey:RabHeaderId" json:"details"`
}
