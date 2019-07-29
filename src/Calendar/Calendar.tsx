import * as React from 'react';
import {useState} from 'react';
import Date2 from '../lib/Date2';
import {range} from 'ramda';
import styles from './Calendar.module.sass';
import cs from 'classnames';

type CalendarEventTime = string | Date;

export interface CalendarEvent {
  id: string;
  name: string;
  description: string;
  creator: string;
  url: string;
  start: CalendarEventTime;
  end: CalendarEventTime;
  allDay: true;
}

interface Props {
  events: CalendarEvent[];
  firstDayOfWeek?: 1 | 2 | 3 | 4 | 5 | 6 | 0;
  value?: Date
  onChange?: (d: Date) => void
}

const weekdayNames = ['日', '一', '二', '三', '四', '五', '六'];

const Calendar: React.FC<Props> = ({firstDayOfWeek = 1, events, value, onChange}) => {
  const [currentTime, setCurrentTime] = useState(new Date2(value));
  const firstDayOfCurrentMonth = currentTime.day(1);
  const weekday = firstDayOfCurrentMonth.weekday();
  const firstDayOfCurrentView = firstDayOfCurrentMonth.day(
    firstDayOfCurrentMonth.day() - (weekday - firstDayOfWeek));
  const eventsHappenedOn = (date: Date2) => {
    return events.filter((e) =>
      new Date2(e.start).isSameDayAs(date) ||
      new Date2(e.end).isSameDayAs(date)
    );
  };
  const onClickCell = (date: Date2) => {
    onChange && onChange(date.toDate());
  };

  const makeCell = (date: Date2) => {
    const extraClass =
      date.isSameDayAs(new Date()) ? styles.today :
        date.isSameMonthAs(currentTime) ? styles.currentMonth :
          date.isLaterMonthThan(currentTime) ? styles.laterMonth :
            date.isFormerMonthThan(currentTime) ? styles.formerMonth : null;
    const selectedClass = value && date.isSameDayAs(value) && styles.selected;
    const eventsOnToday = eventsHappenedOn(date);
    return (
      <div className={cs(styles.cell, extraClass, selectedClass)}
           key={date.valueOf()}
           onClick={() => onClickCell(date)}>
        {date.toString('d')}
        {eventsOnToday.length > 0 &&
        <ol className={styles.events}>{
          eventsOnToday.map(e =>
            <li className={styles.event} key={e.id}/>
          )}</ol>}
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
            .map(t => <div className={styles.cell} key={t}>{t}</div>)
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