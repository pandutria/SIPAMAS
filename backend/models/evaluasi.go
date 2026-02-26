package models

import (
	"time"

	"gorm.io/gorm"
)

type Evaluasi struct {
	ID                uint           `gorm:"primaryKey" json:"id"`
	RealisasiHeaderId uint           `json:"realisasi_header_id"`
	CreatedById       uint           `json:"created_by_id"`
	Catatan           *string        `json:"catatan"`
	Tindakan          *string        `json:"tindakan"`
	Skor              *string        `json:"skor"`
	CreatedAt         time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt         time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt         gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}
