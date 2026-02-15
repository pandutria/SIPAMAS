package controllers

import (
	"gin-gorm/config"
	"gin-gorm/dtos"
	"gin-gorm/models"
	"gin-gorm/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

func CreateUser(c *gin.Context) {
	query := config.DB
	var req dtos.CreateUserRequest

	if err := c.ShouldBindWith(&req, binding.FormMultipart); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Membuat data gagal",
			"error":   err.Error(),
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
		"assets/photo",
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

	var isActive *bool
	if utils.NilIfEmpty(req.IsActive) != nil {
		val := req.IsActive == "true"
		isActive = &val
	}

	user := models.User{
		FullName:     utils.NilIfEmpty(req.FullName),
		Email:        utils.NilIfEmpty(req.Email),
		Password:     utils.HashSHA512(req.Password),
		Role:         utils.NilIfEmpty(req.Role),
		Nik:          utils.NilIfEmpty(req.Nip),
		PhoneNumber:  utils.NilIfEmpty(req.PhoneNumber),
		Address:      utils.NilIfEmpty(req.Address),
		Nip:          utils.NilIfEmpty(req.Nik),
		ProfilePhoto: profilePath,
		SkNumber:     utils.NilIfEmpty(req.SkNumber),
		SkFile:       skPath,
		IsActive:     isActive,
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

func Login(c *gin.Context) {
	query := config.DB
	var req dtos.LoginRequest

	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Login gagal",
			"error":   err.Error(),
		})
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
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Unauthorized",
		})
		return
	}

	var user models.User
	if err := query.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "User tidak ditemukan",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Mengambil data berhasil",
		"data":    user,
	})
}
