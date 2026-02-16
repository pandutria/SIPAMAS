package models

import "time"

type IdentitasProyek struct {
	ID                  uint      `gorm:"primaryKey" json:"id"`
	Nama                *string   `json:"nama"`
	TahunAnggaran       *string   `json:"tahun_anggaran"`
	Kategori            *string   `json:"kategori"`
	Provinsi            *string   `json:"provinsi"`
	Kabupaten           *string   `json:"kabupaten"`
	Kecamatan           *string   `json:"kecamatan"`
	Kelurahan           *string   `json:"kelurahan"`
	Latitude            *string   `json:"latitude"`
	Longitude           *string   `json:"longitude"`
	NilaiKontrak        *string   `json:"nilai_kontrak"`
	KontraktorPelaksana *string   `json:"kontraktor_pelaksana"`
	KonsultasPengawas   *string   `json:"konsultas_pengawas"`
	SumberDana          *string   `json:"sumber_dana"`
	KontrakFile         *string   `json:"kontrak_file"`
	SuratPerintahFile   *string   `json:"surat_perintah_file"`
	SuratPenunjukanFile *string   `json:"surat_penunjukan_file"`
	BeritaAcaraFile     *string   `json:"berita_acara_file"`
	CreatedById         *uint     `json:"created_by_id"`
	CreatedAt           time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt           time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	CreatedBy *User                      `gorm:"foreignKey:CreatedById" json:"created_by"`
	Photos    []*IdentitasProyekPhoto    `gorm:"foreignKey:identitas_proyek_id" json:"photos"`
	Documents []*IdentitasProyekDocument `gorm:"foreignKey:identitas_proyek_id" json:"documents"`
}
