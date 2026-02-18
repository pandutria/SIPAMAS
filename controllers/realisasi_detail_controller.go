package controllers

import (
	"gin-gorm/config"
	"gin-gorm/dtos"
	"gin-gorm/models"
	"gin-gorm/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAllRealisasiDetail(c *gin.Context) {
	query := config.DB
	var data []models.RealisasiDetail

	if err := query.Find(&data).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "mengambil data gagal",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusInternalServerError, gin.H{
		"message": "Mengambil data berhasil",
		"data":    data,
	})
}

func CreateRealisasiDetail(c *gin.Context) {
	query := config.DB
	var req dtos.CreateRealisasiDetailRequest

	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Membuat data gagal",
			"error":   err.Error(),
		})
		return
	}

	buktiFile, _ := c.FormFile("bukti_file")
	buktiPath, err := utils.SaveUploadedFile(
		c,
		buktiFile,
		"assets/file",
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Upload file gagal",
			"error":   err.Error(),
		})
		return
	}

	lastRevision := -1
	err = query.
		Model(&models.RealisasiDetail{}).
		Where(
			"realisasi_header_id = ? AND week_number = ?",
			req.RealisasiHeaderId,
			req.WeekNumber,
		).
		Select("COALESCE(MAX(alasan_count), -1)").
		Scan(&lastRevision).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Gagal mengambil revisi terakhir",
			"error":   err.Error(),
		})
		return
	}

	revision := lastRevision + 1

	data := models.RealisasiDetail{
		RealisasiHeaderId: req.RealisasiHeaderId,
		WeekNumber:        &req.WeekNumber,
		Value:             utils.NilIfEmpty(req.Value),
		BuktiFile:         buktiPath,
		AlasanCount:       &revision,
		AlasanText:        utils.NilIfEmpty(req.AlasanText),
	}

	if err := query.Create(&data).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Membuat data gagal",
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Membuat data berhasil",
		"data": data,
	})
}
