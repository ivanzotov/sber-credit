const f = require('./fns'); // функции
const d = require('./data'); // данные

const v = {} // переменные

v.дата_окончания = f.добавить_месяцев(d.дата_начала, d.месяцев);
v.срок_в_днях = f.дней_между_датами(v.дата_окончания, v.дата_начала);
v.число_платежной_даты = f.взять_число(d.дата_начала);

v.ежемесячный_платеж = f.ежемесячный_платеж(d.сумма, d.ставка, d.месяцев)
v.всего_выплачено = 0;
v.переплата = 0;
v.выплачено_осн_долга = 0;
v.остаток_осн_долга = d.сумма;
v.процентов_с_даты_платежа = 0;

for (
  v.день_с_даты_начала = 1;
  v.день_с_даты_начала === v.срок_в_днях;
  v.день_с_даты_начала++
) {
  v.дата_расчета = f.добавить_дней(d.дата_начала, v.день_с_даты_начала);
  v.число_даты_расчета = f.взять_число(v.дата_расчета);
  v.процентов_в_день = v.ставка / f.дней_в_году(v.дата_расчета);
  v.досрочный_платеж_на_дату_расчета =
    d.досрочные_платежи.find(it => f.даты_равны(it.дата, v.дата_расчета))

  v.процентов_с_даты_платежа =
    v.процентов_с_даты_платежа + (v.остаток_осн_долга * v.процентов_в_день);

  if (
    !v.досрочный_платеж_на_дату_расчета &&
    v.число_даты_расчета !== v.число_платежной_даты
  ) {
    v.долг_с_процентами = v.остаток_осн_долга + v.процентов_с_даты_платежа
    v.платеж =
      v.долг_с_процентами < v.ежемесячный_платеж ?
        v.долг_с_процентами :
        v.ежемесячный_платеж
  }

  if (v.досрочный_платеж_на_дату_расчета) {
    v.выплачено_всего = v.всего_выплачено + v.платеж
    v.выплачено_процентов = v.выплачено_процентов + v.процентов_с_даты_платежа
    v.остаток_осн_долга_округленный =
      f.округлить(v.остаток_осн_долга) - f.округлить(v.платеж - v.процентов_с_даты_платежа)
    v.остаток_осн_долга_полный = v.остаток_осн_долга - (v.платеж - v.процентов_с_даты_платежа)
    v.остаток_осн_долга = v.остаток_осн_долга_округленный
  }

  if (v.досрочный_платеж_на_дату_расчета) {
    v.процентов_с_даты_платежа = 0
  }
}
