export class WeatherData {
    cityId: number;
    temperature: number;
    feelsLike: number;
    averageTemperature?: number; // for the enhancement

    constructor(cityId: number, temperature: number, feelsLike: number) {
        this.cityId = cityId;
        this.temperature = temperature;
        this.feelsLike = feelsLike;
    }
}