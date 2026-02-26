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

func GetAllRabHader(c *gin.Context) {
	query := config.DB
	var data []models.RabHeader

	if err := query.
		Preload("CreatedBy").
		Preload("IdentitasProyek").
		Preload("IdentitasProyek.CreatedBy").
		Preload("IdentitasProyek.Photos").
		Preload("IdentitasProyek.Documents").
		Preload("Details").
		Find(&data).Error; err != nil {
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

func GetRabHaderById(c *gin.Context) {
	query := config.DB
	var data models.RabHeader
	id := c.Param("id")

	if err := query.
		Preload("CreatedBy").
		Preload("IdentitasProyek").
		Preload("IdentitasProyek.CreatedBy").
		Preload("IdentitasProyek.Photos").
		Preload("IdentitasProyek.Documents").
		Preload("Details").
		First(&data, id).Error; err != nil {
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

func CreateRabHeader(c *gin.Context) {
	query := config.DB

	var req dtos.CreateRabHeaderRequest
	if components.BindRequest(c, &req) == false {
		return
	}

	user, err := components.GetCurrentUser(c, query)
	if err != nil {
		return
	}

	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Membuat data gagal",
			"error":   err.Error(),
		})
		return
	}

	if utils.NilIfEmpty(utils.ToString(req.IdentitasProyekId)) == nil ||
		utils.NilIfEmpty(req.Program) == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Semua input wajib di isi",
		})
		return
	}

	if req.RabGroupId != nil {
		var exists bool
		err := query.
			Model(&models.RabHeader{}).
			Select("count(1) > 0").
			Where("rab_group_id = ?", *req.RabGroupId).
			Scan(&exists).Error

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Membuat data gagal",
				"error":   err.Error(),
			})
			return
		}

		if !exists {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Membuat data gagal",
			})
			return
		}
	}

	lastRevision := -1
	if req.RabGroupId != nil {
		err := query.
			Model(&models.RabHeader{}).
			Where("rab_group_id = ?", *req.RabGroupId).
			Select("COALESCE(MAX(alasan_count), 0)").
			Scan(&lastRevision).Error

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Membuat data gagal",
				"error":   err.Error(),
			})
			return
		}
	}

	revision := lastRevision + 1

	data := models.RabHeader{
		RabGroupId:        req.RabGroupId,
		IdentitasProyekId: &req.IdentitasProyekId,
		Program:           utils.NilIfEmpty(req.Program),
		AlasanCount:       &revision,
		AlasanText:        utils.NilIfEmpty(req.AlasanText),
		CreatedById:       user.ID,
	}

	if err := query.Create(&data).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Membuat data gagal",
			"error":   err.Error(),
		})
		return
	}

	if req.RabGroupId == nil {
		query.Model(&data).
			Update("rab_group_id", data.ID)
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Membuat data berhasil",
		"data":    data,
	})
}

func DeleteRab(c *gin.Context) {
	query := config.DB
	id := c.Param("id")

	var data models.RabHeader
	if err := query.First(&data, id).Error; err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"message": "Mengahapus data gagal",
			"error":   err.Error(),
		})
		return
	}

	var schedule []models.ScheduleHeader
	if err := query.Where("rab_id = ?", data.ID).Find(&schedule).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Menghapus data gagal",
			"error":   err.Error(),
		})
		return
	}

	if len(schedule) > 0 {
		c.JSON(http.StatusBadGateway, gin.H{
			"message": "Paket Pekerjaan Konstruksi sudah di-assign ke user PPK",
		})
		return
	}

	var detail []models.RabDetail
	if err := query.
		Where("rab_header_id = ?", data.ID).
		Find(&detail).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Menghapus data gagal",
			"error":   err.Error(),
		})
		return
	}

	if len(detail) > 0 {
		if err := query.Delete(&detail).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Menghapus data gagal",
				"error":   err.Error(),
			})
			return
		}
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
