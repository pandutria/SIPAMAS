package components

import (
	"gin-gorm/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetCurrentUser(c *gin.Context, db *gorm.DB) (*models.User, error) {
	userId, null := c.Get("user_id")
	if !null {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Pengguna harus masuk terlebih dahulu",
			"error": "Unauthorize",
		})
		return nil, gin.Error{}
	}

	var user models.User
	if err := db.First(&user, userId).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Gagal mengambil data pengguna",
			"error":   err.Error(),
		})
		return nil, err
	}

	return &user, nil
}