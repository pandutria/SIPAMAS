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
	var req dtos.CreateAndUpdateUserRequest

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
	userID, exists := c.Get("user_id")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Unauthorized",
		})
		return
	}

	if err := c.ShouldBindWith(&req, binding.FormMultipart); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Membuat data gagal",
			"error":   err.Error(),
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

	var data models.User
	if err := query.First(&data, userID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Mengubah data gagal",
			"error":   err.Error(),
		})
		return
	}

	utils.SetIfNotEmpty(&data.FullName, req.FullName)
	utils.SetIfNotEmpty(&data.Email, req.Email)
	utils.SetIfNotEmpty(&data.Role, req.Role)
	utils.SetIfNotEmpty(&data.Nik, req.Nik)
	utils.SetIfNotEmpty(&data.PhoneNumber, req.PhoneNumber)
	utils.SetIfNotEmpty(&data.Address, req.Address)
	utils.SetIfNotEmpty(&data.Nip, req.Nip)
	utils.SetIfNotEmpty(&data.SkNumber, req.SkNumber)
	utils.SetIfNotEmpty(&data.SkNumber, req.SkNumber)
	utils.SetIfNotEmpty(&data.Jabatan, req.Jabatan)

	if profilePath != nil {
		data.ProfilePhoto = profilePath
	}

	if skPath != nil {
		data.SkFile = skPath
	}

	if err := query.Save(&data).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Mengubah data gagal",
			"error":  err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Mengubah data berhasil",
		"data":    data,
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
