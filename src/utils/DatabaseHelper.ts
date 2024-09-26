import * as sqlite3 from 'sqlite3';

export class DatabaseHelper {
  private db: sqlite3.Database;

  constructor(dbName = 'data.db') {
    this.db = new sqlite3.Database(dbName, (err) => {
      if (err) {
        console.error('Error opening database:', err);
      } else {
        console.log('Connected to the SQLite database.');
        this.createTables();
      }
    });
  }

  private createTables() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS weather_data (
        city TEXT PRIMARY KEY,
        openweather_temp REAL,
        feels_like REAL,
        timeanddate_temp REAL,
        mobile_temp REAL,  -- Added mobile temperature column
        average_temperature REAL
      )
    `;
    this.db.run(createTableQuery, (err) => {
      if (err) {
        console.error('Error creating tables:', err);
      } else {
        console.log('Tables created or verified successfully.');
      }
    });
  }

  // Insert weather data from the API, website, and mobile app, and calculate the average temperature
  public insertWeatherData(
    city: string,
    openWeatherTemp: number,
    feelsLikeTemp: number,
    timeAndDateTemp: number | undefined,
    mobileTemp: number | undefined
  ): Promise<void> {
    const averageTemperature = (openWeatherTemp + feelsLikeTemp + (mobileTemp ?? 0)) / 3;
    const insertQuery = `
      INSERT INTO weather_data (city, openweather_temp, feels_like, timeanddate_temp, mobile_temp, average_temperature)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(city) DO UPDATE SET
        openweather_temp=excluded.openweather_temp,
        feels_like=excluded.feels_like,
        timeanddate_temp=excluded.timeanddate_temp,
        mobile_temp=excluded.mobile_temp,  -- Now updates mobile temperature as well
        average_temperature=excluded.average_temperature
    `;

    return new Promise((resolve, reject) => {
      this.db.run(
        insertQuery,
        [city, openWeatherTemp, feelsLikeTemp, timeAndDateTemp, mobileTemp, averageTemperature],
        (err) => {
          if (err) {
            console.error(`Error inserting/updating weather data for city: ${city}`, err);
            reject(err);
          } else {
            console.log(`Weather data for ${city} inserted/updated successfully.`);
            resolve();
          }
        }
      );
    });
  }

  // Retrieve weather data for a city
  public getWeatherData(city: string): Promise<any> {
    const query = 'SELECT * FROM weather_data WHERE city = ?';
    return new Promise((resolve, reject) => {
      this.db.get(query, [city], (err, row) => {
        if (err) {
          console.error(`Error retrieving weather data for city: ${city}`, err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Retrieve city with the highest average temperature
  public getCityWithHighestAvgTemperature(): Promise<any> {
    const query = 'SELECT city, average_temperature FROM weather_data ORDER BY average_temperature DESC LIMIT 1';
    return new Promise((resolve, reject) => {
      this.db.get(query, [], (err, row) => {
        if (err) {
          console.error('Error retrieving city with highest average temperature:', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Retrieve all cities with temperature discrepancies greater than a threshold
  public getCitiesWithDiscrepancy(threshold: number): Promise<any[]> {
    const query = `
      SELECT city, openweather_temp, feels_like, timeanddate_temp, mobile_temp 
      FROM weather_data 
      WHERE ABS(openweather_temp - timeanddate_temp) > ? 
        OR ABS(openweather_temp - mobile_temp) > ? 
        OR ABS(mobile_temp - timeanddate_temp) > ?
    `;  // Check discrepancies across all data points
    return new Promise((resolve, reject) => {
      this.db.all(query, [threshold, threshold, threshold], (err, rows) => {
        if (err) {
          console.error('Error retrieving cities with discrepancies:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Close the database connection
  public close() {
    this.db.close((err) => {
      if (err) {
        console.error('Error closing the database:', err);
      } else {
        console.log('Database connection closed.');
      }
    });
  }
}
