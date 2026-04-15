"use client";
import { SideBar } from "../../../components/sidebar";
import { SideImage } from "../../../components/sideimage";
import {
  calculateFormatCO,
  calculateLivability,
  formatTime
} from "../../../components/calculations";
import { useEffect, useState } from "react";

export default function Analysis() {
  const [data, setData] = useState(null);
  const [predictData, setPredictData] = useState(null);
  const [loading, setLoading] = useState(true);
  let rei = "../../a6a26c71d98776874a921c84e1059a8d33916af6.png" as const;
  const apiBaseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.57:8000";
  useEffect(() => {
    const fetchData = async () => {
      try {
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
        // console.error("Fetch failed:", error.message);
        // setData({ error: error.message });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchPredictedData = async () => {
      try {
        const urls = `${apiBaseUrl}/api/predict/latest/`;
        // console.log("Attempting to fetch from:", url); // ← Key log

        const res = await fetch(urls);
        // console.log("Response status:", response.status, response.statusText);

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }

        const predictedResult = await res.json();
        // console.log("SUCCESS! Data received:", result); // ← Most important
        setPredictData(predictedResult);
      } catch (error: any) {
        // console.error("Fetch failed:", error.message);
        // setData({ error: error.message });
      } finally {
        setLoading(false);
      }
    };

    fetchPredictedData();
  }, []);
  const livability = calculateLivability(data);
  const predictedLivability = calculateLivability(predictData);
  const formatCO = calculateFormatCO(data);
  const formatPredictedCO = calculateFormatCO(predictData);

  return (
    <div className="min-h-screen w-full bg-[url(https://scontent.fbkk29-7.fna.fbcdn.net/v/t39.30808-6/485148342_1136888541817903_778452936387835507_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=7b2446&_nc_ohc=aKiFyNLKIi8Q7kNvwFt4vr8&_nc_oc=Adoa60palfJWsr8BcS4GCyPE3H9jERtQwdXeTUTdW3VauPIM1AM64_dV34OS3tGUu_AfBux9C0Y5qC18BN9DNaNu&_nc_zt=23&_nc_ht=scontent.fbkk29-7.fna&_nc_gid=Ygph8O-BeMISiNs-GAdpDg&_nc_ss=7a389&oh=00_Af0cETtNVWJxzgcEezR-O3hxLXPlqi7xitaXXFyd4BeiGg&oe=69E0108D)] bg-cover bg-center bg-no-repeat bg-fixed flex overflow-hidden">
      {/* Sidebar - 15% on large screens, hidden by default on mobile */}
      <SideBar />

      {/* Main container that holds main + right section */}
      <div className="flex flex-1 min-w-0">
        <main className="flex-[55%] sm:ml-[15%] overflow-auto p-4 sm:mr-[30%] sm:my-[2.5%]">
          <div className="flex bg-black/80 mb-1 justify-center">
            <p className="p-4 text-3xl italic">
              Thung Khru, Bangkok 10140, Thailand
            </p>
          </div>
          <div className="flex bg-black/60 backdrop-blur-md">
            <p className="p-4 text-3xl">
              {data ? formatTime(data.ts) : "XX:XX"} (Current)
            </p>
          </div>
          <div className="bg-black/60 mt-1">
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
          <div className="flex bg-black/60 mt-5 backdrop-blur-md">
            <p className="p-4 text-3xl text-yellow-300 bg-blur">
              {predictData ? formatTime(predictData.timestamp) : "XX:XX"} (Predicted)
            </p>
          </div>
          <div className="bg-black/60 mt-1 text-yellow-300">
            <div className="flex justify-between pt-4 pr-4 pl-4">
              <p className="">Temperature</p>
              <p className="">Livability Index</p>
            </div>
            <div className="flex justify-between pl-4 pr-4 text-7xl">
              <p>{predictData ? predictData.temp : "XX"}°C</p>
              <p>{predictedLivability !== null ? predictedLivability.toFixed(2) : "XX.XX"}/10</p>
            </div>
            <div className="flex justify-between pl-4 pr-4 pt-8">
              <div className="flex-1 min-w-[200px] pr-6">
                <div className="flex justify-between border-t py-2">
                  <p className="text-left">PM2.5</p>
                  <p className="text-right">
                    {predictData ? predictData.pm2_5 : "XXX.XX"} μg/m³
                  </p>
                </div>
                <div className="flex justify-between border-t py-2">
                  <p className="text-left">Humidity</p>
                  <p className="text-right">{predictData ? predictData.humidity : "XX"}%</p>
                </div>
              </div>
              <div className="flex-1 min-w-[200px]">
                <div className="flex justify-between border-t py-2">
                  <p className="text-left">PM10</p>
                  <p className="text-right">
                    {predictData ? predictData.pm10 : "XXX.XX"} μg/m³
                  </p>
                </div>
                <div className="flex justify-between border-t py-2">
                  <p className="text-left">CO</p>
                  <p className="text-right">
                    {formatPredictedCO !== null ? formatPredictedCO.toFixed(2) : "XXX.XX"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
        <SideImage imagePath={rei} />
      </div>
    </div>
  );
}
