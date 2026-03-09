package models

type User struct {
	ID           uint    `gorm:"primaryKey" json:"id"`
<<<<<<< HEAD
	FullName     *string `json:"fullname" gorm:"column:fullname"`
=======
	Fullname     *string `json:"fullname"`
>>>>>>> 27db81e6f2f3de18a00e483d0962a5e4d96e43b5
	Email        *string `json:"email"`
	Nik          *string `json:"nik"`
	PhoneNumber  *string `json:"phone_number"`
	Address      *string `json:"address"`
	Password     string  `json:"password"`
	ProfilePhoto *string `json:"profile_photo"`
	Nip          *string `json:"nip"`
	SkNumber     *string `json:"sk_number"`
	SkFile       *string `json:"sk_file"`
	KtpFile      *string `json:"ktp_file"`
	Role         *string `json:"role"`
	IsActive     *string `json:"is_active"`
	Jabatan      *string `json:"jabatan"`
}
