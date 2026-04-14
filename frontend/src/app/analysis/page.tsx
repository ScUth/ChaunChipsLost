"use client";
import { SideBar } from "../../../components/sidebar";
import { SideImage } from "../../../components/sideimage";
import MathAlign from "../../../components/mathalign";
import { useEffect, useState } from "react";
import { calculateLivability, formatTime } from "../../../components/calculations";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Analysis() {
  let kanade = "../../GSCyPnOagAADXcG.png" as const;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiBaseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.57:8000";
        const url = `${apiBaseUrl}/sensor/latest/`;
        // console.log("Attempting to fetch from:", url); // ← Key log

        const response = await fetch(url);
        // console.log("Response status:", response.status, response.statusText);

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP ${response.status}: ${text}`);
        }

        const result = await response.json();
        // console.log("SUCCESS! Data received:", result); // ← Most important
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

  const livability = calculateLivability(data);

  const pieData = data ? [
    { name: "PM2.5", value: Number((data.pm2_5 / 40).toFixed(3)) },
    { name: "PM10", value: Number((data.pm10 / 50).toFixed(3)) },
    { name: "CO", value: Number(((data.co * 2) / 4095).toFixed(3)) },
    { name: "Temp", value: Number(Math.abs((data.temp - 26) / 5).toFixed(3)) },
    { name: "Humidity", value: Number(Math.abs((data.humidity - 55) / 10).toFixed(3)) },
  ].sort((a, b) => b.value - a.value) : [];

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#06b6d4'];

  return (
    <div className="min-h-screen w-full bg-[url('/pxfuel.jpg')] bg-cover bg-center bg-no-repeat flex overflow-hidden bg-fixed top-0">
      {/* Sidebar - 15% on large screens, hidden by default on mobile */}
      <SideBar />

      {/* Main container that holds main + right section */}
      <div className="flex flex-1 min-w-0">
        <main className="flex-[55%] sm:ml-[15%] overflow-auto p-4 sm:mr-[30%] sm:my-[2.5%]">
          <div className="bg-black/50 pb-6">
            <p className="p-4 text-3xl">Livability Calculate @{data ? formatTime(data.ts) : "XX:XX"}</p>
            <div className="flex pl-4 pb-4">
              <MathAlign
                formula={`\\large 
                  \\begin{align*} 
                    \\textrm{Livability} &= 10 - \\dfrac{\\textrm{PM2.5}}{40}- \\dfrac{\\textrm{PM10}}{50}- \\dfrac{\\textrm{CO}\\cdot 2}{4095}- \\dfrac{\\lvert \\textrm{Temp} - 26\\rvert}{5} - \\dfrac{\\lvert \\textrm{Humidity} - 55\\rvert}{10}\\\\
                    &= 10 - \\dfrac{${data ? data.pm2_5 : "XX"}}{40}- \\dfrac{${data ? data.pm10 : "XX"}}{50}- \\dfrac{${data ? data.co : "XX"}\\cdot 2}{4095}- \\dfrac{\\lvert ${data ? data.temp : "XX"} - 26\\rvert}{5} - \\dfrac{\\lvert ${data ? data.humidity : "XX"} - 55\\rvert}{10}\\\\
                    &= ${livability !== null ? livability.toFixed(2) : "XX.XX"}
                  \\end{align*}`}
                display={true}
              />
            </div>
            {data && (
              <div className="w-full h-80 mt-2 p-4 pb-4 backdrop-blur-md">
                <h3 className="text-3xl mb-2 text-white/90">Parameter Penalties</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius="80%"
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#222', borderRadius: '8px', border: 'none', color: '#fff' }} 
                      itemStyle={{ color: '#fff' }}
                      formatter={(value) => [`${value} Penalty`, 'Value']}
                    />
                    <Legend layout="vertical" align="right" verticalAlign="middle"/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </main>
        <SideImage imagePath={kanade} />
      </div>
    </div>
  );
}
