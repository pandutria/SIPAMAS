package utils

import "strings"

func ToString(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}

func NilIfEmpty(s string) *string {
	if strings.TrimSpace(s) == "" {
		return nil
	}
	return &s
}
