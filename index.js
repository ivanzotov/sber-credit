const differenceInDays = require('date-fns/difference_in_days');
const getDate = require('date-fns/get_date');
const addYears = require('date-fns/add_years');
const addDays = require('date-fns/add_days');
const isEqual = require('date-fns/is_equal');
const isBefore = require('date-fns/is_before');
const getDaysInYear = require('date-fns/get_days_in_year');

// Данные
const sum = 1100000; // сумма кредита
const years = 5; // количество лет
const percent = 12.5 / 100; // процентная ставка
const startDate = '2018-01-12'; // дата начала
const payments = [
  { date: '2018-02-06', sum: 55000 },
  { date: '2018-02-07', sum: 25000 },
  { date: '2018-02-12', sum: 1763.32 },
  { date: '2018-03-12', sum: 23446.48 },
  { date: '2018-04-12', sum: 23446.48 },
  { date: '2018-05-12', sum: 23446.48 },
  { date: '2018-06-12', sum: 23446.48 },
]

const round = (num) => Math.round(num * 100) / 100

// Расчет
const endDate = addYears(startDate, years);
const days = differenceInDays(endDate, startDate); // количество дней
const date = getDate(startDate); // день выплат
let vsegoViplacheno = 0; // выплачено всего
let procentovViplacheno = 0; // выплачено процентов
let osnDolgViplacheno = 0; // выплачено осн долга
let osnDolg = sum; // основной долг
let percentNachisleno = 0; // начислено процентов
const percentPerDay = percent / getDaysInYear(startDate); // процентов в день

(new Array(days)).fill(1).forEach((_, index) => {
  const currDate = addDays(startDate, index + 1);
  const payment = payments.find(_payment =>
    isEqual(_payment.date, currDate)
  )

  percentNachisleno = percentNachisleno + (osnDolg * percentPerDay);

  if (payment) {
    vsegoViplacheno = vsegoViplacheno + payment.sum
    procentovViplacheno = procentovViplacheno + percentNachisleno
    osnDolgViplacheno = osnDolgViplacheno + (payment.sum - percentNachisleno)
    osnDolg = osnDolg - (payment.sum - percentNachisleno)
    percentNachisleno = 0
  }

  if (isEqual(currDate, '2018-05-14')) {
    console.log(
      `День: ${index + 1}, ` +
      `Дата: ${currDate}, \n` +
      `Основной долг: ${round(osnDolg)}, ` +
      `Долг с процентами: ${round(osnDolg + percentNachisleno)}, ` +
      `Выплачено процентов всего: ${round(procentovViplacheno)}, ` +
      `Выплачено осн. долга всего: ${round(osnDolgViplacheno)}, ` +
      `Выплачено всего: ${round(vsegoViplacheno)}, `
    );
  }
})
