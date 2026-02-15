package models

import "time"

type IdentitasProyekDocument struct {
	ID                uint      `gorm:"primaryKey" json:"id"`
	IdentitasProyekId uint     `json:"identitas_proyek_id"`
	Name              *string   `json:"name"`
	Kategori          *string   `json:"kategori"`
	PhotoFile         *string   `json:"photo_file"`
	CreatedAt         time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt         time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}
