module.exports = {
  'формат_даты': require('date-fns/format'),
  'дней_между_датами': require('date-fns/difference_in_days'),
  'взять_число': require('date-fns/get_date'),
  'добавить_месяцев': require('date-fns/add_months'),
  'добавить_дней': require('date-fns/add_days'),
  'даты_равны?': require('date-fns/is_equal'),
  'дней_в_году': require('date-fns/get_days_in_year'),
  'округлить': require('./round'),
  'денежный_формат': require('./currencyFormat'),
  'расчет_ежемесячного_платежа': require('./annuity'),
}
