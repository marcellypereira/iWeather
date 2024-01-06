import React from 'react';
import { View, Text, ImageBackground, Image, ScrollView } from 'react-native';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import styles from './styles';

const Dashboard = ({ route }) => {
  const { weatherData, selectedLocation, forecastData } = route.params;

  const getFormattedDate = () => {
    const currentDate = new Date();
    return format(currentDate, "EEEE, d 'de' MMMM 'de' yyyy", {
      locale: pt,
    });
  };

  const getWeatherImage = () => {
    const weatherCondition = weatherData.weather[0]?.main.toLowerCase();
    const isNight = weatherData.weather[0]?.icon.includes('n');

    const imagePaths = {
      clear: isNight ? require('../../../assets/clear-night.png') : require('../../../assets/clear-day.png'),
      rain: isNight ? require('../../../assets/rain-night.png') : require('../../../assets/rain-day.png'),
      clouds: isNight ? require('../../../assets/cloudy-night.png') : require('../../../assets/cloudy-day.png'),
      'few clouds': isNight ? require('../../../assets/fewClouds-night.png') : require('../../../assets/fewClouds-day.png'),
      storm: isNight ? require('../../../assets/storm-night.png') : require('../../../assets/storm-day.png'),
    };

    return imagePaths[weatherCondition] || require('../../../assets/clear-day.png');
  };

  const getWeatherIcon = (weatherCondition) => {
    const isNight = weatherCondition?.icon.includes('n');
    const iconPaths = {
      clear: isNight ? require('../../../assets/IconClearNight.png') : require('../../../assets/IconClearDay.png'),
      rain: isNight ? require('../../../assets/IconRainNight.png') : require('../../../assets/IconRainDay.png'),
      clouds: isNight ? require('../../../assets/IconCloudyNight.png') : require('../../../assets/IconCloudyDay.png'),
      'few clouds': isNight ? require('../../../assets/IconFewcloudsNight.png') : require('../../../assets/IconFewcloudsDay.png'),
      storm: isNight ? require('../../../assets/IconStormNight.png') : require('../../../assets/IconStormDay.png'),
    };

    return iconPaths[weatherCondition?.main.toLowerCase()] || require('../../../assets/IconClearDay.png');
  };

  const getFeelsLikeRange = () => {
    const feelsLikeHigh = Math.round(weatherData.main?.feels_like);
    const feelsLikeLow = Math.round((weatherData.main?.feels_like || 0) - 2);
    return `${feelsLikeLow}°C / ${feelsLikeHigh}°C`;
  };

  return (
    <ScrollView style={styles.containerDash}>
      <View style={styles.condicoesTempo}>
        <ImageBackground
          style={styles.backgroundImage}
          source={getWeatherImage(weatherData.weather[0])}
          resizeMode="cover"
          borderRadius={10}
        >
          <View style={styles.viewInfosImg}>
            <View style={styles.localDay}>
              <Text style={styles.local}>{selectedLocation}</Text>
              <Text style={styles.day}>{getFormattedDate()}</Text>
            </View>
            <View style={styles.description}>
              <View style={styles.descriptionTxt}>
                <Text style={styles.temperatura}>
                  {Math.round(weatherData.main?.temp)}°C
                </Text>
                <Text style={styles.sensacao}>{getFeelsLikeRange(weatherData)}</Text>
                <Text style={styles.tempo}>
                  {weatherData.weather[0]?.description}
                </Text>
              </View>
              <View style={styles.iconTemp}>
                <Image style={styles.icons} source={getWeatherIcon(weatherData.weather[0])} />
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.condicoesTempo}>
        {[
          {
            icon: require('../../../assets/Icon-sensacao.png'),
            title: 'Sensação Térmica',
            value: `${Math.round(weatherData.main?.feels_like)}°C`,
          },
          {
            icon: require('../../../assets/Icon-probabilidade.png'),
            title: 'Probabilidade de Chuva',
            value: weatherData.rain ? `${weatherData.rain['1h']}%` : 'N/A',
          },
          {
            icon: require('../../../assets/vento.png'),
            title: 'Velocidade do Vento',
            value: weatherData.wind ? `${Math.round(weatherData.wind.speed)} km/h` : 'N/A',
          },
          {
            icon: require('../../../assets/Icon-umidade.png'),
            title: 'Umidade do Ar',
            value: weatherData.main ? `${weatherData.main.humidity}%` : 'N/A',
          },
          {
            icon: require('../../../assets/Icon-UV.png'),
            title: 'Índice UV',
            value: weatherData.uv ? weatherData.uv : 'N/A',
          },
        ].map((item, index) => (
          <View key={index} style={styles.viewList}>
            <View style={styles.viewListCont}>
              <Image style={styles.viewListContImg} source={item.icon} />
              <Text style={styles.viewListContText}>{item.title}</Text>
            </View>
            <Text style={styles.viewListContText}>{item.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.condicoesTempoUlt}>
        {forecastData && forecastData.length > 0 && (
          <View style={styles.condicoesTempoProb}>
            {forecastData.map((day, index) => (
              <View key={index} style={styles.probTemp}>
                <View style={styles.viewTempDay}>
                  <Text style={styles.diaSemana}>
                    {format(new Date(day.dt_txt), 'EEEE', { locale: pt })}
                  </Text>
                  <View>
                    <Image
                      style={styles.iconsProb}
                      source={getWeatherIcon(day.weather[0])}
                    />
                  </View>
                  <View style={styles.temperaturas}>
                    <Text style={styles.temperaturaMax}>
                      {Math.round(day.main?.temp_max)}°C
                    </Text>
                    <Text style={styles.temperaturaMin}>
                      {Math.round(day.main?.temp_min)}°C
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Dashboard;
