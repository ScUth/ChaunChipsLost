"use client";
import { useEffect, useState } from "react";
import { SideBar } from "../../components/sidebar";
import { SideImage } from "../../components/sideimage";
import {
  calculateLivability,
  calculateFormatCO,
  formatTime,
} from "../../components/calculations";
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
  const [number, setNumber] = useState(6);
  const [loading, setLoading] = useState(true);

  let rei =
    "../../anime-anime-girls-rebuild-of-evangelion-neon-genesis-evangelion-super-robot-taisen-hd-wallpaper-7ef4bdf8f94e5212864f85d6df43db09.png" as const;

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
  // console.log(
  //   "Analysis component body executed - this should appear in browser console",
  // );

  const [selectedAttribute, setSelectedAttribute] = useState("temp");

  const livability = calculateLivability(data);
  const formatCO = calculateFormatCO(data);

  const chartData = datas ? [...datas].reverse() : [];
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

  return (
    <div className="min-h-screen w-full bg-[url(https://gizmodo.com/app/uploads/2021/09/95299b3d1b809192a332ad2c708f0599.jpg)] bg-cover bg-center bg-no-repeat bg-fixed flex overflow-hidden">
      {/* 15% */}
      <SideBar />

      {/* Main container that holds main + right section */}
      <div className="flex flex-1 min-w-0">
        {/* ← Important: flex-1 + min-w-0 */}
        {/* 55% */}
        <main className="flex-[55%] sm:ml-[15%] overflow-auto p-4 sm:mr-[30%] sm:my-[2.5%]">
          <div className="flex justify-between bg-white/50 dark:bg-black/50 ">
            <p className="p-4 text-3xl">
              Thung Khru, Bangkok 10140, Thailand (Indoor)
            </p>
            <p className="p-4 text-3xl">
              {data ? formatTime(data.ts) : "XX:XX"}
            </p>
          </div>
          <div className="bg-white/50 dark:bg-black/50 mt-1">
            <div className="flex justify-between pt-4 pr-4 pl-4">
              <p className="">Temperature</p>
              <p className="">Livability Index</p>
            </div>
            <div className="flex justify-between pl-4 pr-4 text-7xl">
              <p>{data ? data.temp : "XX"}°C</p>
              <p>{livability !== null ? livability.toFixed(2) : "XX.XX"}/10</p>
            </div>
            <div className="flex justify-between pl-4 pr-4 pt-8">
              <div className="flex-1 min-w-[200px] pr-6">
                <div className="flex justify-between border-t py-2">
                  <p className="text-left">PM2.5</p>
                  <p className="text-right">
                    {data ? data.pm2_5 : "XXX.XX"} μg/m³
                  </p>
                </div>
                <div className="flex justify-between border-t py-2">
                  <p className="text-left">Humidity</p>
                  <p className="text-right">{data ? data.humidity : "XX"}%</p>
                </div>
              </div>
              <div className="flex-1 min-w-[200px]">
                <div className="flex justify-between border-t py-2">
                  <p className="text-left">PM10</p>
                  <p className="text-right">
                    {data ? data.pm10 : "XXX.XX"} μg/m³
                  </p>
                </div>
                <div className="flex justify-between border-t py-2">
                  <p className="text-left">CO</p>
                  <p className="text-right">
                    {formatCO !== null ? formatCO.toFixed(2) : "XXX.XX"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-1 bg-white/50 dark:bg-black/60 p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <h2 className="text-2xl mb-2 sm:mb-0">
                Trend Analysis
              </h2>
              <div className="flex justify-between gap-3">
                <select
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
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
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                    <XAxis
                      dataKey="ts"
                      tickFormatter={(tick) => formatTime(tick)}
                      stroke="var(--chart-axis)"
                    />
                    <YAxis stroke="var(--chart-axis)" />
                    <Tooltip
                      labelFormatter={(label) => {
                        const date = new Date(label as string);
                        return date.toLocaleDateString("en-GB", { timeZone: "UTC" }) + " " + formatTime(label as string);
                      }}
                      contentStyle={{
                        backgroundColor: "var(--chart-tooltip-bg)",
                        borderColor: "var(--chart-tooltip-border)",
                        color: "var(--chart-tooltip-text)"
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
                      name={
                        selectedAttribute === "temp"
                          ? "Temperature"
                          : selectedAttribute === "humidity"
                            ? "Humidity"
                            : selectedAttribute === "pm2_5"
                              ? "PM2.5"
                              : selectedAttribute === "pm10"
                                ? "PM10"
                                : selectedAttribute === "co"
                                  ? "CO"
                                  : selectedAttribute
                      }
                      dataKey={selectedAttribute}
                      stroke="var(--chart-line-1)"
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
        <SideImage imagePath={rei} />
      </div>
    </div>
  );
}
