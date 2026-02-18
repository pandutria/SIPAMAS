package utils

import (
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

func ToString(value interface{}) string {
	switch v := value.(type) {
	case string:
		return v
	case int:
		return strconv.Itoa(v)
	case int8:
		return strconv.Itoa(int(v))
	case int16:
		return strconv.Itoa(int(v))
	case int32:
		return strconv.Itoa(int(v))
	case int64:
		return strconv.FormatInt(v, 10)
	case uint:
		return strconv.FormatUint(uint64(v), 10)
	case uint8:
		return strconv.FormatUint(uint64(v), 10)
	case uint16:
		return strconv.FormatUint(uint64(v), 10)
	case uint32:
		return strconv.FormatUint(uint64(v), 10)
	case uint64:
		return strconv.FormatUint(v, 10)
	case bool:
		return strconv.FormatBool(v)
	case float32:
		return strconv.FormatFloat(float64(v), 'f', -1, 32)
	case float64:
		return strconv.FormatFloat(v, 'f', -1, 64)
	default:
		return ""
	}
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

