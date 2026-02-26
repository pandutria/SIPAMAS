package controllers

import (
	"fmt"
	"gin-gorm/components"
	"gin-gorm/config"
	"gin-gorm/dtos"
	"gin-gorm/models"
	"gin-gorm/utils"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/golang-jwt/jwt"
)

func GetAllUser(c *gin.Context) {
	query := config.DB
	var data []models.User

	if err := query.Find(&data).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Mengambil data gagal",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Mengambil data berhasil",
		"data":    data,
	})
}

func CreateUser(c *gin.Context) {
	query := config.DB

	var req dtos.CreateAndUpdateUserRequest
	if err := c.ShouldBindWith(&req, binding.FormMultipart); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Membuat data gagal",
			"error":   err.Error(),
		})
		return
	}

	var existingUser models.User
	if err := query.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Email sudah terdaftar",
		})
		return
	}

	if utils.NilIfEmpty(req.FullName) == nil ||
		utils.NilIfEmpty(req.Email) == nil || utils.NilIfEmpty(req.Role) == nil ||
		utils.NilIfEmpty(req.Nik) == nil || utils.NilIfEmpty(req.PhoneNumber) == nil ||
		utils.NilIfEmpty(req.Address) == nil || utils.NilIfEmpty(req.Nip) == nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Semua input wajib diisi",
		})
		return
	}

	profileFile, _ := c.FormFile("profile_file")
	profilePath, err := utils.SaveUploadedFile(
		c,
		profileFile,
		"assets/file",
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Upload profile photo gagal",
			"error":   err.Error(),
		})
		return
	}

	skFile, _ := c.FormFile("sk_file")
	skPath, err := utils.SaveUploadedFile(
		c,
		skFile,
		"assets/file",
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Upload SK file gagal",
			"error":   err.Error(),
		})
		return
	}

	user := models.User{
		FullName:     utils.NilIfEmpty(req.FullName),
		Email:        utils.NilIfEmpty(req.Email),
		Password:     utils.HashSHA512(req.Password),
		Role:         utils.NilIfEmpty(req.Role),
		Nik:          utils.NilIfEmpty(req.Nik),
		PhoneNumber:  utils.NilIfEmpty(req.PhoneNumber),
		Address:      utils.NilIfEmpty(req.Address),
		Nip:          utils.NilIfEmpty(req.Nip),
		ProfilePhoto: profilePath,
		SkNumber:     utils.NilIfEmpty(req.SkNumber),
		SkFile:       skPath,
		KtpFile:      nil,
		IsActive:     utils.NilIfEmpty(req.IsActive),
		Jabatan:      utils.NilIfEmpty(req.Jabatan),
	}

	if err := query.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Membuat data gagal",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Membuat data berhasil",
		"data":    user,
	})
}

func UpdateProfile(c *gin.Context) {
	query := config.DB

	var req dtos.CreateAndUpdateUserRequest
	if err := c.ShouldBindWith(&req, binding.FormMultipart); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Membuat data gagal",
			"error":   err.Error(),
		})
		return
	}

	user, err := components.GetCurrentUser(c, query)
	if err != nil {
		return
	}

	profileFile, _ := c.FormFile("profile_file")
	profilePath, err := utils.SaveUploadedFile(
		c,
		profileFile,
		"assets/file",
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Upload profile photo gagal",
			"error":   err.Error(),
		})
		return
	}

	skFile, _ := c.FormFile("sk_file")
	skPath, err := utils.SaveUploadedFile(
		c,
		skFile,
		"assets/file",
	)

	ktpFile, _ := c.FormFile("ktp_file")
	ktpPath, err := utils.SaveUploadedFile(
		c,
		ktpFile,
		"assets/file",
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Upload SK file gagal",
			"error":   err.Error(),
		})
		return
	}

	utils.SetIfNotEmpty(&user.FullName, req.FullName)
	utils.SetIfNotEmpty(&user.Email, req.Email)
	utils.SetIfNotEmpty(&user.Role, req.Role)
	utils.SetIfNotEmpty(&user.Nik, req.Nik)
	utils.SetIfNotEmpty(&user.PhoneNumber, req.PhoneNumber)
	utils.SetIfNotEmpty(&user.Address, req.Address)
	utils.SetIfNotEmpty(&user.Nip, req.Nip)
	utils.SetIfNotEmpty(&user.SkNumber, req.SkNumber)
	utils.SetIfNotEmpty(&user.Jabatan, req.Jabatan)

	if profilePath != nil {
		user.ProfilePhoto = profilePath
	}

	if skPath != nil {
		user.SkFile = skPath
	}

	if ktpPath != nil {
		user.KtpFile = ktpPath
	}

	if err := query.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Mengubah data gagal",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Mengubah data berhasil",
		"data":    user,
	})
}

