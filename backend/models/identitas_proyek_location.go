package models

type IdentitasProyekLocation struct {
	ID                uint    `gorm:"primaryKey" json:"id"`
	IdentitasProyekId uint    `json:"identitas_proyek_id"`
	Alamat            *string `json:"alamat"`
	Provinsi          *string `json:"provinsi"`
	Kabupaten         *string `json:"kabupaten"`
	Kecamatan         *string `json:"kecamatan"`
	KecamatanKode     *string `json:"kecamatan_kode"`
	Kelurahan         *string `json:"kelurahan"`
	Latitude          *string `json:"latitude"`
	Longitude         *string `json:"longitude"`
}
