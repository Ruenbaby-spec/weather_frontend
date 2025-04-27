'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Droplets, Search, Thermometer, Wind } from "lucide-react";
import { getWeatherData } from "./action";
import { useState } from "react";
import { WeatherData } from "./Types/weather";
import { Card, CardContent } from "@/components/ui/card";
import { useFormStatus } from "react-dom";
import Image from "next/image"; // Fixed: Using Next.js Image component

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="bg-black text-white" type="submit" disabled={pending}>
      <Search className={`w-4 h-4 ${pending ? "animate-spin" : ""}`} />
    </Button>
  );
}

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>("");
  
  const iconUrl = weather?.weather?.[0]?.icon 
    ? `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png` 
    : null;

  const handleSearch = async (formData: FormData) => {
    setError("");
    const city = formData.get("city") as string;
    const { data, error: weatherError } = await getWeatherData(city);

    if (weatherError) {
      setError(weatherError);
      setWeather(null);
      return;
    }
    
    if (data) {
      setWeather(data);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center p-4 flex items-center justify-center">
      <div className="w-md max-w-md space-y-4">
        <form 
          className="flex gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            await handleSearch(formData);
          }}
        >
          <Input
            name="city"
            type="text"
            placeholder="Enter city name"
            className="bg-white w-full max-w-md rounded text-black"
            required
          />
          <SubmitButton/>
        </form>

        {error && (
          <div className="bg-black/70 backdrop-blur text-white p-2 rounded">
            {error}
          </div>
        )}

        {weather && (
          <Card className="bg-black/80 backdrop-blur">
            <CardContent className="p-6">
              <div className="text-center">
                <h2 className="font-bold text-5xl text-white">{weather.name}</h2>
                <div className="flex items-center justify-center gap-2 mt-2">
                  {iconUrl && (
                    <Image 
                      src={iconUrl} 
                      alt="Weather Icon" 
                      width={96}
                      height={96}
                      className="w-24 h-24"
                    />
                  )}
                  <div className="text-3xl font-bold text-white">
                    {Math.round(weather.main.temp)}°C
                  </div>
                </div>
                <div className="font-bold text-white capitalize">
                  {weather.weather[0].description}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-5">
                <div className="text-center">
                  <Thermometer className="w-7 h-7 mx-auto text-red-500"/>
                  <div className="mt-2 text-md text-red-500">Feels like</div>
                  <div className="font-semibold text-red-500">
                    {Math.round(weather.main.feels_like)}°C
                  </div>
                </div>
                
                <div className="text-center">
                  <Wind className="w-7 h-7 mx-auto text-orange-500"/>
                  <div className="mt-2 text-md text-orange-500">Wind Speed</div>
                  <div className="font-semibold text-orange-500">
                    {Math.round(weather.wind.speed)} m/s
                  </div>
                </div>
                
                <div className="text-center">
                  <Droplets className="w-7 h-7 mx-auto text-blue-500"/>
                  <div className="mt-2 text-md text-blue-500">Humidity</div>
                  <div className="font-semibold text-blue-500">
                    {Math.round(weather.main.humidity)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}