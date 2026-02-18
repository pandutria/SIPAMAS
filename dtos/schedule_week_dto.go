package dtos

type CreateScheduleWeek struct {
	ScheduleItemId uint   `form:"schedule_item_id"`
	MingguNomor    int    `form:"minggu_nomor"`
	Nilai          string `form:"nilai"`
}
