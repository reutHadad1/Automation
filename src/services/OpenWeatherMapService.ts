import { ApiManager } from '../services/ApiManager';
import { ApiHelper } from '../utils/ApiHelper';

export class OpenWeatherMapService {
  private apiManager: ApiManager;

  constructor() {
    this.apiManager = new ApiManager();
  }

  // Initialize the ApiManager with the OpenWeatherMap base URL and API key as a header
  public async initialize() {
    const headers = {
      'Content-Type': 'application/json',
    };
    const baseUrl = ApiHelper.getBaseUrl();

    // Set the API request context
    await this.apiManager.setApiRequestContext(baseUrl, headers);
  }

  // Get current weather for a given city using the API
  public async getCurrentWeather(city: string): Promise<any | null> {
    try {
      const endpoint = `${ApiHelper.getBaseUrl()}?q=${encodeURIComponent(city)}&appid=${ApiHelper.getApiKey()}&units=metric`;
      console.log(`Fetching weather data for city: ${city}`);
      const response = await this.apiManager.getRequest(endpoint);
      if (!response) {
        console.error(`No response received for city: ${city}`);
        return null;
      }

      if (response) {
        const data = response.data;
        console.log(`Weather data for ${city}:`, data);
        return data; // Return the actual data
      } else {
        console.error(`No response received for city: ${city}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching weather data for city: ${city}:`, error);
      return null;
    }
  }

  // Get weather by city ID
  public async getWeatherByCityId(cityId: number): Promise<any | null> {
    try {
      const endpoint = `${ApiHelper.getBaseUrl()}?id=${cityId}&appid=${ApiHelper.getApiKey()}&units=metric`;
      console.log(`Fetching weather data for city ID: ${cityId}`);
      const response = await this.apiManager.getRequest(endpoint);
      
      if (response) {
        const data = await response.data;
        console.log(`Weather data for city ID ${cityId}:`, data);
        return data; // Return the actual data
      } else {
        console.error(`No response received for city ID: ${cityId}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching weather data for city ID: ${cityId}:`, error);
      return null;
    }
  }
}
