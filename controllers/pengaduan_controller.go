package controllers

import (
	"gin-gorm/config"
	"gin-gorm/dtos"
	"gin-gorm/models"
	"gin-gorm/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAllPengaduan(c *gin.Context) {
	query := config.DB
	var data []models.Pengaduan

	if err := query.
		Preload("CreatedBy").
		Preload("Medias").
		Preload("Timelines").
		Preload("Review").
		Find(&data).Error; err != nil {
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

func GetPengaduanById(c *gin.Context) {
	query := config.DB
	id := c.Param("id")
	var data models.Pengaduan

	if err := query.
		Preload("CreatedBy").
		Preload("Medias").
		Preload("Timelines").
		Preload("Review").
		First(&data, id).Error; err != nil {
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

func CreatePengaduan(c *gin.Context) {
	query := config.DB
	var req dtos.CreatePengaduangRequest
	userId, isNull := c.Get("user_id")

	if !isNull {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Pengguna harus masuk terlebih dahulu",
		})
		return
	}

	var user models.User
	if err := query.First(&user, userId).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Membuat data gagal",
			"error":   err.Error(),
		})
		return
	}

	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Membuat data gagal",
			"error":   err.Error(),
		})
		return
	}

	data := models.Pengaduan{
		Kategori:    utils.NilIfEmpty(req.Kategori),
		Judul:       utils.NilIfEmpty(req.Judul),
		Deskripsi:   utils.NilIfEmpty(req.Deskripsi),
		Alamat:      utils.NilIfEmpty(req.Alamat),
		Latitude:    utils.NilIfEmpty(req.Latitude),
		Longitude:   utils.NilIfEmpty(req.Longitude),
		Status:      "Menunggu",
		CreatedById: user.ID,
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
