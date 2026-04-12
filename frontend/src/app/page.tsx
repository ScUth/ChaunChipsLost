"use client";
import { useEffect, useState } from "react";
import { SideBar } from "../../components/sidebar";
import { SideImage } from "../../components/sideimage";

export default function Analysis() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  let rei =
    "../../anime-anime-girls-rebuild-of-evangelion-neon-genesis-evangelion-super-robot-taisen-hd-wallpaper-7ef4bdf8f94e5212864f85d6df43db09.png" as const;

  useEffect(() => {
    console.log("=== useEffect is running on CLIENT ==="); // ← Should appear in browser console

    const fetchData = async () => {
      try {
        const apiBaseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.57:8000";
        const url = `${apiBaseUrl}/sensor/latest/`;
        console.log("Attempting to fetch from:", url); // ← Key log

        const response = await fetch(url);
        console.log("Response status:", response.status, response.statusText);

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP ${response.status}: ${text}`);
        }

        const result = await response.json();
        console.log("SUCCESS! Data received:", result); // ← Most important
        setData(result);
      } catch (error: any) {
        console.error("Fetch failed:", error.message);
        // setData({ error: error.message });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  console.log(
    "Analysis component body executed - this should appear in browser console",
  );

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
      hour12: false,
    });
  };

  const calculateLivability = () => {
    if (!data) return null;
    return (
      10 -
      data.pm2_5 / 40 -
      data.pm10 / 50 -
      (data.co * 2) / 4095 -
      Math.abs((data.temp - 26) / 5) -
      Math.abs((data.humidity - 55) / 10)
    );
  };

  const calculateFormatCO = () => {
    if (!data) return null;
    return ((data.co / 4095) * 20);
  };

  const livability = calculateLivability();
  const formatCO = calculateFormatCO();

  return (
    <div className="min-h-screen w-full bg-[url(https://gizmodo.com/app/uploads/2021/09/95299b3d1b809192a332ad2c708f0599.jpg)] bg-cover bg-center bg-no-repeat flex overflow-hidden">
      {/* 15% */}
      <SideBar />

      {/* Main container that holds main + right section */}
      <div className="flex flex-1 min-w-0">
        {" "}
        {/* ← Important: flex-1 + min-w-0 */}
        {/* 55% */}
        <main className="flex-[55%] sm:ml-[15%] overflow-auto p-4 sm:mr-[30%] sm:my-[2.5%]">
          <div className="flex justify-between bg-black/50 ">
            <p className="p-4 text-3xl">Thung Kru, Bangkok 10140, Thailand</p>
            <p className="p-4 text-3xl">
              {data ? formatTime(data.ts) : "XX:XX"}
            </p>
          </div>
          <div className="bg-black/50 mt-1">
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
                  <p className="text-right">{data ? data.humidity : "000"}%</p>
                </div>
              </div>

              {/* Right Column (PM10 & CO) */}
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

          <div className="mt-4 p-4 bg-black/50 text-white rounded">
            <p>Debug Info:</p>
            <p>→ Loading: {loading ? "Yes" : "No"}</p>
            <p>→ Data exists: {data ? "Yes" : "No"}</p>
            {data && (
              <pre className="mt-2 text-xs overflow-auto max-h-96 bg-black/70 p-2">
                {JSON.stringify(data, null, 2)}
              </pre>
            )}
          </div>
        </main>
        <SideImage imagePath={rei} />
      </div>
    </div>
  );
}