func UpdateUser(c *gin.Context) {
	query := config.DB
	id := c.Param("id")
	var req dtos.CreateAndUpdateUserRequest
	if err := c.ShouldBindWith(&req, binding.FormMultipart); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Membuat data gagal",
			"error":   err.Error(),
		})
		return
	}

	var user models.User
	if err := query.First(&user, id).Error; err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"message": "Mengubah data gagal",
			"error":   err.Error(),
		})
		return
	}

	profileFile, _ := c.FormFile("profile_file")
	profilePath, err := utils.SaveUploadedFile(
		c,
		profileFile,
		"assets/file",
	)

	ktpFile, _ := c.FormFile("ktp_file")
	ktpPath, err := utils.SaveUploadedFile(
		c,
		ktpFile,
		"assets/file",
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Upload profile photo gagal",
			"error":   err.Error(),
		})
		return
	}

	skFile, _ := c.FormFile("sk_file")
	skPath, err := utils.SaveUploadedFile(
		c,
		skFile,
		"assets/file",
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Upload SK file gagal",
			"error":   err.Error(),
		})
		return
	}

	utils.SetIfNotEmpty(&user.FullName, req.FullName)
	utils.SetIfNotEmpty(&user.Email, req.Email)
	utils.SetIfNotEmpty(&user.Role, req.Role)
	utils.SetIfNotEmpty(&user.Nik, req.Nik)
	utils.SetIfNotEmpty(&user.PhoneNumber, req.PhoneNumber)
	utils.SetIfNotEmpty(&user.Address, req.Address)
	utils.SetIfNotEmpty(&user.Nip, req.Nip)
	utils.SetIfNotEmpty(&user.IsActive, req.IsActive)
	utils.SetIfNotEmpty(&user.SkNumber, req.SkNumber)
	utils.SetIfNotEmpty(&user.Jabatan, req.Jabatan)

	if profilePath != nil {
		user.ProfilePhoto = profilePath
	}

	if skPath != nil {
		user.SkFile = skPath
	}

	if ktpPath != nil {
		user.KtpFile = ktpPath
	}

	if err := query.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Mengubah data gagal",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Mengubah data berhasil",
		"data":    user,
	})
}

func Register(c *gin.Context) {
	query := config.DB

	var req dtos.Register
	if components.BindRequest(c, &req) == false {
		return
	}

	var existingUser models.User
	if err := query.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Email sudah terdaftar",
		})
		return
	}

	ktpFile, _ := c.FormFile("ktp_file")
	ktpPath, err := utils.SaveUploadedFile(
		c,
		ktpFile,
		"assets/file",
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Upload file gagal",
			"error":   err.Error(),
		})
		return
	}

	if utils.NilIfEmpty(req.Fullname) == nil ||
		utils.NilIfEmpty(req.Email) == nil ||
		utils.NilIfEmpty(req.Address) == nil ||
		utils.NilIfEmpty(req.Password) == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Semua input wajib di isi",
		})
		return
	}

	role := "masyarakat"
	active := "false"

	data := models.User{
		FullName: utils.NilIfEmpty(req.Fullname),
		Email:    utils.NilIfEmpty(req.Email),
		Address:  utils.NilIfEmpty(req.Address),
		Password: utils.HashSHA512(req.Password),
		IsActive: &active,
		Role:     &role,
		KtpFile:  ktpPath,
	}

	if err := query.Create(&data).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Mendaftarkan akun gagal",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Mendaftarkan akun berhasil",
		"data":    data,
	})
}

func Login(c *gin.Context) {
	query := config.DB

	var req dtos.LoginRequest
	if components.BindRequest(c, &req) == false {
		return
	}

	if utils.NilIfEmpty(req.Email) == nil || utils.NilIfEmpty(req.Password) == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Semua input wajib di isi!",
		})
		return
	}

	var user models.User
	if err := query.Where("email = ?", utils.NilIfEmpty(req.Email)).First(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Email atau password tidak benar!",
			"error":   err.Error(),
		})
		return
	}

	if !utils.CompareHashSHA512(*utils.NilIfEmpty(req.Password), user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Email atau password tidak benar!",
		})
		return
	}

	token, err := utils.GenerateJWT(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Membuat token gagal",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login berhasil",
		"token":   token,
		"role":    user.Role,
	})
}

func Me(c *gin.Context) {
	query := config.DB

	user, err := components.GetCurrentUser(c, query)
	if err != nil {
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Mengambil data berhasil",
		"data":    user,
	})
}

func DeleteUser(c *gin.Context) {
	query := config.DB
	id := c.Param("id")
	var data models.User

	if err := query.First(&data, id).Error; err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"message": "Menghapus data gagal",
			"error":   err.Error(),
		})
		return
	}

	if err := query.Delete(&data).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Menghapus data gagal",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Menghapus data berhasil",
		"data":    data,
	})
}

