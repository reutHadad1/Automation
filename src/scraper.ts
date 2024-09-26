import axios from 'axios';
import * as cheerio from 'cheerio';

interface CityWeather {
  name: string;
  temperature: number | null;
}

export async function getPopularCitiesWithTemperatures(): Promise<CityWeather[]> {
  try {
    console.log('Fetching data from the website...');
    const response = await axios.get('https://www.timeanddate.com/weather/');
    console.log('Data fetched successfully. Status:', response.status);

    if (!response.data) {
      console.error('No data received from the website');
      return [];
    }

    console.log('Parsing HTML with Cheerio...');
    let $;
    try {
      $ = cheerio.load(response.data);
      console.log('HTML parsed successfully');
    } catch (cheerioError) {
      console.error('Error parsing HTML with Cheerio:', cheerioError);
      return [];
    }

    console.log('Selecting weather table...');
    const weatherTable = $('table.zebra.tb-theme');
    console.log('Weather table found:', weatherTable.length > 0);

    if (weatherTable.length === 0) {
      console.error('Weather table not found on the page');
      return [];
    }

    console.log('Selecting city rows...');
    const cityRows = weatherTable.find('tbody tr');
    console.log('Number of city rows found:', cityRows.length);

    if (cityRows.length === 0) {
      console.error('No city rows found in the weather table');
      return [];
    }

    const citiesWithTemperatures: CityWeather[] = [];

    cityRows.each((index, row) => {
      const $row = $(row);
      const name = $row.find('a').first().text().trim();
      const tempString = $row.find('.rbi').text().trim();
      const temperature = parseTemperature(tempString);
      
      console.log(`Row ${index + 1}: City: "${name}", Raw temp: "${tempString}", Parsed temp: ${temperature}`);
      
      citiesWithTemperatures.push({ name, temperature });
    });

    console.log(`Total cities extracted: ${citiesWithTemperatures.length}`);
    return citiesWithTemperatures.slice(0, 100);

  } catch (error) {
    console.error('Error in getPopularCitiesWithTemperatures:', error);
    return [];
  }
}

function parseTemperature(tempString: string): number | null {
  const match = tempString.match(/(-?\d+(?:\.\d+)?)/);
  if (match) {
    return parseFloat(match[0]);
  }
  console.log(`Could not parse temperature from string: "${tempString}"`);
  return null;
}

// Usage example
getPopularCitiesWithTemperatures().then(citiesWithTemperatures => {
  console.log('Popular cities with temperatures:');
  citiesWithTemperatures.forEach(city => {
    console.log(`${city.name}: ${city.temperature !== null ? city.temperature + '°' : 'N/A'}`);
  });
}).catch(error => {
  console.error('Error:', error);
});