package models

import "time"

type PengaduanReview struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	PengaduanId uint      `json:"pengaduan_id"`
	Rating      *uint     `json:"rating"`
	Catatan     *string   `json:"catatan"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}