func UpdatePassword(c *gin.Context) {
	query := config.DB

	var req dtos.UpdatePasswordRequest
	if components.BindRequest(c, &req) == false {
		return
	}

	user, err := components.GetCurrentUser(c, query)
	if err != nil {
		return
	}

	if err := query.Where("id = ?", user.ID).Find(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Pengguna tidak valid!",
			"error":   err.Error(),
		})
		return
	}

	user.Password = utils.HashSHA512(req.Password)

	if err := config.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Mengubah password gagal",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Mengubah password berhasil",
		"data":    user,
	})
}

func GenerateResetToken(userID uint) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(15 * time.Minute).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

func RequestResetPassword(c *gin.Context) {
	db := config.DB

	var req struct {
		Email string `json:"email" binding:"required,email"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Email tidak valid",
		})
		return
	}

	var user models.User
	if err := db.Where("email = ?", req.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{
			"message": "Jika email terdaftar, link reset akan dikirim",
		})
		return
	}

	token, err := utils.GenerateResetToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Gagal generate token",
		})
		return
	}

	resetURL := fmt.Sprintf(
		"%s/reset-kata-sandi?token=%s&email=%s",
		os.Getenv("FRONTEND_URL"),
		token,
		url.QueryEscape(*user.Email),
	)

	emailBody := `
<table style="width: 100%; border-collapse: collapse; background: linear-gradient(135deg, #00BF50 0%, #00692C 100%); padding: 40px 20px;" role="presentation">
<tbody>
<tr>
<td align="center">
<table style="max-width: 600px; width: 100%; border-collapse: collapse; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); font-family: system-ui, sans-serif, Arial;" role="presentation">
<tbody>
<tr>
<td style="background: linear-gradient(135deg, #00BF50 0%, #00692C 100%); padding: 50px 40px; text-align: center;">
<h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: -0.5px;">SIPAMAS</h1>
<p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px; font-weight: 500;">Sistem Informasi Pengaduan Masyarakat</p>
</td>
</tr>
<tr>
<td style="padding: 50px 40px;">
<h2 style="margin: 0 0 20px; color: #1a202c; font-size: 28px; font-weight: bold;">Reset Kata Sandi Anda</h2>
<p style="margin: 0 0 20px; color: #4a5568; font-size: 16px; line-height: 1.6;">Halo,</p>
<p style="margin: 0 0 20px; color: #4a5568; font-size: 16px; line-height: 1.6;">Kami menerima permintaan untuk mereset kata sandi akun&nbsp;<strong>SIPAMAS</strong> Anda. Klik tombol di bawah ini untuk membuat password baru.</p>
<table style="width: 100%; margin: 30px 0;" role="presentation">
<tbody>
<tr>
<td align="center"><a style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #00BF50 0%, #00692C 100%); color: #ffffff; text-decoration: none; border-radius: 50px; font-size: 16px; font-weight: 600; box-shadow: 0 10px 25px rgba(0, 191, 80, 0.4); transition: all 0.3s ease;" href="` + resetURL + `"> Reset Password </a></td>
</tr>
</tbody>
</table>
<div style="background: #f0fdf4; border-left: 4px solid #00BF50; padding: 20px; margin: 30px 0; border-radius: 8px;">
<p style="margin: 0 0 10px; color: #2d3748; font-size: 14px; font-weight: 600;">Catatan Keamanan:</p>
<p style="margin: 0; color: #4a5568; font-size: 14px; line-height: 1.5;">Link reset password ini akan kadaluarsa dalam <strong>24 jam</strong> untuk alasan keamanan. Jika Anda tidak meminta reset ini, abaikan email ini.</p>
</div>
</td>
</tr>
<tr>
<td style="background: #dcfce7; padding: 30px 40px; text-align: center; border-top: 1px solid #bbf7d0;">
<p style="margin: 20px 0 0; color: #005925; font-size: 12px;">&copy; 2026 SIPAMAS. Hak Cipta Dilindungi.</p>
<p style="margin: 10px 0 0; color: #00692C; font-size: 11px;">Ini adalah pesan otomatis, mohon jangan membalas email ini.</p>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
`

	err = utils.SendEmail(*user.Email, "Reset Password", emailBody)
	if err != nil {
		fmt.Println("SMTP ERROR:", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Gagal mengirim email",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Jika email terdaftar, link reset akan dikirim",
	})
}

func ResetPassword(c *gin.Context) {
	var req struct {
		Token    string `json:"token"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Request tidak valid"})
		return
	}

	userID, err := utils.ParseJWT(req.Token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Token tidak valid"})
		return
	}

	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "User tidak ditemukan"})
		return
	}

	user.Password = utils.HashSHA512(req.Password)

	config.DB.Save(&user)

	c.JSON(http.StatusOK, gin.H{
		"message": "Password berhasil diubah",
	})
}
