import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  Image,
  SafeAreaView,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';

const Search = () => {
  const navigation = useNavigation();

  const [searchText, setSearchText] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFlatListVisible, setFlatListVisibility] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const apiKeyPlaces = 'AIzaSyAMI2xT6FiUa0FiP8XGA0TuVBhZLXW_6s8';
  const apiKeyWeather = '0ac426096c1052bd93caf48f951447f2';

  let searchTimeout;

  const getPlacePredictions = async (text) => {
    setLoading(true);

    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(async () => {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${apiKeyPlaces}&language=pt-BR`;

      try {
        const response = await fetch(url);
        const predictionsData = await response.json();
        setPredictions(predictionsData.predictions);
        setFlatListVisibility(!!text && predictionsData.predictions.length > 0);
      } catch (error) {
        console.error('Erro ao obter previsões de lugares:', error);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const getWeatherInfo = async (placeId) => {
    const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKeyPlaces}`;

    try {
      const placeDetailsResponse = await fetch(placeDetailsUrl);
      const result = await placeDetailsResponse.json();

      if (result && result.result && result.result.geometry && result.result.geometry.location) {
        const { lat, lng } = result.result.geometry.location;
        const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKeyWeather}&units=metric`;

        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        if (weatherData && weatherData.weather && weatherData.main) {
          console.log('Resposta da API de Tempo:', weatherData);
          return weatherData;
        } else {
          console.error('Resposta da API de Tempo não possui a estrutura esperada:', weatherData);
        }
      } else {
        console.error('Resposta da API de detalhes do lugar não possui a estrutura esperada:', result);
      }
    } catch (error) {
      console.error('Erro ao obter informações meteorológicas:', error);
      throw error;
    }
  };

  const getWeatherForecast = async (lat, lon) => {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKeyWeather}&units=metric`;

    try {
      const forecastResponse = await fetch(forecastUrl);
      const forecastData = await forecastResponse.json();

      if (forecastData && forecastData.list && forecastData.list.length > 0) {
        const next4DaysData = forecastData.list.filter((item, index) => index % 8 === 0).slice(0, 4);

        console.log('Resposta da API de Previsão:', next4DaysData);
        return next4DaysData;
      } else {
        console.error('Resposta da API de Previsão não possui dados válidos:', forecastData);
      }
    } catch (error) {
      console.error('Erro ao obter informações de previsão:', error);
      throw error;
    }
  };

  const handlePredictionSelection = async (item) => {
    setSearchText(item.description);
    setPredictions([]);
    setLoading(true);

    try {
      const weatherData = await getWeatherInfo(item.place_id);
      const forecastData = await getWeatherForecast(weatherData.coord.lat, weatherData.coord.lon);

      setSelectedLocation(item.description);
      setForecastData(forecastData);

      navigation.navigate('Dashboard', {
        weatherData,
        selectedLocation: item.description,
        forecastData,
      });
    } catch (error) {
      console.error('Erro ao obter informações meteorológicas:', error);
    } finally {
      setLoading(false);
      setFlatListVisibility(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require('../../../assets/background.png')}
        resizeMode="cover"
      >
        <View style={styles.logoContainer}>
          <Image source={require('../../../assets/logo.png')} />
        </View>
        <View style={styles.logoInput}>
          <View style={styles.boxInput}>
            <View style={styles.boxTitle}>
              <Text style={styles.titleWhite}>
                Boas Vindas ao <Text style={styles.titleBlue}>TypeWeather</Text>{' '}
              </Text>
              <Text style={styles.subtitleWhite}>
                Escolha um local para ver a previsão do tempo
              </Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Buscar local"
              placeholderTextColor="rgba(127, 127, 152, 1)"
              value={searchText}
              onChangeText={(text) => {
                setSearchText(text);
                if (text === '') {
                  setFlatListVisibility(false);
                } else {
                  getPlacePredictions(text);
                }
              }}
              autoCompleteType="off"
            />
          </View>

          {loading && <ActivityIndicator size="large" color="blue" />}

          {searchText !== '' && isFlatListVisible && !loading && predictions.length > 0 && (
            <FlatList
              style={styles.suggestionsList}
              data={predictions.slice(0, 4)}
              keyExtractor={(item) => item.place_id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => handlePredictionSelection(item)}
                >
                  <Text style={styles.txtList}>{item.description}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Search;
