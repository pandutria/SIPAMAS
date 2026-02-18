package controllers

import (
	"gin-gorm/config"
	"gin-gorm/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAllPengaduan(c *gin.Context) {
	query := config.DB
	var data []models.Pengaduan

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

func GetPengaduanById(c *gin.Context) {
	query := config.DB
	id := c.Param("id")
	var data models.Pengaduan

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

func CreatePengaduan(c *gin.Context) {
	
}
