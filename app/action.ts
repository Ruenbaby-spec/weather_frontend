"use server";

import { WeatherData } from "./Types/weather";
import { z } from "zod";

const weatherSchema = z.object({
  name: z.string(),
  main: z.object({
    temp: z.number(),
    humidity: z.number(),
    feels_like: z.number(), // Fixed: z.Number should be z.number()
  }),
  weather: z.array(
    z.object({
      main: z.string(),
      description: z.string(),
      icon: z.string(),
    })
  ),
  wind: z.object({
    speed: z.number(),
  }),
});


export async function getWeatherData(city: string) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY}`
        );
        
        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.message || "City not found");
        }
        const rawData = await res.json();
        
        // 5. Parse with Zod schema
        const parsedData = weatherSchema.parse(rawData);
        
        return { data: parsedData };

    } catch (error) {
        // Handle specific error cases
        if (error instanceof z.ZodError) {
            console.error("Validation error:", error.errors);
            return { error: "Invalid weather data received" };
        }
        
        return {
            error: error instanceof Error 
                ? error.message 
                : "Failed to fetch weather data"
        };
    }
}