import * as fs from 'fs';
import * as ini from 'ini';
import * as path from 'path';

export class ConfigHelper {
  private static config: any;

  // Load the config.ini file
  private static loadConfig() {
    if (!this.config) {
      const configPath = path.resolve(__dirname, '../config/config.ini'); // Adjust path if needed
      const fileContents = fs.readFileSync(configPath, 'utf-8');
      this.config = ini.parse(fileContents);
    }
  }

  // Retrieve the Base URL from the config file
  public static getBaseUrl(): string {
    this.loadConfig();
    return this.config.api.BASE_URL;
  }

  // Retrieve the API key from the config file
  public static getApiKey(): string {
    this.loadConfig();
    return this.config.api.API_KEY;
  }
}
