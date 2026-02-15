package controllers

import (
	"gin-gorm/config"
	"gin-gorm/dtos"
	"gin-gorm/models"
	"gin-gorm/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAllIdentitasProyekPhoto(c *gin.Context) {
	query := config.DB
	var data []models.IdentitasProyekPhoto
	if err := query.Find(&data).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Mengambil data gagal!",
			"error":   err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"messahe": "Mengambil data berhasil",
		"data":    data,
	})
}

func GetIdentitasProyekPhotoById(c *gin.Context) {
	query := config.DB
	id := c.Param("id")
	var data models.IdentitasProyekPhoto
	if err := query.First(&data, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Mengambil data gagal!",
			"error":   err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"messahe": "Mengambil data berhasil",
		"data":    data,
	})
}

func CreateIdentitasProyekPhoto(c *gin.Context) {
	query := config.DB
	var req dtos.CreateIdentitasProyekPhotoRequest

	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Membuat data gagal",
			"error":   err.Error(),
		})
		return
	}

	photoFile, _ := c.FormFile("photo_file")
	photoPath, err := utils.SaveUploadedFile(
		c,
		photoFile,
		"assets/photo",
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Upload photo gagal",
		})
		return
	}

	if utils.NilIfEmpty(*photoPath) == nil ||
		utils.NilIfEmpty(req.Title) == nil ||
		utils.NilIfEmpty(req.Type) == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Semua input wajib di isi",
		})
		return
	}

	data := models.IdentitasProyekPhoto{
		PhotoFile:         *utils.NilIfEmpty(*photoPath),
		Title:             req.Title,
		Type:              req.Type,
		IdentitasProyekId: req.IdentitasProyekId,
	}

	if err := query.Create(&data).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Membuat data gagal",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Membuat data berhasil",
		"data":    data,
	})
}
