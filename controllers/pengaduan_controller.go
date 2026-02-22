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

func GetAllPengaduan(c *gin.Context) {
	query := config.DB
	var data []models.Pengaduan

	if err := query.
		Preload("CreatedBy").
		Preload("Medias").
		Preload("Timelines").
		Preload("Timelines.CreatedBy").
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
		keterangan = "Laporan %s kini dalam proses pengerjaan oleh tim lapangan."

	} else if data.Status == "Selesai" {
		judul = "Laporan Telah Diselesaikan"
		keterangan = "Laporan %s telah selesai diproses. Terima kasih atas partisipasi Anda."

	} else if data.Status == "Ditolak" {
		judul = "Laporan Ditolak"
		keterangan = "Laporan %s ditolak. Silakan periksa kembali detail laporan atau hubungi admin untuk informasi lebih lanjut."

	} else {
		judul = "Status Laporan"
		keterangan = "Laporan %s mengalami perubahan status."
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

func DeletePengaduan(c *gin.Context) {
	query := config.DB
	id := c.Param("id")
	var data models.Pengaduan

	if err := query.First(&data, id).Error; err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"message": "Menghapus data gagal",
			"error":   err.Error(),
		})
		return
	}

	var media []models.PengaduanMedia
	if err := query.Where("pengaduan_id = ?", data.ID).Find(&media).Error; err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"message": "Menghapus data gagal",
			"error":   err.Error(),
		})
		return
	}

	var timeline []models.PengaduanTimeline
	if err := query.Where("pengaduan_id = ?", data.ID).Find(&timeline).Error; err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"message": "Menghapus data gagal",
			"error":   err.Error(),
		})
		return
	}

	var review []models.PengaduanReview
	if err := query.Where("pengaduan_id = ?", data.ID).Find(&review).Error; err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"message": "Menghapus data gagal",
			"error":   err.Error(),
		})
		return
	}

	if len(media) > 0 {
		if err := query.Delete(&media).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Menghapus data gagal",
				"error":   err.Error(),
			})
			return
		}
	}

	if len(timeline) > 0 {
		if err := query.Delete(&timeline).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Menghapus data gagal",
				"error":   err.Error(),
			})
			return
		}
	}

	if len(review) > 0 {
		if err := query.Delete(&review).Error; err != nil {
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
