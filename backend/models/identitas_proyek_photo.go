package models

import "time"

type IdentitasProyekPhoto struct {
	ID                uint      `gorm:"primaryKey" json:"id"`
	IdentitasProyekId uint      `json:"identitas_proyek_id"`
	Title             string    `json:"title"`
	Type              string    `json:"type"`
	PhotoFile         string    `json:"photo_file"`
	CreatedAt         time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt         time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}
