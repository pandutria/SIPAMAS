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
		Preload("IdentitasProyek").
		Preload("IdentitasProyek.Photos").
		Preload("IdentitasProyek.Documents").
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
		Preload("IdentitasProyek").
		Preload("IdentitasProyek.Photos").
		Preload("IdentitasProyek.Documents").
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

	if utils.NilIfEmpty(req.Kategori) == nil ||
		utils.NilIfEmpty(req.Deskripsi) == nil ||
		utils.NilIfEmpty(req.Judul) == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Semua input wajib di isi",
		})
		return
	}

	if utils.NilIfEmpty(req.Alamat) == nil && (utils.NilIfEmpty(req.Latitude) == nil || utils.NilIfEmpty(req.Longitude) == nil) {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Alamat atau Latitude & Longitude wajib diisi salah satu",
		})
		return
	}

	data := models.Pengaduan{
		Kategori:           utils.NilIfEmpty(req.Kategori),
		Judul:              utils.NilIfEmpty(req.Judul),
		Deskripsi:          utils.NilIfEmpty(req.Deskripsi),
		Alamat:             utils.NilIfEmpty(req.Alamat),
		Latitude:           utils.NilIfEmpty(req.Latitude),
		Longitude:          utils.NilIfEmpty(req.Longitude),
		IdentitasPronyekId: &req.IdentitasProyekId,
		Catatan:            utils.NilIfEmpty(req.Catatan),
		Status:             "Menunggu",
		CreatedById:        user.ID,
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
	data.Catatan = utils.NilIfEmpty(req.Catatan)

	if err := query.Save(&data).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Mengubah data gagal",
			"error":   err.Error(),
		})
		return
	}

	var judul string
	var keterangan string

	switch data.Status {

	case "Diterima":
		judul = "Laporan Telah Diterima"
		keterangan = "Laporan telah diterima dan akan segera diproses oleh tim terkait."

	case "Diproses":
		judul = "Status Laporan Diproses"
		keterangan = "Laporan kini dalam proses pengerjaan oleh tim lapangan."

	case "Selesai":
		judul = "Laporan Telah Diselesaikan"
		keterangan = "Laporan telah selesai. Terima kasih atas partisipasi Anda."

	case "Ditolak":
		judul = "Laporan Ditolak"
		keterangan = "Laporan ditolak. Silakan periksa kembali detail laporan atau hubungi admin untuk informasi lebih lanjut."

	default:
		judul = "Status Laporan"
		keterangan = "Laporan mengalami perubahan status."
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

	var user models.User
	if err := query.First(&user, data.CreatedById).Error; err == nil {
		if user.Email != nil {

			emailBody := `
<table style="width: 100%; border-collapse: collapse; background: linear-gradient(135deg, #00BF50 0%, #00692C 100%); padding: 40px 20px;" role="presentation">
<tbody>
<tr>
<td align="center">
<table style="max-width: 600px; width: 100%; border-collapse: collapse; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); font-family: system-ui, sans-serif, Arial;" role="presentation">
<tbody>

<!-- HEADER -->
<tr>
<td style="background: linear-gradient(135deg, #00BF50 0%, #00692C 100%); padding: 50px 40px; text-align: center;">
  <div style="font-size: 48px; margin-bottom: 12px;">🛡️</div>
  <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: -0.5px;">SIPAMAS</h1>
  <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px; font-weight: 500;">Sistem Informasi Pengaduan Masyarakat</p>
</td>
</tr>

<!-- STATUS BADGE -->
<tr>
<td style="background: linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%); padding: 30px 40px 0; text-align: center;">
  <div style="display: inline-block; background: linear-gradient(135deg, #00BF50 0%, #00692C 100%); color: #ffffff; padding: 10px 28px; border-radius: 50px; font-size: 13px; font-weight: 700; letter-spacing: 1px; box-shadow: 0 6px 20px rgba(0, 191, 80, 0.4);">
    📋 PEMBARUAN STATUS PENGADUAN
  </div>
</td>
</tr>

<!-- BODY -->
<tr>
<td style="padding: 30px 40px 40px;">

  <!-- Greeting -->
  <p style="margin: 0 0 20px; color: #4a5568; font-size: 16px; line-height: 1.6;">👋 &nbsp;Halo,</p>
  <p style="margin: 0 0 30px; color: #4a5568; font-size: 16px; line-height: 1.6;">` + keterangan + `</p>

  <!-- Status Card -->
  <table style="width: 100%; border-collapse: collapse; margin: 10px 0 30px;" role="presentation">
  <tbody>
  <tr>
  <td style="background: linear-gradient(135deg, #00BF50 0%, #00692C 100%); padding: 2px; border-radius: 16px;">
    <table style="width: 100%; border-collapse: collapse; background: #ffffff; border-radius: 14px;" role="presentation">
    <tbody>
    <tr>
    <td style="padding: 24px 28px;">
      <p style="margin: 0 0 8px; color: #718096; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">⚡ Status Terbaru</p>
      <p style="margin: 0; color: #1a202c; font-size: 22px; font-weight: bold;">` + data.Status + `</p>
    </td>
    <td style="padding: 24px 28px; text-align: right; font-size: 40px;">📊</td>
    </tr>
    </tbody>
    </table>
  </td>
  </tr>
  </tbody>
  </table>

  <!-- Info Box -->
  <div style="background: #f0fdf4; border-left: 4px solid #00BF50; padding: 20px; margin: 0 0 30px; border-radius: 8px;">
    <p style="margin: 0 0 8px; color: #2d3748; font-size: 14px; font-weight: 600;">ℹ️ &nbsp;Informasi Penting</p>
    <p style="margin: 0; color: #4a5568; font-size: 14px; line-height: 1.6;">Anda dapat memantau perkembangan pengaduan Anda secara real-time melalui portal <strong>SIPAMAS</strong>. Simpan nomor tiket Anda untuk referensi lebih lanjut.</p>
  </div>

  <!-- Steps / Timeline -->
  <table style="width: 100%; border-collapse: collapse; margin: 0 0 10px;" role="presentation">
  <tbody>
  <tr>
  <td style="padding: 12px 16px; background: #f8fafc; border-radius: 10px; margin-bottom: 8px;">
    <table style="width: 100%; border-collapse: collapse;" role="presentation">
    <tbody>
    <tr>
    <td style="width: 36px; vertical-align: middle;">
      <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #00BF50, #00692C); border-radius: 50%; text-align: center; line-height: 32px; font-size: 16px;">📩</div>
    </td>
    <td style="padding-left: 12px; vertical-align: middle;">
      <p style="margin: 0; color: #2d3748; font-size: 14px; font-weight: 600;">Pengaduan Diterima</p>
      <p style="margin: 2px 0 0; color: #718096; font-size: 12px;">Laporan Anda telah masuk ke sistem</p>
    </td>
    </tr>
    </tbody>
    </table>
  </td>
  </tr>
  <tr><td style="height: 6px;"></td></tr>
  <tr>
  <td style="padding: 12px 16px; background: #f8fafc; border-radius: 10px;">
    <table style="width: 100%; border-collapse: collapse;" role="presentation">
    <tbody>
    <tr>
    <td style="width: 36px; vertical-align: middle;">
      <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #00BF50, #00692C); border-radius: 50%; text-align: center; line-height: 32px; font-size: 16px;">🔍</div>
    </td>
    <td style="padding-left: 12px; vertical-align: middle;">
      <p style="margin: 0; color: #2d3748; font-size: 14px; font-weight: 600;">Sedang Diproses</p>
      <p style="margin: 2px 0 0; color: #718096; font-size: 12px;">Tim kami sedang menindaklanjuti laporan Anda</p>
    </td>
    </tr>
    </tbody>
    </table>
  </td>
  </tr>
  <tr><td style="height: 6px;"></td></tr>
  <tr>
  <td style="padding: 12px 16px; background: #f8fafc; border-radius: 10px;">
    <table style="width: 100%; border-collapse: collapse;" role="presentation">
    <tbody>
    <tr>
    <td style="width: 36px; vertical-align: middle;">
      <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #00BF50, #00692C); border-radius: 50%; text-align: center; line-height: 32px; font-size: 16px;">✅</div>
    </td>
    <td style="padding-left: 12px; vertical-align: middle;">
      <p style="margin: 0; color: #2d3748; font-size: 14px; font-weight: 600;">Penyelesaian</p>
      <p style="margin: 2px 0 0; color: #718096; font-size: 12px;">Laporan diselesaikan dan notifikasi dikirim</p>
    </td>
    </tr>
    </tbody>
    </table>
  </td>
  </tr>
  </tbody>
  </table>

</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="background: #dcfce7; padding: 30px 40px; text-align: center; border-top: 1px solid #bbf7d0;">
  <p style="margin: 0; color: #005925; font-size: 13px;">🌿 &nbsp;Terima kasih telah menggunakan layanan <strong>SIPAMAS</strong></p>
  <p style="margin: 10px 0 0; color: #005925; font-size: 12px;">&copy; 2026 SIPAMAS. Hak Cipta Dilindungi.</p>
  <p style="margin: 10px 0 0; color: #00692C; font-size: 11px;">🤖 &nbsp;Ini adalah pesan otomatis, mohon jangan membalas email ini.</p>
</td>
</tr>

</tbody>
</table>
</td>
</tr>
</tbody>
</table>
`

			err = utils.SendEmail(
				*user.Email,
				judul,
				emailBody,
			)

			if err != nil {
				fmt.Println("SMTP ERROR:", err)
			}
		}
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
