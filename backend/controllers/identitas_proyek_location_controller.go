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

func GetAllIdentitasProyekLocation(c *gin.Context) {
	query := config.DB
	var data []models.IdentitasProyekPhoto

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

func GetIdentitasProyekLocationById(c *gin.Context) {
	query := config.DB
	id := c.Param("id")
	var data models.IdentitasProyekPhoto

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

func CreateIdentitasProyekLocation(c *gin.Context) {
	query := config.DB
	var req dtos.CreateIdentitasProyekLocationRequest
	if components.BindRequest(c, &req) == false {
		return
	}

	data := models.IdentitasProyekLocation{
		IdentitasProyekId: req.IdentitasProyekId,
		Provinsi:          utils.NilIfEmpty(req.Provinsi),
		Alamat:            utils.NilIfEmpty(req.Alamat),
		Kabupaten:         utils.NilIfEmpty(req.Kabupaten),
		Kecamatan:         utils.NilIfEmpty(req.Kecamatan),
		Kelurahan:         utils.NilIfEmpty(req.Kelurahan),
		Latitude:          utils.NilIfEmpty(req.Latitude),
		Longitude:         utils.NilIfEmpty(req.Longitude),
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

func DeleteIdentitasProyekLocation(c *gin.Context) {
	query := config.DB
	id := c.Param("id")
	var data models.IdentitasProyekLocation

	if err := query.First(&data, id).Error; err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"message": "Menghapus data gagall",
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
