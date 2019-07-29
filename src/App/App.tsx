import React, {useEffect, useState} from 'react';
import styles from './App.module.sass';
import Calendar, {CalendarEvent} from '../Calendar/Calendar';
import axios from 'axios';
import y from 'js-yaml';

const App: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    axios.get('/db/events.yml').then((response) => {
      console.log(response.data);
      const d = y.safeLoad<CalendarEvent[]>(response.data);
      console.log('d');
      console.log(d);
      setEvents(d);
    });
  }, []);
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.h1}>课程表</h1>
      <Calendar events={events} value={date} onChange={setDate}/>
    </div>
  );
};

export default App;
