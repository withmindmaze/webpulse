'use client'
import React, { useEffect, useState } from 'react';
import { JsonView, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';

const Report = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const reportData = localStorage.getItem('reportData');
    if (reportData) {
      try {
        const parsedData = JSON.parse(reportData);
        setData(parsedData);
      } catch (e) {
        alert('Invalid JSON data');
        console.error(e);
        setData(null);
      }
    }
  }, []);

  const shouldExpandNode = (level: number, value: any, field: any) => level < 2;

  return (
    <div className="flex justify-center items-center w-full">
      <div className="w-full max-w-4xl p-4">
        <h1 className="text-4xl font-bold text-center mb-6">Report</h1>
        {data && (
          <>
            {/*@ts-ignore*/}
            <h1 className="text-2xl text-center mb-6">Accessibility Score: {data?.categories?.accessibility?.score}</h1>
            <JsonView
              data={data}
              shouldExpandNode={shouldExpandNode}
              style={defaultStyles}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Report;
