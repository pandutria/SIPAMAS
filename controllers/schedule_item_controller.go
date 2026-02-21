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

func GetAllScheduleItem(c *gin.Context) {
	query := config.DB
	var data []models.ScheduleItem

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

func CreateScheduleItem(c *gin.Context) {
	query := config.DB

	var req dtos.CreateScheduleItemRequest
	if components.BindRequest(c, &req) == false {
		return
	}

	// if utils.NilIfEmpty(utils.ToString(req.ScheduleHeaderId)) == nil ||
	// 	utils.NilIfEmpty(req.Keterangan) == nil ||
	// 	utils.NilIfEmpty(req.Jumlah) == nil ||
	// 	utils.NilIfEmpty(req.Bobot) == nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{
	// 		"message": "Semua input wajib di isi",
	// 	})
	// 	return
	// }

	data := models.ScheduleItem{
		ScheduleHeaderId: req.ScheduleHeaderId,
		Nomor:            utils.NilIfEmpty(req.Nomor),
		Keterangan:       utils.NilIfEmpty(req.Keterangan),
		Jumlah:           utils.NilIfEmpty(req.Jumlah),
		Bobot:            utils.NilIfEmpty(req.Bobot),
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
