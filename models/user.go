package models

type User struct {
	ID uint `gorm:"primaryKey" json:"id"`
	FullName *string `json"fullname"`
	Email *string `json"email"`
	NIK *string `json"nik"`
	PhoneNumber *string `json"phone_number"`
	Address *string `json"address"`
	Password *string `json"password"`
	Role *string `json"role"`
}