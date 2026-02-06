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

	if req.FullName == nil || req.Email == nil || req.Role == nil ||
		req.NIK == nil || req.PhoneNumber == nil || req.Address == nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Semua input wajib diisi",
		})
		return
	}

	profileFile, _ := c.FormFile("profile_file")
	profilePath, err := utils.SaveUploadedFile(
		c,
		profileFile,
		"assets/profile_photos",
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
		"assets/sk_files",
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Upload SK file gagal",
			"error":   err.Error(),
		})
		return
	}

	var isActive *bool
	if req.IsActive != nil {
		val := *req.IsActive == "true"
		isActive = &val
	}

	user := models.User{
		FullName:     req.FullName,
		Email:        req.Email,
		Password:     utils.HashSHA512(req.Password),
		Role:         req.Role,
		NIK:          req.NIK,
		PhoneNumber:  req.PhoneNumber,
		Address:      req.Address,
		NIP:          req.NIP,
		ProfilePhoto: profilePath,
		SkNumber:     req.SkNumber,
		SkFile:       skPath,
		IsActive:     isActive,
		Jabatan:      req.Jabatan,
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

	var user models.User
	if err := query.Where("email = ?", req.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Email atau password tidak benar!",
			"error":   err.Error(),
		})
		return
	}

	if !utils.CompareHashSHA512(*req.Password, user.Password) {
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
