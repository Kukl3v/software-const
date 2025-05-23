import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ContentBlock from '../components/ContentBlock';
import PageTitle from '../components/PageTitle';
import { getSalesReportRequest } from '../services/reportService';

export default function Report({ title }) {
  PageTitle(title);
  const [searchParams, setSearchParams] = useSearchParams();
  const [reportData, setReportData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const startParam = searchParams.get('startDate') || '';
    const endParam = searchParams.get('endDate') || '';
    setStartDate(startParam);
    setEndDate(endParam);

    if (startParam && endParam) {
      loadReport(startParam, endParam);
    }
  }, []);

  const loadReport = (start, end) => {
    setLoading(true);
    getSalesReportRequest(start, end)
      .then(data => setReportData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return;

    setSearchParams({ startDate, endDate });
    loadReport(startDate, endDate);
  };

  const Content = (
    <>
      <form className="flex items-center gap-4 mb-6" onSubmit={handleSubmit}>
        <div className="flex items-center gap-4 mb-4">
          <input
            type="date"
            name="start"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 ps-3 p-2.5"
          />
          <span className="text-gray-500">по</span>
          <input
            type="date"
            name="end"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 ps-3 p-2.5"
          />
          <button
            type="submit"
            className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-800 text-gray-800 hover:border-gray-500 hover:text-gray-500 focus:outline-hidden focus:border-gray-500 focus:text-gray-500 disabled:opacity-50 cursor-pointer"
            >
            Показать отчет
            </button>
        </div>
      </form>

      <h2 className="text-xl font-semibold text-center mb-4">
        Отчет по продажам по месяцам за период
      </h2>

      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Период</th>
                    <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Кол-во абонементов</th>
                    <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Доход</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">Загрузка...</td>
                    </tr>
                  ) : reportData.length > 0 ? (
                    reportData.map(row => (
                      <tr key={row.period}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{row.period}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-end">{row.subscriptionCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-end">{row.totalRevenue}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">Нет данных</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return <ContentBlock valueBlock={Content} />;
}
