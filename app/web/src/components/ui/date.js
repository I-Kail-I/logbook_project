export default function getInfoDate() {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  const today = now.getDate()
  const currentDayOfTheWeek = now.getDay()

  const currentDay = (e) => {
    if (currentDayOfTheWeek === 1) {
      return "Senin"
    }
    if (currentDayOfTheWeek === 2) {
      return "Selasa"
    }
    if (currentDayOfTheWeek === 3) {
      return "Rabu"
    }
    if (currentDayOfTheWeek === 4) {
      return "Kamis"
    }
    if (currentDayOfTheWeek === 5) {
      return "Jumat"
    }
    if (currentDayOfTheWeek === 6) {
      return "Sabtu"
    }
    if (currentDayOfTheWeek) {
      return "Minggu"
    }
  }

  const fullDate = `${currentDay()} ${today}/${currentMonth}/${currentYear}`

  return { currentYear, currentMonth, today, fullDate }
}
