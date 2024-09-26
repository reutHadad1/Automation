import { test, expect } from '@playwright/test';
import { getTemperatureFromApp } from '../mobile/OpenWeatherAppAutomation';
import { getPopularCitiesWithTemperatures } from '../scraper';
import { OpenWeatherMapService } from '../services/OpenWeatherMapService';
import { DatabaseHelper } from '../utils/DatabaseHelper';

test.describe('City Temperature Discrepancy Analysis', () => {
  let dbHelper: DatabaseHelper;
  let weatherService: OpenWeatherMapService;

  test.beforeAll(async () => {
    dbHelper = new DatabaseHelper();
    weatherService = new OpenWeatherMapService();
  });

  test('should analyze temperature discrepancies across mobile, API, and website for 20 cities', async () => {
    test.setTimeout(60000);

    const cities = await getPopularCitiesWithTemperatures();  // Scrapes cities from the website

    const testCities = cities.slice(0, 20);

    for (const cityWeather of testCities) {
      const { name: city, temperature: websiteTemp } = cityWeather;

      if (websiteTemp !== null) {
        // Step 1: Get temperature from the OpenWeatherMap mobile app
        const mobileTemp = await getTemperatureFromApp(city);

        // Step 2: Get temperature from OpenWeatherMap API
        const weatherResponse = await weatherService.getCurrentWeather(city);
        const apiTemp = weatherResponse?.main?.temp;
        const feelsLikeTemp = weatherResponse?.main?.feels_like;

        // Step 3: Verify temperatures are not null and insert data into the database
        if (mobileTemp !== null && apiTemp !== null && feelsLikeTemp !== undefined) {
          console.log(`City: ${city}, Mobile: ${mobileTemp}°C, API: ${apiTemp}°C, Website: ${websiteTemp}°C`);

          // Insert data into the database
          await dbHelper.insertWeatherData(city, apiTemp, feelsLikeTemp, websiteTemp, mobileTemp);

          // Step 4: Retrieve the inserted data and assert that it matches the fetched data
          const dbWeatherData = await dbHelper.getWeatherData(city);
          expect(dbWeatherData?.openweather_temp).toBe(apiTemp);
          expect(dbWeatherData?.feels_like).toBe(feelsLikeTemp);
          expect(dbWeatherData?.mobile_temp).toBe(mobileTemp);
          expect(dbWeatherData?.timeanddate_temp).toBe(websiteTemp);

          console.log(`Data verification successful for city: ${city}`);
        } else {
          console.error(`Failed to retrieve all temperature data for city: ${city}`);
        }
      }
    }
  });

  test.afterAll(async () => {
    dbHelper.close();
  });
});
