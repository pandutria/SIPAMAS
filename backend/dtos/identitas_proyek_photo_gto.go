package dtos

type CreateIdentitasProyekPhotoRequest struct {
	IdentitasProyekId uint   `form:"identitas_proyek_id"`
	Title             string `form:"title"`
	Type              string `form:"type"`
}
