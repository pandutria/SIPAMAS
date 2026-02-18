package dtos

type CreateRealisasiDetailRequest struct {
	RealisasiHeaderId uint   `form:"realisasi_header_id"`
	WeekNumber        int    `form:"week_number"`
	Value             string `form:"value"`
	AlasanCount       *int   `form:"alasan_count"`
	AlasanText        string `form:"alasan_text"`
}
