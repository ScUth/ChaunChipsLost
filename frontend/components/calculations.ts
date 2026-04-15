export const calculateLivability = (data: any) => {
  if (!data) return null;
  return (
    10 -
    data.pm2_5 / 40 -
    data.pm10 / 80 -
    (data.co * 2) / 4095 -
    Math.abs((data.temp - 26) / 5) -
    Math.abs((data.humidity - 55) / 10)
  );
};

export const calculateFormatCO = (data: any) => {
  if (!data) return null;
  return (data.co / 4095) * 20;
};

export const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    hour12: false,
  });
};