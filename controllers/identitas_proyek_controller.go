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

	if req.IdentitasProyekGroupId != nil {
		var exists bool
		err := query.
			Model(&models.IdentitasProyek{}).
			Select("count(1) > 0").
			Where("identitas_proyek_group_id = ?", *req.IdentitasProyekGroupId).
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
	if req.IdentitasProyekGroupId != nil {
		err := query.
			Model(&models.IdentitasProyek{}).
			Where("identitas_proyek_group_id = ?", *req.IdentitasProyekGroupId).
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

	if utils.NilIfEmpty(req.Nama) == nil ||
		utils.NilIfEmpty(req.TahunAnggaran) == nil ||
		utils.NilIfEmpty(req.Kategori) == nil ||
		utils.NilIfEmpty(req.Provinsi) == nil ||
		utils.NilIfEmpty(req.Kabupaten) == nil ||
		utils.NilIfEmpty(req.Kecamatan) == nil ||
		utils.NilIfEmpty(req.Kelurahan) == nil ||
		utils.NilIfEmpty(req.Latitude) == nil ||
		utils.NilIfEmpty(req.Longitude) == nil ||
		utils.NilIfEmpty(req.NilaiKontrak) == nil ||
		utils.NilIfEmpty(req.KontraktorPelaksana) == nil ||
		utils.NilIfEmpty(req.KonsultasPengawas) == nil ||
		utils.NilIfEmpty(req.SumberDana) == nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Semua input wajib di isi!",
		})
		return
	}

	revision := lastRevision + 1

	data := models.IdentitasProyek{
		IdentitasProyekGroupId: req.IdentitasProyekGroupId,
		Nama:                   utils.NilIfEmpty(req.Nama),
		TahunAnggaran:          utils.NilIfEmpty(req.TahunAnggaran),
		Kategori:               utils.NilIfEmpty(req.Kategori),
		Provinsi:               utils.NilIfEmpty(req.Provinsi),
		Kabupaten:              utils.NilIfEmpty(req.Kabupaten),
		Kecamatan:              utils.NilIfEmpty(req.Kecamatan),
		Kelurahan:              utils.NilIfEmpty(req.Kelurahan),
		Latitude:               utils.NilIfEmpty(req.Latitude),
		Longitude:              utils.NilIfEmpty(req.Longitude),
		NilaiKontrak:           utils.NilIfEmpty(req.NilaiKontrak),
		KontraktorPelaksana:    utils.NilIfEmpty(req.KontraktorPelaksana),
		KonsultasPengawas:      utils.NilIfEmpty(req.KonsultasPengawas),
		SumberDana:             utils.NilIfEmpty(req.SumberDana),
		KontrakFile:            utils.NilIfEmpty(*kontrakPath),
		SuratPerintahFile:      utils.NilIfEmpty(*suratPerintahPath),
		SuratPenunjukanFile:    utils.NilIfEmpty(*suratPenunjukanPath),
		BeritaAcaraFile:        utils.NilIfEmpty(*beritaAcaraPath),
		AlasanText:             utils.NilIfEmpty(req.AlasanText),
		AlasanCount:            &revision,
		CreatedById:            &user.ID,
	}

	if err := config.DB.Create(&data).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Membuat data gagal",
			"error":   err.Error(),
		})
		return
	}

	if req.IdentitasProyekGroupId == nil {
		query.Model(&data).
			Update("identitas_proyek_group_id", data.ID)
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
			"message": "Upload file gagal",
			"error":   err.Error(),
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

	utils.SetIfNotEmpty(&data.Nama, req.Nama)
	utils.SetIfNotEmpty(&data.TahunAnggaran, req.TahunAnggaran)
	utils.SetIfNotEmpty(&data.Kategori, req.Kategori)
	utils.SetIfNotEmpty(&data.Provinsi, req.Provinsi)
	utils.SetIfNotEmpty(&data.Kabupaten, req.Kabupaten)
	utils.SetIfNotEmpty(&data.Kecamatan, req.Kecamatan)
	utils.SetIfNotEmpty(&data.Kelurahan, req.Kelurahan)
	utils.SetIfNotEmpty(&data.Latitude, req.Latitude)
	utils.SetIfNotEmpty(&data.Longitude, req.Longitude)
	utils.SetIfNotEmpty(&data.NilaiKontrak, req.NilaiKontrak)
	utils.SetIfNotEmpty(&data.KontraktorPelaksana, req.KontraktorPelaksana)
	utils.SetIfNotEmpty(&data.KonsultasPengawas, req.KonsultasPengawas)
	utils.SetIfNotEmpty(&data.SumberDana, req.SumberDana)

	if kontrakPath != nil {
		data.KontrakFile = kontrakPath
	}

	if suratPerintahPath != nil {
		data.SuratPerintahFile = suratPenunjukanPath
	}

	if suratPenunjukanPath != nil {
		data.SuratPenunjukanFile = suratPenunjukanPath
	}

	if suratPenunjukanPath != nil {
		data.SuratPenunjukanFile = suratPenunjukanPath
	}

	if beritaAcaraPath != nil {
		data.BeritaAcaraFile = beritaAcaraPath
	}

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

	var rab []models.RabHeader
	if err := query.
		Where("identitas_proyek_id = ?", data.ID).
		Find(&rab).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Menghapus data gagal",
			"error":   err.Error(),
		})
		return
	}

	if len(rab) > 0 {
		c.JSON(http.StatusBadGateway, gin.H{
			"message": "Paket Pekerjaan Konstruksi sudah di-assign ke user PPK",
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
