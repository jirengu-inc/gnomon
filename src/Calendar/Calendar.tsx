import * as React from 'react';
import {useState} from 'react';
import Date2 from '../lib/Date2';
import {range} from 'ramda';
import styles from './calendar.module.sass';
import cs from 'classnames';

type CalendarEventTime = string | Date;

export interface CalendarEvent {
  name: string;
  description: string;
  creator: string;
  url: string;
  startAt: CalendarEventTime;
  endAt: CalendarEventTime;
  allDay: true;
}

interface Props {
  events: CalendarEvent[];
  firstDayOfWeek?: 1 | 2 | 3 | 4 | 5 | 6 | 0;
}

const weekdayNames = ['日', '一', '二', '三', '四', '五', '六'];

const Calendar: React.FC<Props> = ({firstDayOfWeek = 1}) => {
  const [currentTime, setCurrentTime] = useState(new Date2());
  const firstDayOfCurrentMonth = currentTime.day(1);
  const weekday = firstDayOfCurrentMonth.weekday();
  const firstDayOfCurrentView = firstDayOfCurrentMonth.day(
    firstDayOfCurrentMonth.day() - (weekday - firstDayOfWeek));
  const makeCell = (date: Date2) => {
    const extraClass =
      date.isSameDayAs(new Date()) ? styles.today :
        date.isSameMonthAs(currentTime) ? styles.currentMonth :
          date.isLaterMonthThan(currentTime) ? styles.laterMonth :
            date.isFormerMonthThan(currentTime) ? styles.formerMonth : null;
    return (
      <div className={cs(styles.cell, extraClass)}>
        {date.toString('d')}
      </div>
    );
  };
  const viewNextMonth = () => {
    setCurrentTime(currentTime.nextMonth);
  };
  const viewPreviousMonth = () => {
    setCurrentTime(currentTime.previousMonth);
  };
  const viewToday = () => {
    setCurrentTime(new Date2());
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        {currentTime.toString('yyyy 年 M 月')}
      </div>
      <div className={styles.weekdays}>
        {
          range(firstDayOfWeek, firstDayOfWeek + 7)
            .map(i => weekdayNames[i % 7])
            .map(t => <div className={styles.cell}>{t}</div>)
        }
      </div>
      <div className={styles.days}>
        {range(0, 42)
          .map(i => firstDayOfCurrentView.add(i, 'days'))
          .map(d => makeCell(d))
        }
      </div>
      <footer className={styles.footer}>
        <div>
          <button onClick={viewToday}>今天</button>
        </div>
        <div>
          <button onClick={viewPreviousMonth}>上个月</button>
          <button onClick={viewNextMonth}>下个月</button>
        </div>
      </footer>
    </div>
  );
};


export default Calendar;