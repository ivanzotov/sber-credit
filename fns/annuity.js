const round = require('./round');

// расчет ежемесячного платежа
// sum – сумма кредита
// percent - ставка (например 11.4)
// count – количество месяцев
module.exports = (sum, percent, count) => {
  const ppm = percent / 12 / 100; // процентов в месяц
  return round(sum * (ppm + ppm / (Math.pow(1 + ppm, count) - 1)));
}
