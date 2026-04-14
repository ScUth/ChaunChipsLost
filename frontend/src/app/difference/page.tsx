"use client";
import { useEffect, useState } from "react";
import { SideBar } from "../../../components/sidebar";
import { SideImage } from "../../../components/sideimage";
import {
  formatTime,
  calculateLivability,
  calculateFormatCO
} from "../../../components/calculations";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export default function Analysis() {
  const [data, setData] = useState(null);
  const [datas, setDatas] = useState(null);
  const [dataAQI, setDataAQI] = useState(null);
  const [datasAQI, setDatasAQI] = useState(null);
  const [dataWT, setDataWT] = useState(null);
  const [datasWT, setdatasWT] = useState(null);
  const [number, setNumber] = useState(6);
  const [loading, setLoading] = useState(true);

  let asuna =
    "../../asuna_yuuki_render_1_by_lq_luck_by_luki0127_degqyxz-fullview.png" as const;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiBaseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.57:8000";
        const url = `${apiBaseUrl}/sensor/latest/`;
        const urls = `${apiBaseUrl}/sensor/latest/${number}`;

        // const response = await fetch(url);
        const [urlResponse, urlsResponse] = await Promise.all([
          fetch(url),
          fetch(urls),
        ]);
        // console.log("Response status:", response.status, response.statusText);

        if (!urlResponse.ok) {
          throw new Error(
            `Single Sensor ${urlResponse.status}: ${await urlResponse.text()}`,
          );
        }
        if (!urlsResponse.ok) {
          throw new Error(
            `Multi Sensor ${urlsResponse.status}: ${await urlsResponse.text()}`,
          );
        }

        const result = await urlResponse.json();
        const results = await urlsResponse.json();
        // console.log("SUCCESS! Data received:", result); // ← Most important
        setData(result);
        setDatas(results);
      } catch (error: any) {
        console.error("Fetch failed:", error.message);
        // setData({ error: error.message });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [number]);

  useEffect(() => {
    const fetchDataAQI = async () => {
      try {
        const apiBaseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.57:8000";
        const urlA = `${apiBaseUrl}/api/aqicn/latest/`;
        const urlAN = `${apiBaseUrl}/api/aqicn/latest/${number}`;

        // const response = await fetch(url);
        const [urlAResponse, urlANResponse] = await Promise.all([
          fetch(urlA),
          fetch(urlAN),
        ]);
        // console.log("Response status:", response.status, response.statusText);

        if (!urlAResponse.ok) {
          throw new Error(
            `Single Sensor ${urlAResponse.status}: ${await urlAResponse.text()}`,
          );
        }
        if (!urlANResponse.ok) {
          throw new Error(
            `Multi Sensor ${urlANResponse.status}: ${await urlANResponse.text()}`,
          );
        }

        const resultA = await urlAResponse.json();
        const resultB = await urlANResponse.json();
        // console.log("SUCCESS! Data received:", result); // ← Most important
        setDataAQI(resultA);
        setDatasAQI(resultB);
      } catch (error: any) {
        console.error("Fetch failed:", error.message);
        // setData({ error: error.message });
      } finally {
        setLoading(false);
      }
    };

    fetchDataAQI();
  }, [number]);

  useEffect(() => {
    const fetchDataWT = async () => {
      try {
        const apiBaseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.57:8000";
        const urlW = `${apiBaseUrl}/api/weather/latest/`;
        const urlWN = `${apiBaseUrl}/api/weather/latest/${number}`;

        // const response = await fetch(url);
        const [urlWResponse, urlWNResponse] = await Promise.all([
          fetch(urlW),
          fetch(urlWN),
        ]);
        // console.log("Response status:", response.status, response.statusText);

        if (!urlWResponse.ok) {
          throw new Error(
            `Single Sensor ${urlWResponse.status}: ${await urlWResponse.text()}`,
          );
        }
        if (!urlWNResponse.ok) {
          throw new Error(
            `Multi Sensor ${urlWNResponse.status}: ${await urlWNResponse.text()}`,
          );
        }

        const resultW = await urlWResponse.json();
        const resultWN = await urlWNResponse.json();
        // console.log("SUCCESS! Data received:", result); // ← Most important
        setDataWT(resultW);
        setdatasWT(resultWN);
      } catch (error: any) {
        console.error("Fetch failed:", error.message);
        // setData({ error: error.message });
      } finally {
        setLoading(false);
      }
    };

    fetchDataWT();
  }, [number]);

  const livability = calculateLivability(data);
  const calculateLivabilityFor2ndDataSource = () => {
    if (!dataAQI || !dataWT) return null;
    return (
      10 -
      dataAQI.pm2_5 / 40 -
      dataAQI.pm10 / 50 -
      dataAQI.co / 10 -
      Math.abs((dataWT.temp - 26) / 5) -
      Math.abs((dataWT.humidity - 55) / 10)
    );
  };
  const OutSourceAPILivability = calculateLivabilityFor2ndDataSource();
  const formatCOIN = calculateFormatCO(data);
  const formatCOut = calculateFormatCO(dataAQI);

  const [selectedAttribute, setSelectedAttribute] = useState("temp");

  const chartData = datas ? [...datas].reverse().map((d: any, index: number) => {
    // Compute the original index because we reversed the indoor data array
    const origIndex = datas.length - 1 - index;
    const aqi = datasAQI ? datasAQI[origIndex] : null;
    const wt = datasWT ? datasWT[origIndex] : null;
    return {
      ts: d.ts,
      indoor_temp: d.temp,
      outdoor_temp: wt ? wt.temp : null,
      indoor_humidity: d.humidity,
      outdoor_humidity: wt ? wt.humidity : null,
      indoor_pm2_5: d.pm2_5,
      outdoor_pm2_5: aqi ? aqi.pm2_5 : null,
      indoor_pm10: d.pm10,
      outdoor_pm10: aqi ? aqi.pm10 : null,
      indoor_co: d.co,
      outdoor_co: aqi ? aqi.co : null,
    };
  }) : [];

  const newDayMarks: {ts: string, dayStr: string}[] = [];
  if (chartData.length > 0) {
    let currentDay = new Date(chartData[0].ts).toLocaleDateString("en-GB", { timeZone: "UTC" });
    for (let i = 1; i < chartData.length; i++) {
      const day = new Date(chartData[i].ts).toLocaleDateString("en-GB", { timeZone: "UTC" });
      if (day !== currentDay) {
        newDayMarks.push({ ts: chartData[i].ts, dayStr: day });
        currentDay = day;
      }
    }
  }
  // test api //
  // <div className="mt-4 p-4 bg-black/50 text-white rounded">
  //   <p>Debug Info:</p>
  //   <p>→ Loading: {loading ? 'Yes' : 'No'}</p>
  //   <p>→ Data exists: {dataAQI ? 'Yes' : 'No'}</p>
  //   {dataAQI && (
  //     <pre className="mt-2 text-xs overflow-auto max-h-96 bg-black/70 p-2">
  //       {JSON.stringify(dataAQI, null, 2)}
  //     </pre>
  //   )}
  // </div>

  return (
    <div className="min-h-screen w-full bg-[url(https://images7.alphacoders.com/676/thumb-1920-676949.jpg)] bg-cover bg-center bg-no-repeat bg-fixed flex overflow-hidden">
      {/* Sidebar - 15% on large screens, hidden by default on mobile */}
      <SideBar />
      <div className="flex flex-1 min-w-0">
        <main className="flex-[55%] sm:ml-[15%] overflow-auto p-4 sm:mr-[30%] sm:my-[2.5%]">
          <div className="flex justify-between bg-black/50 ">
            <p className="p-4 text-3xl">Bangkok, Thailand</p>
            <p className="p-4 text-3xl">
              {data ? formatTime(data.ts) : "XX:XX"}
            </p>
          </div>
          <div className="flex justify-between mt-1 w-full">
            <div className="w-1/2 bg-black/70 p-4">
              <p className="text-4xl text-center">Indoor (IOT)</p>
              <p className="text-xl mt-4">Livability Index</p>
              <p className="text-6xl pb-4">
                {livability !== null ? livability.toFixed(2) : "XX.XX"}/10
              </p>
              <div className="flex justify-between border-t py-2">
                <p className="text-left">Temperature</p>
                <p className="text-right">{data ? data.temp : "XX"}°C</p>
              </div>
              <div className="flex justify-between border-t py-2">
                <p className="text-left">PM2.5</p>
                <p className="text-right">{data ? data.pm2_5 : "XX.XX"} μg/m³</p>
              </div>
              <div className="flex justify-between border-t py-2">
                <p className="text-left">PM10</p>
                <p className="text-right">{data ? data.pm10 : "XX.XX"} μg/m³</p>
              </div>
              <div className="flex justify-between border-t py-2">
                <p className="text-left">Humidity</p>
                <p className="text-right">{data ? data.humidity : "XXX"}%</p>
              </div>
              <div className="flex justify-between border-t py-2">
                <p className="text-left">CO</p>
                <p className="text-right">{formatCOIN !== null ? formatCOIN.toFixed(2) : "XXX.XX"}</p>
              </div>
            </div>
            <div className="w-1/2 bg-black/70 p-4">
              <p className="text-4xl text-center">Outdoor (API)</p>
              <p className="text-xl mt-4">Livability Index</p>
              <p className="text-6xl pb-4">
                {OutSourceAPILivability !== null ? OutSourceAPILivability.toFixed(2) : "XX.XX"}/10
              </p>
              <div className="flex justify-between border-t py-2">
                <div className="flex justify-between gap-3">
                  <p className="text-left">Temperature</p>
                  <p className="text-white/50 italic">(OpenWeather)</p>
                </div>
                <p className="text-right">{dataWT ? dataWT.temp : "XX"}°C</p>
              </div>
              <div className="flex justify-between border-t py-2">
                <div className="flex justify-between gap-3">
                  <p className="text-left">PM2.5</p>
                  <p className="text-white/50 italic">(AQICN)</p>
                </div>
                <p className="text-right">{dataAQI ? dataAQI.pm2_5 : "XX.XX"} μg/m³</p>
              </div>
              <div className="flex justify-between border-t py-2">
                <div className="flex justify-between gap-3">
                  <p className="text-left">PM10</p>
                  <p className="text-white/50 italic">(AQICN)</p>
                </div>
                <p className="text-right">{dataAQI ? dataAQI.pm10 : "XX.XX"} μg/m³</p>
              </div>
              <div className="flex justify-between border-t py-2">
                <div className="flex justify-between gap-3">
                  <p className="text-left">Humidity</p>
                  <p className="text-white/50 italic">(OpenWeather)</p>
                </div>
                <p className="text-right">{dataWT ? dataWT.humidity : "XXX"}%</p>
              </div>
              <div className="flex justify-between border-t py-2">
                <div className="flex justify-between gap-3">
                  <p className="text-left">CO</p>
                  <p className="text-white/50 italic">(AQICN)</p>
                </div>
                <p className="text-right">{dataAQI ? dataAQI.co : "XX.XX"}</p>
              </div>
            </div>
            {/* end separate */}
          </div>
          
          <div className="mt-1 bg-black/60 p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <h2 className="text-2xl mb-2 sm:mb-0">
                Trend Analysis
              </h2>
              <div className="flex justify-between gap-3">
                <select
                  value={number}
                  onChange={(e: any) => setNumber(Number(e.target.value))}
                  className="bg-gray-800 text-white p-2 rounded border border-gray-600 outline-none"
                >
                  <option value={6}>6 hours</option>
                  <option value={12}>12 hours</option>
                  <option value={24}>1 day</option>
                  <option value={72}>3 day</option>
                  <option value={168}>7 day</option>
                </select>
                <select
                  value={selectedAttribute}
                  onChange={(e) => setSelectedAttribute(e.target.value)}
                  className="bg-gray-800 text-white p-2 rounded border border-gray-600 outline-none"
                >
                  <option value="temp">Temperature (°C)</option>
                  <option value="humidity">Humidity (%)</option>
                  <option value="pm2_5">PM2.5 (μg/m³)</option>
                  <option value="pm10">PM10 (μg/m³)</option>
                  <option value="co">CO</option>
                </select>
              </div>
            </div>

            <div className="h-64 w-full">
              {datas && datas.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis
                      dataKey="ts"
                      tickFormatter={(tick) => formatTime(tick)}
                      stroke="#888"
                    />
                    <YAxis stroke="#888" />
                    <Tooltip
                      labelFormatter={(label) => {
                        const date = new Date(label as string);
                        return date.toLocaleDateString("en-GB", { timeZone: "UTC" }) + " " + formatTime(label as string);
                      }}
                      contentStyle={{
                        backgroundColor: "#222",
                        borderColor: "#444",
                      }}
                    />
                    <Legend />
                    {newDayMarks.map((mark, index) => (
                      <ReferenceLine
                        key={index}
                        x={mark.ts}
                        stroke="#ff7300"
                        strokeDasharray="3 3"
                        label={{
                          position: "insideTopLeft",
                          value: mark.dayStr,
                          fill: "#ff7300",
                          fontSize: 12,
                        }}
                      />
                    ))}
                    <Line
                      type="monotone"
                      name={`Indoor ${selectedAttribute === "temp" ? "Temperature" : selectedAttribute === "humidity" ? "Humidity" : selectedAttribute === "pm2_5" ? "PM2.5" : selectedAttribute === "pm10" ? "PM10" : "CO"}`}
                      dataKey={`indoor_${selectedAttribute}`}
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      name={`Outdoor ${selectedAttribute === "temp" ? "Temperature" : selectedAttribute === "humidity" ? "Humidity" : selectedAttribute === "pm2_5" ? "PM2.5" : selectedAttribute === "pm10" ? "PM10" : "CO"}`}
                      dataKey={`outdoor_${selectedAttribute}`}
                      stroke="#82ca9d"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  {loading ? "Loading chart data..." : "No data available"}
                </div>
              )}
            </div>
          </div>
        </main>
        <SideImage imagePath={asuna} />
      </div>
    </div>
  );
}
