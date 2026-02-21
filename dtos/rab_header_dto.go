package dtos

type CreateRabHeaderRequest struct {
	RabGroupId        *uint  `form:"rab_group_id"`
	IdentitasProyekId uint   `form:"identitas_proyek_id"`
	AlasanText        string `form:"alasan_text"`
	Program           string `form:"program"`
}
