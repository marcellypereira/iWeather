import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

const Dashboard = ({ route }) => {
  const { weatherData, selectedLocation, forecastData } = route.params;

  const getFormattedDate = () => {
    const currentDate = new Date();
    return format(currentDate, "EEEE, d 'de' MMMM 'de' yyyy", {
      locale: pt,
    });
  };

  const getWeatherImage = () => {
    const weatherCondition = weatherData.weather[0].main.toLowerCase();
    const isNight = weatherData.weather[0].icon.includes('n');

    switch (weatherCondition) {
      case 'clear':
        return isNight
          ? require('../../../assets/clear-night.png')
          : require('../../../assets/clear-day.png');
      case 'rain':
        return isNight
          ? require('../../../assets/rain-night.png')
          : require('../../../assets/rain-day.png');
      case 'clouds':
        return isNight
          ? require('../../../assets/cloudy-night.png')
          : require('../../../assets/cloudy-day.png');
      case 'few clouds':
        return isNight
          ? require('../../../assets/fewClouds-night.png')
          : require('../../../assets/fewClouds-day.png');
      case 'storm':
        return isNight
          ? require('../../../assets/storm-night.png')
          : require('../../../assets/storm-day.png');
      default:
        return require('../../../assets/clear-day.png');
    }
  };

  const getWeatherIconForDay = (weatherCondition) => {
    const isNight = weatherCondition.icon.includes('n');

    switch (weatherCondition.main.toLowerCase()) {
      case 'clear':
        return isNight
          ? require('../../../assets/IconClearNight.png')
          : require('../../../assets/IconClearDay.png');
      case 'rain':
        return isNight
          ? require('../../../assets/IconRainNight.png')
          : require('../../../assets/IconRainDay.png');
      case 'clouds':
        return isNight
          ? require('../../../assets/IconCloudyNight.png')
          : require('../../../assets/IconCloudyDay.png');
      case 'few clouds':
        return isNight
          ? require('../../../assets/IconFewcloudsNight.png')
          : require('../../../assets/IconFewcloudsDay.png');
      case 'storm':
        return isNight
          ? require('../../../assets/IconStormNight.png')
          : require('../../../assets/IconStormDay.png');
      default:
        return require('../../../assets/IconClearDay.png');
    }
  };
  const getWeatherIcon = () => {
    const weatherCondition = weatherData.weather[0].main.toLowerCase();
    const isNight = weatherData.weather[0].icon.includes('n');

    switch (weatherCondition) {
      case 'clear':
        return isNight
          ? require('../../../assets/IconClearNight.png')
          : require('../../../assets/IconClearDay.png');
      case 'rain':
        return isNight
          ? require('../../../assets/IconRainNight.png')
          : require('../../../assets/IconRainDay.png');
      case 'clouds':
        return isNight
          ? require('../../../assets/IconCloudyNight.png')
          : require('../../../assets/IconCloudyDay.png');
      case 'few clouds':
        return isNight
          ? require('../../../assets/IconFewcloudsNight.png')
          : require('../../../assets/IconFewcloudsDay.png');
      case 'storm':
        return isNight
          ? require('../../../assets/IconStormNight.png')
          : require('../../../assets/IconStormDay.png');
      default:
        return require('../../../assets/IconClearDay.png');
    }
  };

  const getFeelsLikeRange = () => {
    const feelsLikeHigh = Math.round(weatherData.main.feels_like);
    const feelsLikeLow = Math.round(weatherData.main.feels_like - 2);
    return `${feelsLikeLow}°c / ${feelsLikeHigh}°c`;
  };

  return (
    <ScrollView style={styles.containerDash}>
      <View style={styles.condicoesTempo}>
        <ImageBackground
          style={styles.backgroundImage}
          source={getWeatherImage()}
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
                  {Math.round(weatherData.main.temp)}°c
                </Text>
                <Text style={styles.sensação}>{getFeelsLikeRange()}</Text>
                <Text style={styles.tempo}>
                  {weatherData.weather[0].description}
                </Text>
              </View>
              <View style={styles.iconTemp}>
                <Image style={styles.icons} source={getWeatherIcon()} />
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
            value: `${Math.round(weatherData.main.feels_like)}°C`,
          },
          {
            icon: require('../../../assets/Icon-probabilidade.png'),
            title: 'Probabilidade de Chuva',
            value: weatherData.rain ? `${weatherData.rain['1h']}%` : 'N/A',
          },
          {
            icon: require('../../../assets/vento.png'),
            title: 'Velocidade do Vento',
            value: weatherData.wind
              ? `${Math.round(weatherData.wind.speed)} km/h`
              : 'N/A',
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
                      source={getWeatherIconForDay(day.weather[0])}
                    />
                  </View>
                  <View style={styles.temperaturas}>
                    <Text style={styles.temperaturaMax}>
                      {Math.round(day.main.temp_max)}°C
                    </Text>
                    <Text style={styles.temperaturaMin}>
                      {Math.round(day.main.temp_min)}°C
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

const styles = StyleSheet.create({
  containerDash: {
    flex: 1,
    backgroundColor: '#13131A',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    padding: 10,
  },
  condicoesTempo: {
    backgroundColor: '#1C1C27',
    padding: 12,
    borderRadius: 10,
    margin: 5,
  },
  backgroundImage: {
    width: '100%',
  },
  viewInfosImg: {
    padding: 10,
  },
  localDay: {
    gap: 3,
    marginBottom: '15%',
  },
  local: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  day: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '200',
  },
  description: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  descriptionTxt: {
    alignItems: 'flex-start',
  },
  temperatura: {
    color: '#fff',
    fontSize: 50,
    fontWeight: 'bold',
  },
  sensação: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 10,
  },
  tempo: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '200',
  },
  icons: {
    resizeMode: 'contain',
  },
  viewList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    borderBottomWidth: 0.2,
    paddingVertical: 9,
    borderColor: '#383854',
  },
  viewListCont: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewListContText: {
    color: 'rgba(191, 191, 212, 1)',
    fontWeight: '500',
    fontSize: 17,
  },
  viewListContImg: {
    marginRight: 10,
  },
  condicoesTempoUlt: {
    backgroundColor: '#1C1C27',
    padding: 12,
    borderRadius: 10,
    margin: 5,
    marginBottom: 50,
  },
  condicoesTempoProb: {
    flexDirection: 'row',
    alignSelf: 'center',
    paddingVertical: 10,
  },

  viewTempDay: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  diaSemana: {
    color: 'rgba(191, 191, 212, 1)',
  },
  iconsProb: {
    maxWidth: 100,
    maxHeight: 100,
  },
  temperaturas: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  temperaturaMax: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  temperaturaMin: {
    color: 'rgba(191, 191, 212, 1)',
    fontSize: 17,
    fontWeight: '300',
  },
});

export default Dashboard;
