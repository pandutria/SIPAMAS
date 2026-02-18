package dtos

type CreateUpdateIdentitasRequest struct {
	ID                     uint    `form:"id"`
	IdentitasProyekGroupId *uint   `form:"identitas_proyek_group_id"`
	Nama                   string  `form:"nama"`
	TahunAnggaran          string  `form:"tahun_anggaran"`
	Kategori               string  `form:"kategori"`
	Provinsi               string  `form:"provinsi"`
	Kabupaten              string  `form:"kabupaten"`
	Kecamatan              string  `form:"kecamatan"`
	Kelurahan              string  `form:"kelurahan"`
	Latitude               string  `form:"latitude"`
	Longitude              string  `form:"longitude"`
	NilaiKontrak           string  `form:"nilai_kontrak"`
	KontraktorPelaksana    string  `form:"kontraktor_pelaksana"`
	KonsultasPengawas      string  `form:"konsultas_pengawas"`
	SumberDana             string  `form:"sumber_dana"`
	AlasanCount            int    `form:"alasan_count"`
	AlasanText             string `form:"alasan_text"`
}
