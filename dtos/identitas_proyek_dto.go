package dtos

type CreateUpdateIdentitasRequest struct {
	ID            uint      `form:"id"`
	Nama          string    `form:"nama"`
	TahunAnggaran string    `form:"tahun_anggaran"`
	Kategori      string    `form:"kategori"`
	Provinsi      string    `form:"provinsi"`
	Kabupaten     string    `form:"kabupaten"`
	Kecamatan     string    `form:"kecamatan"`
	Kelurahan     string    `form:"kelurahan"`
	Latitude      string    `form:"latitude"`
	Longitude     string    `form:"longitude"`	
}