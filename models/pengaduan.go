package models

import "time"

type Pengaduan struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	CreatedById uint      `json:"created_by_id"`
	Kategori    *string   `json:"kategori"`
	Judul       *string   `json:"judul"`
	Deskripsi   *string   `json:"deskripsi"`
	Alamat      *string   `json:"alamat"`
	Latitude    *string   `json:"latitude"`
	Longitude   *string   `json:"longitude"`
	Status      string   `json:"status"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	CreatedBy *User                `gorm:"foreignKey:CreatedById" json:"created_by"`
	Medias    []*PengaduanMedia    `gorm:"foreignKey:PengaduanId " json:"medias"`
	Timelines []*PengaduanTimeline `gorm:"foreignKey:PengaduanId " json:"timelines"`
	Review    *PengaduanReview     `gorm:"foreignKey:PengaduanId" json:"review"`
}
