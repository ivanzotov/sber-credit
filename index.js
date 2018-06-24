const differenceInDays = require('date-fns/difference_in_days');
const getDate = require('date-fns/get_date');
const addYears = require('date-fns/add_years');
const addDays = require('date-fns/add_days');
const isEqual = require('date-fns/is_equal');
const isBefore = require('date-fns/is_before');
const getDaysInYear = require('date-fns/get_days_in_year');

// 1 382 859 сбер предлагает оплатить с 12 марта
// 58 из которых 23 446,48
// и 55-й 22 963,16

// как бы таким должен быть платеж – 23438,288135593220339
// но он почему то вот такой 23 446,48

// 1 464 622,32
// 1 464 518,18

// Данные
const sum = 1100000; // сумма кредита
const years = 5; // количество лет
const percent = 12.5 / 100; // процентная ставка
const startDate = '2018-01-12'; // дата начала
const payments = [
  { date: '2018-02-06', sum: 55000 },
  { date: '2018-02-07', sum: 25000 },
  { date: '2018-02-12', sum: 1763.32 },
]

const round = (num) => Math.round(num * 100) / 100;

const currency = (num) => (new Intl.NumberFormat('ru').format(Math.ceil(num * 100) / 100)).replace(/,/g, ' ').replace(/\./g, ',')

const getPlatezhPerMonth = (sum, percent, periodCount) => {
  const percentPerMonth = percent / 12; // процентов в месяц
  return sum * (percentPerMonth + percentPerMonth / (Math.pow(1 + percentPerMonth, periodCount) - 1))
}

const peri = 59
let platezh = getPlatezhPerMonth(1029778.91, percent, peri);

// Расчет
const endDate = addYears(startDate, years);
const days = differenceInDays(endDate, startDate); // количество дней
const date = getDate(startDate); // день выплат
let vsegoViplacheno = 0; // выплачено всего
let procentovViplacheno = 0; // выплачено процентов
let osnDolgViplacheno = 0; // выплачено осн долга
let osnDolg = sum; // основной долг
let percentNachisleno = 0; // начислено процентов
const periodCount = years * 12;
let kopeek = 0; // копейки

(new Array(days)).fill(1).forEach((_, index) => {
  const currDate = addDays(startDate, index + 1);
  const percentPerDay = percent / getDaysInYear(currDate); // процентов в день
  let payment = payments.find(_payment =>
    isEqual(_payment.date, currDate)
  )

  percentNachisleno = percentNachisleno + osnDolg * percentPerDay;

  if (!payment && getDate(currDate) === date) {
    osnDolgWithPercent = osnDolg + percentNachisleno
    // platezh = 23446.48
    payment = { sum: osnDolgWithPercent < platezh ? osnDolgWithPercent : platezh } // 23446.48 }
  }

  if (payment) {
    vsegoViplacheno = vsegoViplacheno + payment.sum
    procentovViplacheno = procentovViplacheno + percentNachisleno
    osnDolgViplacheno = osnDolgViplacheno + (payment.sum - percentNachisleno)
    osnDolgRounded = round(osnDolg) - round(payment.sum - percentNachisleno);
    osnDolgNotRounded = osnDolg - (payment.sum - percentNachisleno);
    kopeek = kopeek + (osnDolgRounded - osnDolgNotRounded);
    osnDolg = osnDolgRounded
  }

  //if (getDate(currDate) === date || payment) {
    console.log(
      `Дата: ${currDate}, ` +
      (payment ?
        `Платеж: ${payment.sum - percentNachisleno + percentNachisleno}, ` +
        `На проценты: ${currency(percentNachisleno)}, ` +
        `На осн. долг: ${payment ? currency(payment.sum - percentNachisleno) : ''}, `
        : `Долг с процентами: ${currency(osnDolg + percentNachisleno)}, `
      ) +
      `Остаток осн долга: ${currency(osnDolg)}(${osnDolg}), `
    );
  //}

  if (payment) percentNachisleno = 0
})

console.log(`Выплачено всего: ${currency(vsegoViplacheno)}`)
console.log('Платеж: ', currency(platezh));
