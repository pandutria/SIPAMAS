const startYear = 2015
const currentYear = new Date().getFullYear()

export const TahunData = Array.from(
  { length: currentYear - startYear + 1 },
  (_, i) => ({
    id: i + 1,
    text: startYear + i
  })
)
