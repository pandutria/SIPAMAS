package controllers

import (
	"gin-gorm/config"
	"gin-gorm/dtos"
	"gin-gorm/models"
	"gin-gorm/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAllRabDetail(c *gin.Context) {
	query := config.DB
	var data []models.RabDetail

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

func CreateRabDetail(c *gin.Context) {
	query := config.DB
	var req dtos.CreateRabDetailRequest

	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Membuat data gagal",
			"error":   err.Error(),
		})
		return
	}

	if utils.NilIfEmpty(utils.ToString(req.RabHeaderId)) == nil ||
		utils.NilIfEmpty(req.Keterangan) == nil ||
		utils.NilIfEmpty(req.Satuan) == nil ||
		utils.NilIfEmpty(req.Volume) == nil ||
		utils.NilIfEmpty(req.Harga) == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Semua field wajib di isi",
		})
		return
	}

	data := models.RabDetail{
		RabHeaderId: req.RabHeaderId,
		Keterangan:  req.Keterangan,
		Satuan:      req.Satuan,
		Volume:      req.Volume,
		Harga:       req.Harga,
		Total:       req.Total,
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
