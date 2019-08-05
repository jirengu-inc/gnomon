import * as React from 'react';
import {CalendarEvent} from '../Calendar/Calendar';
import styles from './EventList.module.sass';
import Date2 from '../lib/Date2';
import {ReactChild} from 'react';

interface Props {
  title: ReactChild;
  events: CalendarEvent[]
}

const EventList: React.FC<Props> = ({events, title}) => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.header}>{title}</h2>
      {events.length === 0 ?
        <div className={styles.empty}>没有日程</div> :
        <ol className={styles.events}>
          {events.map(e => <li key={e.id} className={styles.event}>
            <div className={styles.name}>
              {e.name}
            </div>
            {e.urls && <div className={styles.url}>
              {e.urls.map(item => item.name)}
            </div>}
            <div className={styles.details}>
              <span className={styles.creator}>
                {e.creator}
              </span>
              <span className={styles.time}>
                {[e.start, e.end]
                  .filter(Boolean)
                  .map(str => new Date2(str).toString('HH:mm'))
                  .join(' - ')}
              </span>
            </div>
          </li>)}
        </ol>
      }
    </div>
  );
};

export default EventList;
