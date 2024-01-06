import { API_KEY_PLACES, API_KEY_WEATHER } from "@env";

export const getPlacePredictions = async (text) => {
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${API_KEY_PLACES}&language=pt-BR`;

  try {
    const response = await fetch(url);
    const predictionsData = await response.json();
    return predictionsData.predictions;
  } catch (error) {
    console.error('Erro ao obter previsões de lugares:', error);
    throw error;
  }
};

export const getPlaceDetails = async (placeId) => {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY_PLACES}`;

  try {
    const response = await fetch(url);
    const result = await response.json();
    return result.result;
  } catch (error) {
    console.error('Erro ao obter detalhes do lugar:', error);
    throw error;
  }
};

export const getWeatherInfo = async (lat, lon) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY_WEATHER}&units=metric`;

  try {
    const response = await fetch(url);
    const weatherData = await response.json();
    return weatherData;
  } catch (error) {
    console.error('Erro ao obter informações meteorológicas:', error);
    throw error;
  }
};

export const getWeatherForecast = async (lat, lon) => {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY_WEATHER}&units=metric`;

  try {
    const response = await fetch(url);
    const forecastData = await response.json();
    return forecastData.list.filter((item, index) => index % 8 === 0).slice(0, 4);
  } catch (error) {
    console.error('Erro ao obter informações de previsão:', error);
    throw error;
  }
};
