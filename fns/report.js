// f - функции
// d - данные
// v - переменные

const f = require('./');

module.exports = (d, f) => {
  const v = {}

  v.отчет = []

  v.дата_окончания = f.добавить_месяцев(d.дата_начала, d.месяцев);
  v.срок_в_днях = f.дней_между_датами(v.дата_окончания, d.дата_начала);
  v.число_даты_списания_средств = f.взять_число(d.дата_начала);

  v.ежемесячный_платеж = f.расчет_ежемесячного_платежа(d.сумма, d.ставка, d.месяцев)
  v.выплачено_всего = 0;
  v.выплачено_процентов = 0;
  v.переплата = 0;
  v.выплачено_осн_долга = 0;
  v.остаток_осн_долга = d.сумма;
  v.процентов_с_даты_платежа = 0;

  for (
    v.день_с_даты_начала = 1;
    v.день_с_даты_начала !== v.срок_в_днях;
    v.день_с_даты_начала++
  ) {
    v.пункт_отчета = {
      '#': v.день_с_даты_начала
    }

    v.дата_расчета = f.добавить_дней(d.дата_начала, v.день_с_даты_начала);
    v.пункт_отчета.дата = v.дата_расчета

    v.число_даты_расчета = f.взять_число(v.дата_расчета);
    v.процентов_в_день = d.ставка / f.дней_в_году(v.дата_расчета) / 100;
    v.списано_средств = 0;
    v.обнулить_проценты_с_даты_платежа = false;

    // ищем досрочные платежи на дату расчета если такие есть
    v.досрочный_платеж_на_дату_расчета =
      d.досрочные_платежи.find(it => f.даты_равны(it.дата, v.дата_расчета));

    v.пункт_отчета.остаток_осн_долга = v.остаток_осн_долга

    // накапливаем проценты с даты последнего платежа / даты начала
    v.процентов_с_даты_платежа =
      v.процентов_с_даты_платежа + (v.остаток_осн_долга * v.процентов_в_день);

    v.пункт_отчета.проценты = v.процентов_с_даты_платежа

    // считаем долг с процентами на дату расчета
    v.долг_с_процентами = v.остаток_осн_долга + v.процентов_с_даты_платежа
    v.пункт_отчета.долг_с_процентами = v.долг_с_процентами

    if (v.число_даты_расчета === v.число_даты_списания_средств) {
      v.пункт_отчета.тип_платежа = 'ежемесячный_платеж'
      v.списано_средств =
        v.долг_с_процентами < v.ежемесячный_платеж ?
          v.долг_с_процентами :
          v.ежемесячный_платеж
    } else if (v.досрочный_платеж_на_дату_расчета) {
      v.пункт_отчета.тип_платежа = 'досрочный_платеж'
      v.списано_средств = v.досрочный_платеж_на_дату_расчета.сумма
    }

    if (v.списано_средств > 0) {
      v.пункт_отчета.списано_средств = v.списано_средств
      v.выплачено_всего = v.выплачено_всего + v.списано_средств
      v.пункт_отчета.выплачено_всего = v.выплачено_всего
      v.выплачено_процентов = v.выплачено_процентов + v.процентов_с_даты_платежа
      v.пункт_отчета.выплачено_процентов = v.выплачено_процентов
      v.остаток_осн_долга_округленный =
        f.округлить(v.остаток_осн_долга) - f.округлить(v.списано_средств - v.процентов_с_даты_платежа)
      v.остаток_осн_долга_полный = v.остаток_осн_долга - (v.списано_средств - v.процентов_с_даты_платежа)
      v.остаток_осн_долга = v.остаток_осн_долга_округленный
      v.обнулить_проценты_с_даты_платежа = true;
    }

    if (v.обнулить_проценты_с_даты_платежа) {
      v.процентов_с_даты_платежа = 0
    }

    v.отчет.push(v.пункт_отчета)
  }

  return v.отчет
}
