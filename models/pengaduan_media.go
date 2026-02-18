package models

type PengaduanMedia struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	PengaduanId uint   `json:"pengaduan_id"`
	MediaFile   string `json:"media_file"`
	MediaTipe   string `json:"media_tipe"`
}
