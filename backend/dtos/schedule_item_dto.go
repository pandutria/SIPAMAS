package dtos

type CreateScheduleItemRequest struct {
	ScheduleHeaderId uint   `form:"schedule_header_id"`
	Nomor            string `form:"nomor"`
	Keterangan       string `form:"keterangan"`
	Jumlah           string `form:"jumlah"`
	Bobot            string `form:"bobot"`
}