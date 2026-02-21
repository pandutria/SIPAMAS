package controllers

import (
	"gin-gorm/config"
	"gin-gorm/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAllPengaduanTimeLine(c *gin.Context) {
	query := config.DB
	var data []models.PengaduanTimeline

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

func GetPengaduanTimeLineById(c *gin.Context) {
	query := config.DB
	id := c.Param("id")
	var data models.PengaduanTimeline

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
