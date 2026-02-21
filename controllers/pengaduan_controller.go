package controllers

import (
	"fmt"
	"gin-gorm/components"
	"gin-gorm/config"
	"gin-gorm/dtos"
	"gin-gorm/models"
	"gin-gorm/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAllPengaduan(c *gin.Context) {
	query := config.DB
	var data []models.Pengaduan

	if err := query.
		Preload("CreatedBy").
		Preload("Medias").
		Preload("Timelines").
		Preload("Review").
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

func GetPengaduanById(c *gin.Context) {
	query := config.DB
	id := c.Param("id")
	var data models.Pengaduan

	if err := query.
		Preload("CreatedBy").
		Preload("Medias").
		Preload("Timelines").
		Preload("Review").
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

func CreatePengaduan(c *gin.Context) {
	query := config.DB

	var req dtos.CreatePengaduangRequest
	if components.BindRequest(c, &req) == false {
		return
	}

	user, err := components.GetCurrentUser(c, query)
	if err != nil {
		return
	}

	data := models.Pengaduan{
		Kategori:    utils.NilIfEmpty(req.Kategori),
		Judul:       utils.NilIfEmpty(req.Judul),
		Deskripsi:   utils.NilIfEmpty(req.Deskripsi),
		Alamat:      utils.NilIfEmpty(req.Alamat),
		Latitude:    utils.NilIfEmpty(req.Latitude),
		Longitude:   utils.NilIfEmpty(req.Longitude),
		Status:      "Menunggu",
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

func UpdateStatusPengaduan(c *gin.Context) {
	query := config.DB
	id := c.Param("id")
	var req dtos.UpdatePengaduanStatusRequest

	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Mengubah data gagal",
			"error":   err.Error(),
		})
		return
	}

	var data models.Pengaduan
	if err := query.First(&data, id).Error; err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"message": "Mengubah data gagal",
			"error":   err.Error(),
		})
		return
	}

	data.Status = req.Status

	if err := query.Save(&data).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Mengubah data gagal",
			"error":   err.Error(),
		})
		return
	}

	var judul string
	var keterangan string

	if data.Status == "Diproses" {
		judul = "Status Laporan Diperbarui"
		keterangan = fmt.Sprintf(
			"Laporan %s kini dalam proses pengerjaan oleh tim lapangan.",
			data.ID,
		)

	} else if data.Status == "Selesai" {
		judul = "Laporan Telah Diselesaikan"
		keterangan = fmt.Sprintf(
			"Laporan %s telah selesai diproses. Terima kasih atas partisipasi Anda.",
			data.ID,
		)

	} else if data.Status == "Ditolak" {
		judul = "Laporan Ditolak"
		keterangan = fmt.Sprintf(
			"Laporan %s ditolak. Silakan periksa kembali detail laporan atau hubungi admin untuk informasi lebih lanjut.",
			data.ID,
		)

	} else {
		judul = "Status Laporan"
		keterangan = fmt.Sprintf(
			"Laporan %s mengalami perubahan status.",
			data.ID,
		)
	}

	timeline := models.PengaduanTimeline{
		PengaduanId: data.ID,
		Judul:       &judul,
		Keterangan:  &keterangan,
		CreatedById: data.CreatedById,
	}

	if err := query.Create(&timeline).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Mengubah status gagal",
			"error":   err.Error(),
		})
		data.Status = "Menunggu"
		if err := query.Save(&data).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Mengubah status gagal",
				"error":   err.Error(),
			})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Mengubah data berhasil",
		"data":    data,
	})
}
