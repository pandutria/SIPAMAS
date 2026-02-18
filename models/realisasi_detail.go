package models

import "time"

type RealisasiDetail struct {
	ID                uint      `gorm:"primaryKey" json:"id"`
	RealisasiHeaderId uint      `gorm:"not null" json:"realisasi_header_id"`
	BuktiFile         *string   `json:"bukti_file"`
	MingguNomor       *int      `json:"minggu_nomor"`
	Nilai             *string   `json:"nilai"`
	AlasanCount       *int      `json:"alasan_count"`
	AlasanText        *string   `json:"alasan_text"`
	CreatedAt         time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt         time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}
