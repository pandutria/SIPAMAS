package models

import "time"

type PengaduanTimeline struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	PengaduanId uint      `json:"pengaduan_id"`
	CreatedById uint      `json:"created_by_id"`
	Judul       *string   `json:"judul"`
	Keterangan  *string   `json:"keterangan"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	CreatedBy *User      `gorm:"foreignKey:CreatedById" json:"created_by"`
	Pengaduan *Pengaduan `gorm:"foreignKey:PengaduanId" json:"Pengaduan"`
}
