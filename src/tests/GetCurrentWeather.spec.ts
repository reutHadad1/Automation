import { test, expect } from '@playwright/test';
import { OpenWeatherMapService } from '../services/OpenWeatherMapService';
import { DatabaseHelper } from '../utils/DatabaseHelper';

test.describe('Verify get_current_weather with Celsius Metric and English Language', () => {
  let weatherService: OpenWeatherMapService;
  let dbHelper: DatabaseHelper;

  test.beforeAll(async () => {
    weatherService = new OpenWeatherMapService();
    await weatherService.initialize();

    dbHelper = new DatabaseHelper();
  });

  test('should validate status code, insert responses into DB, and verify data', async () => {
    const city = 'London';

    // Step 1: Call the OpenWeather API to get current weather
    const response = await weatherService.getCurrentWeather(city);

    // Step 2: Validate status code
    expect(response?.cod).toBe(200);

    // Step 3: Parse the API response
    if (response?.main) {
      const temperature = response.main.temp;
      const feels_like = response.main.feels_like;

      console.log(`Temperature: ${temperature}, Feels Like: ${feels_like}`);

      // Step 4: Insert data into the SQLite database
      await dbHelper.insertWeatherData(city, temperature, feels_like, undefined, undefined);

      // Step 5: Retrieve the inserted data from the database
      const dbWeatherData = await dbHelper.getWeatherData(city);

      // Step 6: Assert that data in the database matches the API response
      expect(dbWeatherData?.openweather_temp).toBe(temperature);
      expect(dbWeatherData?.feels_like).toBe(feels_like);

      console.log(`Data verification successful for city: ${city}`);
    } else {
      console.error(`Failed to fetch weather data for city: ${city}`);
      throw new Error('Weather data not found in API response');
    }
  });

  test.afterAll(async () => {
    dbHelper.close();
  });
});
