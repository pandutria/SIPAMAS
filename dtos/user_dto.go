package dtos

type CreateUserRequest struct {
	FullName    string `form:"fullname"`
	Email       string `form:"email"`
	Nik         string `form:"nik"`
	PhoneNumber string `form:"phone_number"`
	Address     string `form:"address"`
	Password    string `form:"password"`
	Nip         string `form:"nip"`
	SkNumber    string `form:"sk_number"`
	Role        string `form:"role"`
	IsActive    string `form:"is_active"`
	Jabatan     string `form:"jabatan"`
}

type LoginRequest struct {
	Email    string `form:"email"`
	Password string `form:"password"`
}
