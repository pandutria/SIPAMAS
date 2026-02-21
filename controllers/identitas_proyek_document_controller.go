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

func GetAllIdentitasProyekDocument(c *gin.Context) {
	query := config.DB
	var data []models.IdentitasProyekDocument
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

func GetIdentitasProyekDocumentById(c *gin.Context) {
	query := config.DB
	id := c.Param("id")
	var data models.IdentitasProyekDocument
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

func CreateIdentitasProyekDocument(c *gin.Context) {
	query := config.DB

	var req dtos.CreateIdentitasProyekDocumentRequest
	if components.BindRequest(c, &req) == false {
		return
	}

	photoFile, _ := c.FormFile("photo_file")
	photoPath, err := utils.SaveUploadedFile(
		c,
		photoFile,
		"assets/file",
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Upload file gagal",
			"error":   err.Error(),
		})
		return
	}

	data := models.IdentitasProyekDocument{
		Name:              utils.NilIfEmpty(req.Name),
		Kategori:          utils.NilIfEmpty(req.Kategori),
		IdentitasProyekId: req.IdentitasProyekId,
		PhotoFile:         utils.NilIfEmpty(*photoPath),
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

func DeleteIdentitasProyekDocument(c *gin.Context) {
	query := config.DB
	id := c.Param("id")
	var data models.IdentitasProyekDocument

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
