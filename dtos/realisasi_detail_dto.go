package dtos

type CreateRealisasiDetailRequest struct {
	RealisasiHeaderId uint   `form:"realisasi_header_id"`
	MingguNomor       int    `form:"minggu_nomor"`
	Nilai             string `form:"nilai"`
	AlasanCount       *int   `form:"alasan_count"`
	AlasanText        string `form:"alasan_text"`
}
