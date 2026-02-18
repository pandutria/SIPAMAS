package controllers

import (
	"gin-gorm/config"
	"gin-gorm/dtos"
	"gin-gorm/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAllScheduleWeek(c *gin.Context) {
	query := config.DB
	var data []models.ScheduleWeek

	if err := query.Find(&data).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Mengambil data gagal",
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Mengambil data berhasil",
		"data": data,
	})
}

func CreateScheduleWeek(c *gin.Context) {
	query := config.DB
	var req dtos.CreateScheduleWeek

	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Membuat data gagal",
			"error": err.Error(),
		})
		return
	}

	data := models.ScheduleWeek{
		ScheduleItemId: req.ScheduleItemId,
		MingguNomor: req.MingguNomor,
		Nilai: req.Nilai,
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