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

func GetAllScheduleHeader(c *gin.Context) {
	query := config.DB
	var data []models.ScheduleHeader

	if err := query.
		Preload("CreatedBy").
		Preload("Items").
		Preload("Items.Weeks").
		Preload("Rab.IdentitasProyek").
		Preload("Rab.IdentitasProyek.CreatedBy").
		Preload("Rab.IdentitasProyek.Photos").
		Preload("Rab.IdentitasProyek.Documents").
		Preload("Rab.Details").
		Find(&data).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Membuat data gagal",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Mengambil data berhasil",
		"data":    data,
	})
}

func GetScheduleHeaderById(c *gin.Context) {
	query := config.DB
	id := c.Param("id")
	var data models.ScheduleHeader

	if err := query.
		Preload("CreatedBy").
		Preload("Items").
		Preload("Items.Weeks").
		Preload("Rab.IdentitasProyek").
		Preload("Rab.IdentitasProyek.CreatedBy").
		Preload("Rab.IdentitasProyek.Photos").
		Preload("Rab.IdentitasProyek.Documents").
		Preload("Rab.Details").
		First(&data, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Membuat data gagal",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Mengambil data berhasil",
		"data":    data,
	})
}

func CreateScheduleHeader(c *gin.Context) {
	query := config.DB

	var req dtos.CreateScheduleHeaderRequest
	if components.BindRequest(c, &req) == false {
		return
	}

	user, err := components.GetCurrentUser(c, query)
	if err != nil {
		return
	}

	if utils.NilIfEmpty(utils.ToString(req.RabId)) == nil ||
		utils.NilIfEmpty(req.TanggalMulai) == nil ||
		utils.NilIfEmpty(req.TanggalAkhir) == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Semua input wajib di isi",
		})
		return
	}

	if req.ScheduleGroupId != nil {
		var exists bool
		err := query.
			Model(&models.ScheduleHeader{}).
			Select("count(1) > 0").
			Where("schedule_group_id = ?", *req.ScheduleGroupId).
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
	if req.ScheduleGroupId != nil {
		err := query.
			Model(&models.ScheduleHeader{}).
			Where("schedule_group_id = ?", *req.ScheduleGroupId).
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

	data := models.ScheduleHeader{
		ScheduleGroupId: req.ScheduleGroupId,
		RabId:           req.RabId,
		AlasanCount:     &revision,
		AlasanText:      utils.NilIfEmpty(req.AlasanText),
		TanggalMulai:    utils.NilIfEmpty(req.TanggalMulai),
		TanggalAkhir:    utils.NilIfEmpty(req.TanggalAkhir),
		CreatedById:     user.ID,
	}

	if err := query.Create(&data).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Membuat data gagal",
			"error":   err.Error(),
		})
		return
	}

	if req.ScheduleGroupId == nil {
		query.Model(&data).
			Update("schedule_group_id", data.ID)
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Membuat data berhasil",
		"data":    data,
	})
}

func DeleteSchedule(c *gin.Context) {
	query := config.DB
	id := c.Param("id")
	var data models.ScheduleHeader

	if err := query.First(&data, id).Error; err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"message": "Menghapus data gagal",
			"error":   err.Error(),
		})
		return
	}

	var realisasi []models.RealisasiHeader
	if err := query.Where("schedule_header_id = ?", data.ID).Find(&realisasi).Error; err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"message": "Menghapus data gagal",
			"error":   err.Error(),
		})
		return
	}

	if len(realisasi) > 0 {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Paket Pekerjaan Konstruksi sudah di-assign ke user PPK",
		})
		return
	}

	var item []models.ScheduleItem
	if err := query.Where("schedule_header_id = ?", data.ID).Find(&item).Error; err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"message": "Menghapus data gagal",
			"error":   err.Error(),
		})
		return
	}

	var itemIDs []uint
	for _, i := range item {
		itemIDs = append(itemIDs, i.ID)
	}

	var week []models.ScheduleWeek
	if err := query.Where("schedule_item_id IN ?", itemIDs).Find(&week).Error; err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"message": "Menghapus data gagal",
			"error":   err.Error(),
		})
		return
	}

	if len(week) > 0 {
		if err := query.Delete(&week).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Menghapus data gagal",
				"error":   err.Error(),
			})
			return
		}
	}

	if len(item) > 0 {
		if err := query.Delete(&item).Error; err != nil {
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
