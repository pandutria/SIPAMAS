package dtos

type CreateIdentitasProyekLocationRequest struct {
	IdentitasProyekId uint   `form:"identitas_proyek_id"`
	Provinsi          string `form:"provinsi"`
	Alamat            string `form:"alamat"`
	Kabupaten         string `form:"kabupaten"`
	Kecamatan         string `form:"kecamatan"`
	KecamatanKode     string `form:"kecamatan_kode"`
	Kelurahan         string `form:"kelurahan"`
	Latitude          string `form:"latitude"`
	Longitude         string `form:"longitude"`
}
