package utils

import (
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

func ToString(s uint) string {
	return strconv.FormatUint(uint64(s), 10)
}

func NilIfEmpty(s string) *string {
	if strings.TrimSpace(s) == "" {
		return nil
	}
	return &s
}

func SetIfNotEmpty(dest **string, val string) {
	if strings.TrimSpace(val) == "" {
		return
	}
	*dest = &val
}

func UploadIfExists(c *gin.Context, field string) (*string, error) {
	file, err := c.FormFile(field)
	if err != nil {
		return nil, nil // tidak upload = bukan error
	}

	path, err := SaveUploadedFile(c, file, "assets/file")
	if err != nil {
		return nil, err
	}

	return path, nil
}

