package utils

import (
	"crypto/sha512"
	"encoding/hex"
)

func HashSHA512(text string) string {
	sum := sha512.Sum512([]byte(text))
	return hex.EncodeToString(sum[:])
}

func CompareHashSHA512(plain, hashed string) bool {
	return HashSHA512(plain) == hashed
}