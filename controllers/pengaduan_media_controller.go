package controllers

import (
	"gin-gorm/config"
	"gin-gorm/dtos"
	"gin-gorm/models"
	"gin-gorm/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAllPengaduanMedia(c *gin.Context) {
	query := config.DB
	var data []models.PengaduanMedia

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

func CreatePengaduanMedia(c *gin.Context) {
	query := config.DB
	var req dtos.CreatePengaduanMediaRequest

	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Membuat data gagal",
			"error":   err.Error(),
		})
		return
	}

	mediaFile, _ := c.FormFile("media_file")
	mediaPath, err := utils.SaveUploadedFile(
		c,
		mediaFile,
		"assets/photo",
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Upload file gagal",
			"error":   err.Error(),
		})
		return
	}

	if utils.NilIfEmpty(req.MediaTipe) == nil ||
		utils.NilIfEmpty(utils.ToString(req.PengaduanId)) == nil ||
		mediaPath == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Semua input wajib di isi",
		})
		return
	}

	data := models.PengaduanMedia{
		PengaduanId: req.PengaduanId,
		MediaTipe:   utils.NilIfEmpty(req.MediaTipe),
		MediaFile:   mediaPath,
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

func UpdateStatusPengaduan(c *gin.Context) {
	query := config.DB
}