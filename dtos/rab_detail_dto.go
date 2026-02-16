package dtos

type CreateRabDetailRequest struct {
	RabHeaderId uint   `form:"rab_header_id"`
	Keterangan  string `form:"keterangan"`
	Satuan      string `form:"satuan"`
	Volume      string `form:"volume"`
	Harga       string `form:"harga"`
}
