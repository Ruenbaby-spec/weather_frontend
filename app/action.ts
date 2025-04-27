"use server";

import { z } from "zod";

// Define WeatherData type from schema (optional but recommended)
export type WeatherData = z.infer<typeof weatherSchema>;

const weatherSchema = z.object({
  name: z.string(),
  main: z.object({
    temp: z.number(),
    humidity: z.number(),
    feels_like: z.number(),
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

export async function getWeatherData(city: string): Promise<{
  data?: z.infer<typeof weatherSchema>;
  error?: string;
}> {
  try {
    if (!city.trim()) {
      return { error: "City required!" };
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY}`
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "City not found");
    }

    const rawData = await response.json();
    return { data: weatherSchema.parse(rawData) };

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.errors);
      return { error: "Invalid weather data received" };
    }
    return {
      error: error instanceof Error ? error.message : "Failed to fetch weather data",
    };
  }
}