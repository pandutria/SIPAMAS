package models

type RabDetail struct {
	ID          uint    `gorm:"primaryKey" json:"id"`
	RabHeaderId uint    `json:"rab_header_id"`
	Keterangan  string `json:"keterangan"`
	Satuan      string `json:"satuan"`
	Volume      string `json:"volume"`
	Harga       string `json:"harga"`
	Total       string `json:"total"`
}
