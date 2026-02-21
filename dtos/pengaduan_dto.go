package dtos

type CreatePengaduangRequest struct {
	Kategori  string `form:"kategori" binding:"required"`
	Judul     string `form:"judul" binding:"required"`
	Deskripsi string `form:"deskripsi" binding:"required"`
	Alamat    string `form:"alamat" binding:"required"`
	Latitude  string `form:"latitude"`
	Longitude string `form:"longitude"`
}
