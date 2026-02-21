package controllers

import (
	"gin-gorm/config"
	"gin-gorm/dtos"
	"gin-gorm/models"
	"gin-gorm/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetAllRealisasiHeader(c *gin.Context) {
	query := config.DB
	var data []models.RealisasiHeader

	if err := query.
		Preload("Details").
		Preload("Evaluasi", func(db *gorm.DB) *gorm.DB {
			return db.Unscoped()
		}).
		Preload("CreatedBy").
		Preload("ScheduleHeader.Items").
		Preload("ScheduleHeader.Items.Weeks").
		Preload("ScheduleHeader.Rab.IdentitasProyek").
		Preload("ScheduleHeader.Rab.IdentitasProyek.CreatedBy").
		Preload("ScheduleHeader.Rab.IdentitasProyek.Photos").
		Preload("ScheduleHeader.Rab.IdentitasProyek.Documents").
		Preload("ScheduleHeader.Rab.Details").
		Find(&data).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{
			"message": "Mengambil data gagal",
			"err":     err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Mengambil data berhasil",
		"data":    data,
	})
}

func GetRealisasiById(c *gin.Context) {
	query := config.DB
	id := c.Param("id")
	var data models.RealisasiHeader

	if err := query.
		Preload("Details").
		Preload("Evaluasi", func(db *gorm.DB) *gorm.DB {
			return db.Unscoped()
		}).
		Preload("CreatedBy").
		Preload("ScheduleHeader.Items").
		Preload("ScheduleHeader.Items.Weeks").
		Preload("ScheduleHeader.Rab.IdentitasProyek").
		Preload("ScheduleHeader.Rab.IdentitasProyek.CreatedBy").
		Preload("ScheduleHeader.Rab.IdentitasProyek.Photos").
		Preload("ScheduleHeader.Rab.IdentitasProyek.Documents").
		Preload("ScheduleHeader.Rab.Details").
		First(&data, id).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{
			"message": "Mengambil data gagal",
			"err":     err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Mengambil data berhasil",
		"data":    data,
	})
}

func CreateRealisasiHeader(c *gin.Context) {
	query := config.DB
	var req dtos.CreateRealisasiRequest
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

	if utils.NilIfEmpty(utils.ToString(req.ScheduleHeaderId)) == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Semua input wajib di isi",
		})
		return
	}

	data := models.RealisasiHeader{
		ScheduleHeaderId: req.ScheduleHeaderId,
		CreatedById:      user.ID,
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

func DeleteRealisasi(c *gin.Context) {
	query := config.DB
	id := c.Param("id")
	var data models.RealisasiHeader

	if err := query.First(&data, id).Error; err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"message": "Menghapus data gagal",
			"error":   err.Error(),
		})
		return
	}

	var evaluasi []models.Evaluasi
	if err := query.Where("realisasi_header_id = ?", data.ID).Find(&evaluasi).Error; err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"message": "Menghapus data gagal",
			"error":   err.Error(),
		})
		return
	}

	if len(evaluasi) > 0 {
		c.JSON(http.StatusBadGateway, gin.H{
			"message": "Paket Pekerjaan Konstruksi sudah di-assign ke user PPK",
		})
		return
	}

	var detail []models.RealisasiDetail
	if err := query.Where("realisasi_header_id = ?", data.ID).Find(&detail).Error; err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"message": "Menghapus data gagal",
			"error":   err.Error(),
		})
		return
	}

	if err := query.Delete(&detail).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
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
