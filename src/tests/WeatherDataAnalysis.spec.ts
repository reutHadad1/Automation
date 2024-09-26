import { test, expect } from '@playwright/test';
import { OpenWeatherMapService } from '../services/OpenWeatherMapService';
import { DatabaseHelper } from '../utils/DatabaseHelper';
import { getPopularCitiesWithTemperatures } from '../scraper';

test.describe('Weather Data Analysis', () => {
    let weatherService: OpenWeatherMapService;
    let dbHelper: DatabaseHelper;

    test.beforeAll(async () => {
        weatherService = new OpenWeatherMapService();
        await weatherService.initialize();
    
        dbHelper = new DatabaseHelper();
      });

  test('should analyze temperature for popular cities', async () => {
    const citiesWithTemperatures = await getPopularCitiesWithTemperatures();

    for (const city of citiesWithTemperatures) {
      const timeAndDateTemperature = city.temperature;

      if (timeAndDateTemperature !== null) {
        // Get weather data from OpenWeatherMap API
        const weatherResponse = await weatherService.getCurrentWeather(city.name);
  
        if (weatherResponse) {
          const openWeatherTemperature = weatherResponse.main.temp;
          const feelsLikeTemperature = weatherResponse.main.feels_like;
  
          // Insert both temperatures into the database
          await dbHelper.insertWeatherData(city.name, openWeatherTemperature, feelsLikeTemperature, timeAndDateTemperature, undefined);
        }
      }
    }

    // Retrieve cities with discrepancies
    const discrepancies = await dbHelper.getCitiesWithDiscrepancy(1);
    console.log('Cities with temperature discrepancies:', discrepancies);

    // Get the city with the highest average temperature
    const highestAvgTempCity = await dbHelper.getCityWithHighestAvgTemperature();
    console.log(`City with the highest average temperature: ${highestAvgTempCity.city} (${highestAvgTempCity.average_temperature}°C)`);

    dbHelper.close();
  });
});
