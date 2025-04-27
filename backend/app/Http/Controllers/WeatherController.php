<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WeatherController extends Controller
{
    public function getWeather(Request $request)
    {
        $city = $request->query('city');
        
        try {
            $city = trim($city);
            if (empty($city)) {
                return response()->json(['error' => 'City required!'], 400);
            }

            $apiKey = env('OPENWEATHERMAP_API_KEY');
            if (empty($apiKey)) {
                throw new \Exception('OpenWeatherMap API key missing');
            }
    
            // Option 1: Direct URL (works fine)
            $url = "https://api.openweathermap.org/data/2.5/weather?q=" . urlencode($city) . "&appid=" . env('OPENWEATHERMAP_API_KEY') . "&units=metric";
            $response = Http::get($url);

            if ($response->failed()) {
                $error = $response->json();
                throw new \Exception($error['message'] ?? 'City not found');
            }

            $data = $response->json();

            // Basic validation
            if (!isset($data['weather'], $data['main'], $data['name'], $data['wind'])) {
                throw new \Exception('Invalid weather data structure');
            }

            return response()->json([
                'data' => [
                    'name' => $data['name'],
                    'temp' => $data['main']['temp'],
                    'humidity' => $data['main']['humidity'],
                    'feels_like' => $data['main']['feels_like'],
                    'weather_main' => $data['weather'][0]['main'],
                    'weather_description' => $data['weather'][0]['description'],
                    'icon' => $data['weather'][0]['icon'],
                    'wind_speed' => $data['wind']['speed'],
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], $e->getMessage() === 'City not found' ? 404 : 500);
        }
    }
}