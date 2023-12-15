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
  StatusBar,
  StyleSheet,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
// import notifee, {
//   AndroidImportance,
//   AndroidVisibility,
// } from '@notifee/react-native';

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

  /* const showNotification = async () => {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'rain-channel',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Olha a chuva ⛈️',
      body: 'Vai cair um temporal ☔️',
      android: {
        channelId: channelId,
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
        // The icon to display in the notification (option
        smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  };
*/
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
      const forecastData = await getWeatherForecast(
        weatherData.coord.lat,
        weatherData.coord.lon,
      );

      setSelectedLocation(item.description);
      setForecastData(forecastData);

      navigation.navigate('Dashboard', {
        weatherData,
        selectedLocation: item.description,
        forecastData,
      });
      // await showNotification();
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

          {searchText !== '' &&
            isFlatListVisible &&
            !loading &&
            predictions.length > 0 && (
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  logoInput: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: '15%',
  },
  boxInput: {
    width: '80%',
  },
  boxTitle: {
    alignItems: 'center',
    marginBottom: '10%',
  },
  titleWhite: {
    color: '#fff',
    fontSize: 20,
  },
  titleBlue: {
    color: '#8FB2F5',
  },
  subtitleWhite: {
    color: '#fff',
  },
  input: {
    height: 50,
    paddingLeft: 10,
    paddingRight: 10,
    width: '100%',
    backgroundColor: '#1C1C27',
    borderRadius: 10,
    color: 'rgba(250, 250, 250, 1)',
    justifyContent: 'center',
  },
  suggestionsList: {
    width: '80%',
    maxHeight: 240,
    borderWidth: 1,
    borderColor: '#13131A',
    borderRadius: 10,
    top: 10,
    backgroundColor: 'rgba(59, 59, 84, 1)',
    alignSelf: 'center',
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#13131A',
    height: 60,
    justifyContent: 'center',
  },
  txtList: {
    color: 'rgba(250, 250, 250, 1)',
  },
});

export default Search;
