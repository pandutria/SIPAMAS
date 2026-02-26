package dtos

type CreatePengaduanMediaRequest struct {
	PengaduanId uint   `form:"pengaduan_id"`
	MediaTipe   string `form:"media_tipe"`
}
