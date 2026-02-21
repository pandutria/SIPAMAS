package dtos

type CreatePengaduangRequest struct {
	Kategori  string `form:"kategori"`
	Judul     string `form:"judul"`
	Deskripsi string `form:"deskripsi"`
	Alamat    string `form:"alamat"`
	Latitude  string `form:"latitude"`
	Longitude string `form:"longitude"`
}

type UpdatePengaduanStatusRequest struct {
	Status string `form:"status"`
}