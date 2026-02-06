package utils

import (
	"mime/multipart"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func SaveUploadedFile(
	c *gin.Context,
	file *multipart.FileHeader,
	uploadDir string,
) (*string, error) {

	if file == nil {
		return nil, nil
	}

	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		return nil, err
	}

	filename := uuid.New().String() + "_" + filepath.Base(file.Filename)
	path := filepath.Join(uploadDir, filename)

	if err := c.SaveUploadedFile(file, path); err != nil {
		return nil, err
	}

	return &path, nil
}
