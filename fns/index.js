export default {
  'формат_денег': require('date-fns/format'),
  'дней_между_датами': require('date-fns/difference_in_days'),
  'взять_число': require('date-fns/get_date'),
  'добавить_лет': require('date-fns/add_years'),
  'добавить_дней': require('date-fns/add_days'),
  'даты_равны?': require('date-fns/is_equal'),
  'дата_меньше_чем?': require('date-fns/is_before'),
  'дней_в_году': require('date-fns/get_days_in_year'),
  'округлить': require('./round'),
  'ден_формат': require('./currencyFormat'),
  'расчет_ежемесячного_платежа': require('./annuity'),
}
