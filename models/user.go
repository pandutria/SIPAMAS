package models

type User struct {
	ID           uint    `gorm:"primaryKey" json:"id"`
	FullName     *string `json:"fullname"`
	Email        *string `json:"email"`
	NIK          *string `json:"nik"`
	PhoneNumber  *string `json:"phone_number"`
	Address      *string `json:"address"`
	Password     string `json:"password"`
	ProfilePhoto *string `json:"profile_photo"`
	NIP          *string `json:"nip"`
	SkNumber     *string `json:"sk_number"`
	SkFile       *string `json:"sk_file"`
	Role         *string `json:"role"`
	IsActive     *bool   `json:"is_active"`
	Jabatan      *string `json:"jabatan"`
}
