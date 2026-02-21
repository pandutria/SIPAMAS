package controllers

import (
	"gin-gorm/components"
	"gin-gorm/config"
	"gin-gorm/dtos"
	"gin-gorm/models"
	"gin-gorm/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAllPengaduanReview(c *gin.Context) {
	query := config.DB
	var data []models.PengaduanReview

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

func GetPengaduanReviewById(c *gin.Context) {
	query := config.DB
	id := c.Param("id")
	var data models.PengaduanReview

	if err := query.First(&data, id).Error; err != nil {
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

func CreatePengaduanReview(c *gin.Context) {
	query := config.DB

	var req dtos.CreatePengaduaReviewRequest
	if components.BindRequest(c, &req) == false {
		return
	}

	if utils.NilIfEmpty(utils.ToString(req.PengaduanId)) == nil ||
		utils.NilIfEmpty(utils.ToString(req.Rating)) == nil ||
		utils.NilIfEmpty(utils.ToString(req.Catatan)) == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Semua input wajib di isi",
		})
		return
	}

	data := models.PengaduanReview{
		PengaduanId: req.PengaduanId,
		Rating:      req.Rating,
		Catatan:     utils.NilIfEmpty(req.Catatan),
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

func DeletePengaduanReview(c *gin.Context) {
	query := config.DB
	id := c.Param("id")
	var data models.PengaduanReview

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
