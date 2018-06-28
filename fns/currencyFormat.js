// форматирование в денежный формат
// Пример: 1500.50 -> 1 500,50
export default (num) => (
  new Intl.NumberFormat('ru').format(
    Math.round(num * 100) / 100
  )
).replace(/,/g, ' ').replace(/\./g, ',') + ' ₽'
