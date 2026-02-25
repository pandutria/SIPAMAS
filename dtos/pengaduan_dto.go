package dtos

type CreatePengaduangRequest struct {
	Kategori          string `form:"kategori"`
	Judul             string `form:"judul"`
	IdentitasProyekId uint `form:"identitas_proyek_id"`
	Deskripsi         string `form:"deskripsi"`
	Alamat            string `form:"alamat"`
	Latitude          string `form:"latitude"`
	Longitude         string `form:"longitude"`
	Catatan           string `form:"catatan"`
}

type UpdatePengaduanStatusRequest struct {
	Status  string `form:"status"`
	Catatan string `form:"catatan"`
}
