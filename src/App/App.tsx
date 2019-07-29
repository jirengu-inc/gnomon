import React, {useEffect, useState} from 'react';
import styles from './App.module.sass';
import Calendar, {CalendarEvent} from '../Calendar/Calendar';
import axios from 'axios';
import y from 'js-yaml';
import EventList from '../EventList/EventList';
import Date2 from '../lib/Date2';
import queryString from 'query-string';


const App: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [date, setDate] = useState(new Date());
  const selectedEvents = () => {
    return events.filter((e) =>
      new Date2(e.start).isSameDayAs(date) ||
      new Date2(e.end).isSameDayAs(date)
    );
  };
  useEffect(() => {
    const query = queryString.parse(window.location.search);
    if (!query.eventsUrl) {return;}
    axios.get(query.eventsUrl.toString()).then((response) => {
      const data = y.safeLoad<CalendarEvent[]>(response.data);
      setEvents(data);
    });
  }, []);
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.h1}>课程表</h1>
      <Calendar events={events} value={date} onChange={setDate}/>
      <EventList title={`${new Date2(date).toString('M月d日')}的安排`} events={selectedEvents()}/>
    </div>
  );
};

export default App;
