package models

type User struct {
	ID           uint    `gorm:"primaryKey" json:"id"`
	FullName     *string `json:"fullname"`
	Email        *string `json:"email"`
	Nik          *string `json:"nik"`
	PhoneNumber  *string `json:"phone_number"`
	Address      *string `json:"address"`
	Password     string  `json:"password"`
	ProfilePhoto *string `json:"profile_photo"`
	Nip          *string `json:"nip"`
	SkNumber     *string `json:"sk_number"`
	SkFile       *string `json:"sk_file"`
	Role         *string `json:"role"`
	IsActive     *string   `json:"is_active"`
	Jabatan      *string `json:"jabatan"`
}
