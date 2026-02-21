package dtos

type CreateEvaluasiRequest struct {
	RealisasiHeaderId uint    `form:"realisasi_header_id"`
	Catatan           *string `form:"catatan"`
	Tindakan          *string `form:"tindakan"`
	Skor              *string `form:"skor"`
}
