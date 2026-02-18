package controllers

import (
	"gin-gorm/config"
	"gin-gorm/dtos"
	"gin-gorm/models"
	"gin-gorm/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAllRealisasiHeader(c *gin.Context) {
	query := config.DB
	var data []models.RealisasiHeader

	if err := query.Find(&data).Error; err != nil {
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

// func GetRealisasiById(c *gin.Context) {
// 	query := config.DB
// 	id := c.Param("id")
// 	var data models.RealisasiHeader

// 	if err := query.First(&data, id).Error; err != nil {
// 		c.JSON(http.StatusOK, gin.H{
// 			"message": "Mengambil data gagal",
// 			"err": err.Error(),
// 		})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "Mengambil data berhasil",
// 		"data": data,
// 	})
// }

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
			"error": err.Error(),
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

func DeleteRealisasi(c *gin.Context) {
	
}
