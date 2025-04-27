<?php

use App\Http\Controllers\WeatherController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

Route::get('/weather', [WeatherController::class, 'getWeather']) 
?>
   