package models

type ProgressPekerjaanHeader struct {
	ID                     uint    `gorm:"primaryKey" json:"id"`
	IdentitasProyekId      uint    `json:"identitas_proyek_id"`
	CreatedById            uint    `json:"created_by_id"`
	CatatanPekerjaan       *string `json:"catatan_pekerjaan"`

	CreatedBy       *User            `gorm:"foreignKey:CreatedById" json:"created_by"`
	IdentitasProyek *IdentitasProyek `gorm:"foreignKey:IdentitasProyekId" json:"proyek"`
}
