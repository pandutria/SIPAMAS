package dtos

type CreateScheduleHeaderRequest struct {
	ScheduleGroupId *uint  `form:"schedule_group_id"`
	RabId           uint   `form:"rab_id"`
	AlasanText      string `form:"alasan_text"`
	TanggalMulai    string `form:"tanggal_mulai"`
	TanggalAkhir    string `form:"tanggal_akhir"`
}
