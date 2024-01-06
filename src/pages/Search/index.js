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
import { getPlaceDetails, getWeatherInfo, getWeatherForecast, getPlacePredictions } from '../../../services/services'

const Search = () => {
  const navigation = useNavigation();

  const [searchText, setSearchText] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFlatListVisible, setFlatListVisibility] = useState(false);

  let searchTimeout;

  const handlePredictionSelection = async (item) => {
    setSearchText(item.description);
    setPredictions([]);
    setLoading(true);

    try {
      const placeDetails = await getPlaceDetails(item.place_id);
      const weatherData = await getWeatherInfo(placeDetails.geometry.location.lat, placeDetails.geometry.location.lng);
      const forecastData = await getWeatherForecast(placeDetails.geometry.location.lat, placeDetails.geometry.location.lng);

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
                  setLoading(true);

                  clearTimeout(searchTimeout);

                  searchTimeout = setTimeout(async () => {
                    try {
                      const predictionsData = await getPlacePredictions(text);
                      setPredictions(predictionsData);
                      setFlatListVisibility(!!text && predictionsData.length > 0);
                    } catch (error) {
                      console.error('Erro ao obter previsões de lugares:', error);
                    } finally {
                      setLoading(false);
                    }
                  }, 500);
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