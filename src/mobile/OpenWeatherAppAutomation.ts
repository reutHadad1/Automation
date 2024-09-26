import { remote } from 'webdriverio';

const serverConfig = {
  host: 'localhost',
  port: 4723,
};

const capabilities = {
  platformName: 'Android',
  'appium:deviceName': 'emulator-5554',
  'appium:appPackage': 'uk.co.openweather',
  'appium:appActivity': 'MainActivity',
  'appium:automationName': 'UiAutomator2',
};

export async function getTemperatureFromApp(city: string): Promise<number | null> {
  console.log("Starting temperature extraction...");

  const serverUrl = `http://${serverConfig.host}:${serverConfig.port}/`;
  console.log("Connecting to server at:", serverUrl);

  const driver = await remote({
    logLevel: 'error',
    path: '/',
    hostname: serverConfig.host,
    port: serverConfig.port,
    capabilities,
  });

  try {
    const searchBox = await driver.$("com.openweathermap.weather:id/search_box");
    console.log("Found search box:", searchBox);

    await searchBox.setValue(city);

    const cityResult = await driver.$(`//android.widget.TextView[@text="${city}"]`);
    await cityResult.click();

    console.log("Selected city result:", cityResult);

    const tempElement = await driver.$("com.openweathermap.weather:id/temp_value");
    const tempText = await tempElement.getText();

    const temperature = parseTemperature(tempText);
    console.log(`Extracted temperature for ${city} from mobile app: ${temperature}°C`);
    
    return temperature;
  } catch (error) {
    console.error(`Failed to extract temperature for ${city}:`, error);
    return null;
  } finally {
    await driver.deleteSession();
  }
}

// Helper function to parse temperature string
function parseTemperature(tempString: string): number | null {
  const match = tempString.match(/(-?\d+)/);
  return match ? parseFloat(match[0]) : null;
}
