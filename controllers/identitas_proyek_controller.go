package controllers

import (
	"gin-gorm/config"
	"gin-gorm/dtos"
	"gin-gorm/models"
	"gin-gorm/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAllIdentitas(c *gin.Context) {
	query := config.DB
	var data []models.IdentitasProyek
	if err := query.
		Preload("CreatedBy").
		Preload("Photos").
		Preload("Documents").
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

func GetIdentitasById(c *gin.Context) {
	query := config.DB
	id := c.Param("id")
	var data models.IdentitasProyek
	if err := query.
		Preload("CreatedBy").
		Preload("Photos").
		Preload("Documents").
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

func CreateIdentitas(c *gin.Context) {
	query := config.DB
	var req dtos.CreateUpdateIdentitasRequest
	userId, isNull := c.Get("user_id")

	if !isNull {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Pengguna harus masuk terlebih dahulu",
		})
		return
	}

	var user models.User
	if err := query.First(&user, userId).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Pengguna harus masuk terlebih dahulu",
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

	kontrakFile, _ := c.FormFile("kontrak_file")
	kontrakPath, err := utils.SaveUploadedFile(
		c,
		kontrakFile,
		"assets/file",
	)

	suratPerintahFile, _ := c.FormFile("surat_perintah_file")
	suratPerintahPath, err := utils.SaveUploadedFile(
		c,
		suratPerintahFile,
		"assets/file",
	)

	suratPenunjukanFile, _ := c.FormFile("surat_penunjukan_file")
	suratPenunjukanPath, err := utils.SaveUploadedFile(
		c,
		suratPenunjukanFile,
		"assets/file",
	)

	beritaAcaraFile, _ := c.FormFile("berita_acara_file")
	beritaAcaraPath, err := utils.SaveUploadedFile(
		c,
		beritaAcaraFile,
		"assets/file",
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Upload Kontrak file gagal",
			"error":   err.Error(),
		})
		return
	}

	if utils.NilIfEmpty(req.Nama) == nil ||
		utils.NilIfEmpty(req.TahunAnggaran) == nil ||
		utils.NilIfEmpty(req.Kategori) == nil ||
		utils.NilIfEmpty(req.Provinsi) == nil ||
		utils.NilIfEmpty(req.Kabupaten) == nil ||
		utils.NilIfEmpty(req.Kecamatan) == nil ||
		utils.NilIfEmpty(req.Kelurahan) == nil ||
		utils.NilIfEmpty(req.Latitude) == nil ||
		utils.NilIfEmpty(req.Longitude) == nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Semua input wajib di isi!",
		})
		return
	}

	data := models.IdentitasProyek{
		Nama:                utils.NilIfEmpty(req.Nama),
		TahunAnggaran:       utils.NilIfEmpty(req.TahunAnggaran),
		Kategori:            utils.NilIfEmpty(req.Kategori),
		Provinsi:            utils.NilIfEmpty(req.Provinsi),
		Kabupaten:           utils.NilIfEmpty(req.Kabupaten),
		Kecamatan:           utils.NilIfEmpty(req.Kecamatan),
		Kelurahan:           utils.NilIfEmpty(req.Kelurahan),
		Latitude:            utils.NilIfEmpty(req.Latitude),
		Longitude:           utils.NilIfEmpty(req.Longitude),
		KontrakFile:         utils.NilIfEmpty(*kontrakPath),
		SuratPerintahFile:   utils.NilIfEmpty(*suratPerintahPath),
		SuratPenunjukanFile: utils.NilIfEmpty(*suratPenunjukanPath),
		BeritaAcaraFile:     utils.NilIfEmpty(*beritaAcaraPath),
		CreatedById:         &user.ID,
	}

	if err := config.DB.Create(&data).Error; err != nil {
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

func UpdateIdentitas(c *gin.Context) {
	query := config.DB
	id := c.Param("id")
	var req dtos.CreateUpdateIdentitasRequest

	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Mengubah data gagal",
			"error":   err.Error(),
		})
		return
	}

	if utils.NilIfEmpty(req.Nama) == nil ||
		utils.NilIfEmpty(req.TahunAnggaran) == nil ||
		utils.NilIfEmpty(req.Kategori) == nil ||
		utils.NilIfEmpty(req.Provinsi) == nil ||
		utils.NilIfEmpty(req.Kabupaten) == nil ||
		utils.NilIfEmpty(req.Kecamatan) == nil ||
		utils.NilIfEmpty(req.Kelurahan) == nil ||
		utils.NilIfEmpty(req.Latitude) == nil ||
		utils.NilIfEmpty(req.Longitude) == nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Semua input wajib di isi!",
		})
		return
	}

	var data models.IdentitasProyek
	if err := query.First(&data, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Mengubah data gagal",
			"error":   err.Error(),
		})
		return
	}

	data.Nama = utils.NilIfEmpty(req.Nama)
	data.TahunAnggaran = utils.NilIfEmpty(req.TahunAnggaran)
	data.Kategori = utils.NilIfEmpty(req.Kategori)
	data.Provinsi = utils.NilIfEmpty(req.Provinsi)
	data.Kabupaten = utils.NilIfEmpty(req.Kabupaten)
	data.Kecamatan = utils.NilIfEmpty(req.Kecamatan)
	data.Kelurahan = utils.NilIfEmpty(req.Kelurahan)
	data.Latitude = utils.NilIfEmpty(req.Latitude)
	data.Longitude = utils.NilIfEmpty(req.Longitude)

	if err := query.Save(&data).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Mengubah data gagal",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Mengubah data berhasil",
		"data":    data,
	})
}

func DeleteIdentitas(c *gin.Context) {
	query := config.DB
	id := c.Param("id")

	var data models.IdentitasProyek
	if err := query.First(&data, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Menghapus data gagal",
			"error":   err.Error(),
		})

		return
	}

	var photo []models.IdentitasProyekPhoto
	if err := query.
		Where("identitas_proyek_id = ?", data.ID).
		Find(&photo).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Menghapus data gagal",
			"error":   err.Error(),
		})
		return
	}

	if err := query.Delete(&photo).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Menghapus data gagal",
			"error":   err.Error(),
		})
		return
	}

	var document []models.IdentitasProyekDocument
	if err := query.
		Where("identitas_proyek_id = ?", data.ID).
		Find(&document).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Menghapus data gagal",
			"error":   err.Error(),
		})
		return
	}

	if err := query.Delete(&document).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
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
