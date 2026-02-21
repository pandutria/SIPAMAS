package dtos

type CreatePengaduaReviewRequest struct {
	PengaduanId uint   `form:"pengaduan_id"`
	Rating      *uint   `form:"rating"`
	Catatan     string `form:"catatan"`
}
