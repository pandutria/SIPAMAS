package dtos

type CreateIdentitasProyekDocument struct {
	IdentitasProyekId uint   `form:"identitas_proyek_id"`
	Name              string `form:"name"`
	Kategori          string `form:"kategori"`
}
