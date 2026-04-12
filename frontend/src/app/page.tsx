"use client"
import { useEffect, useState } from "react";
import { SideBar } from "../../components/sidebar";
import { SideImage } from "../../components/sideimage";

export default function Analysis() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  let rei = "../../anime-anime-girls-rebuild-of-evangelion-neon-genesis-evangelion-super-robot-taisen-hd-wallpaper-7ef4bdf8f94e5212864f85d6df43db09.png" as const;

  useEffect(() => {
    console.log("=== useEffect is running on CLIENT ===");   // ← Should appear in browser console

    const fetchData = async () => {
      try {
        const url = "http://192.168.1.57:8000/sensor/latest/";
        console.log("Attempting to fetch from:", url);        // ← Key log

        const response = await fetch(url);
        console.log("Response status:", response.status, response.statusText);

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP ${response.status}: ${text}`);
        }

        const result = await response.json();
        console.log("SUCCESS! Data received:", result);     // ← Most important
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
  console.log("Analysis component body executed - this should appear in browser console");

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen w-full bg-[url(https://gizmodo.com/app/uploads/2021/09/95299b3d1b809192a332ad2c708f0599.jpg)] bg-cover bg-center bg-no-repeat flex overflow-hidden">

      {/* 15% */}
      <SideBar />

      {/* Main container that holds main + right section */}
      <div className="flex flex-1 min-w-0">   {/* ← Important: flex-1 + min-w-0 */}

        {/* 60% */}
        <main className="flex-[55%] sm:ml-[15%] overflow-auto p-4">
          ThungKru, Bangkok 10140, Thailand ...

          <div className="mt-4 p-4 bg-black/50 text-white rounded">
            <p>Debug Info:</p>
            <p>→ Loading: {loading ? 'Yes' : 'No'}</p>
            <p>→ Data exists: {data ? 'Yes' : 'No'}</p>
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