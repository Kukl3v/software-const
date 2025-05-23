import React, { useEffect, useState, useContext } from 'react';
import ContentBlock from '../components/ContentBlock';
import PageTitle from '../components/PageTitle';
import { getUserSchedule } from '../services/scheduleService';
import { getUserByEmailRequest } from '../services/accountService';
import { AuthContext } from '../AuthContext';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(weekday);
dayjs.extend(isoWeek);

function Schedule(props) {
  PageTitle(props.title);
  const { user: email, loading: authLoading } = useContext(AuthContext);

  const [userId, setUserId] = useState(null);
  const [dateMap, setDateMap] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUserId() {
      if (!email) return;
      try {
        const userObj = await getUserByEmailRequest(email);
        setUserId(userObj.id);
      } catch (err) {
        console.error('Ошибка при получении пользователя по email', err);
      }
    }
    fetchUserId();
  }, [email]);

  const weekStart = dayjs().isoWeekday(1);
  const weekDates = Array.from({ length: 7 }).map((_, idx) => {
    const date = weekStart.add(idx, 'day');
    return { dateStr: date.format('YYYY-MM-DD'), dateObj: date };
  });

  useEffect(() => {
    async function fetchSchedule() {
      setLoading(true);
      try {
        const map = await getUserSchedule(userId);
        const dm = {};
        Object.values(map).forEach((sessions) => {
          sessions.forEach((session) => {
            const ds = dayjs(session.startTime).format('YYYY-MM-DD');
            dm[ds] = dm[ds] || [];
            dm[ds].push(session);
          });
        });
        setDateMap(dm);
      } catch (err) {
        console.error('Ошибка при загрузке расписания', err);
      } finally {
        setLoading(false);
      }
    }
    if (userId) fetchSchedule();
  }, [userId]);

  const todayStr = dayjs().format('YYYY-MM-DD');
  const daysShort = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];

  if (authLoading || !userId) {
    return <p className="p-6">Загрузка...</p>;
  }

  return (
    <ContentBlock
      valueBlock={
        <div className="h-screen p-6 flex items-center justify-center">
          <div className="flex bg-white shadow-md rounded-lg overflow-x-auto py-4 px-2 space-x-2">
            {weekDates.map(({ dateStr, dateObj }) => {
              const isToday = dateStr === todayStr;
              const sessions = dateMap[dateStr] || [];
              return (
                <div
                  key={dateStr}
                  className={`flex flex-col items-center mx-1 cursor-pointer w-20 transition-all duration-300 rounded-lg ${
                    isToday ? 'bg-purple-300 shadow-lg' : 'hover:bg-purple-100 hover:shadow-lg'
                  }`}
                >
                  <div className="relative flex flex-col items-center px-2 py-3">
                    {isToday && (
                      <span className="flex h-3 w-3 absolute -top-1 -right-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500" />
                      </span>
                    )}
                    <p className={`${isToday ? 'text-purple-900' : 'text-gray-900'} text-sm`}>{daysShort[dateObj.day()]}</p>
                    <p className={`${isToday ? 'mt-1 font-bold text-purple-900' : 'mt-1 text-gray-900'}`}>{dateObj.date()}</p>
                  </div>
                  <div className="w-full px-1 pb-2 flex flex-col items-start">
                    {loading ? (
                      <p className="text-xs text-gray-500">Загрузка...</p>
                    ) : sessions.length > 0 ? (
                      sessions.map((session) => (
                        <div key={session.id} className="text-xs text-gray-700 border border-gray-200 rounded p-1 mb-1 w-full">
                          <p className="font-semibold truncate">{session.title}</p>
                          <p className="truncate">{dayjs(session.startTime).format('HH:mm')} - {dayjs(session.endTime).format('HH:mm')}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">Нет сессий</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      }
    />
  );
}

export default Schedule;