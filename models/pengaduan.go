package models

import "time"

type Pengaduan struct {
	ID                uint      `gorm:"primaryKey" json:"id"`
	IdentitasProyekId uint      `json:"identitas_proyek_id"`
	CreatedById       uint      `json:"created_by_id"`
	Nama              *string   `json:"nama"`
	Email             *string   `json:"email"`
	Nik               *string   `json:"nik"`
	Kategori          *string   `json:"kategori"`
	Judul             *string   `json:"judul"`
	Deskripsi         *string   `json:"deskripsi"`
	Alamat            *string   `json:"alamat"`
	Latitude          *string   `json:"latitude"`
	Longitude         *string   `json:"longitude"`
	Status            *string   `json:"status"`
	Rating            *string   `json:"rating"`
	Ulasan            *string   `json:"ulasan"`
	CreatedAt         time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt         time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	CreatedBy       *User              `gorm:"foreignKey:CreatedById" json:"created_by"`
	IdentitasProyek *IdentitasProyek   `gorm:"foreignKey:IdentitasProyekId" json:"proyek"`
	Medias          []*PengaduanMedia    `gorm:"foreignKey:PengaduanId " json:"medias"`
	Timelines       []*PengaduanTimeline `gorm:"foreignKey:PengaduanId " json:"timelines"`
}