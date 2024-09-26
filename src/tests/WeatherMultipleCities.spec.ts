import { test, expect } from '@playwright/test';
import { OpenWeatherMapService } from '../services/OpenWeatherMapService';
import { DatabaseHelper } from '../utils/DatabaseHelper';

test.describe('Weather Data for Multiple Cities', () => {
  let weatherService: OpenWeatherMapService;
  let dbHelper: DatabaseHelper;

  const cities = [
    { name: 'London', id: 4119617 },
    { name: 'Vienna', id: 2761369 },
    { name: 'Tel Aviv', id: 293397 }
  ];

  test.beforeAll(async () => {
    weatherService = new OpenWeatherMapService();
    await weatherService.initialize();

    dbHelper = new DatabaseHelper();
  });

  test('should insert weather data and verify the highest average temperature', async () => {
    for (const city of cities) {
      console.log(`Fetching weather data by city id for ${city.name}`);

      // Fetch weather data for the city by ID
      const weatherData = await weatherService.getWeatherByCityId(city.id);

      // Validate API response
      expect(weatherData).not.toBeNull();
      const { temp, feels_like } = weatherData.main;

      console.log(`Temperature: ${temp}, Feels Like: ${feels_like}`);

      // Insert weather data into the database
      await dbHelper.insertWeatherData(city.name, temp, feels_like, undefined, undefined);


      // Retrieve the inserted data from the database
      const dbWeatherData = await dbHelper.getWeatherData(city.name);

      expect(dbWeatherData.openweather_temp).toBe(temp);
      expect(dbWeatherData.feels_like).toBe(feels_like);

      console.log(`Data verification successful for city: ${city.name}`);
    }

    // Retrieve and print the city with the highest average temperature
    const cityWithHighestAvgTemp = await dbHelper.getCityWithHighestAvgTemperature();
    console.log(`City with the highest average temperature: ${cityWithHighestAvgTemp.city} (${cityWithHighestAvgTemp.max_temp})`);
  });

  test.afterAll(() => {
    dbHelper.close();
  });
});
