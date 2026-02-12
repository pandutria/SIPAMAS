package models

import "time"

type IdentitasProyek struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	Nama          *string   `json:"nama"`
	TahunAnggaran *string   `json:"tahun_anggaran"`
	Kategori      *string   `json:"kategori"`
	Provinsi      *string   `json:"provinsi"`
	Kabupaten     *string   `json:"kabupaten"`
	Kecamatan     *string   `json:"kecamatan"`
	Kelurahan     *string   `json:"kelurahan"`
	Latitude      *string   `json:"latitude"`
	Longitude     *string   `json:"longitude"`
	CreatedById   *uint     `json:"created_by_id"`
	CreatedAt     time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt     time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	CreatedBy *User                 `gorm:"foreignKey:CreatedById" json:"created_by"`
	Photos    *IdentitasProyekPhoto `gorm:"foreignKey:identitas_proyek_id" json:"photos"`
}
