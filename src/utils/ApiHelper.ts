import { ConfigHelper } from './ConfigHelper';

export class ApiHelper {
  public static getBaseUrl(): string {
    return ConfigHelper.getBaseUrl();
  }

  public static getApiKey(): string {
    return ConfigHelper.getApiKey();
  }
}

