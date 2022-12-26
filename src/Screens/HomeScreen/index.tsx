import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  FlatList,
  Text,
  View,
  StyleSheet,
  StatusBar,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from '@react-native-community/geolocation';
import {dateBuilder, dayBuilder} from '../../Constants/Home';
import {useNavigation} from '@react-navigation/native';
import {weatherConditions} from '../../Utils/weatherConditions';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
const api = {
  key: '8448982401148b809b855618efd23295',
  base: 'https://api.openweathermap.org/data/2.5/',
};
type Props = {};

const HomeScreen = (props: Props) => {
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState(true);
  const [lat, setLat] = useState<any>(16.04140978473951);
  const [lon, setLon] = useState<any>(108.14678398698533);
  const [weatherDetails, setWeatherDetails] = useState<any>({});

  const [forecast, setForecast] = useState<any>({});

  let offset = 1;
  const Item = ({title}: any) => (
    <View style={styles.item}>
      <Text style={styles.day}>{dayBuilder(new Date(), offset++)}</Text>
      <Text style={styles.title}>{title} °C</Text>
    </View>
  );

  const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api.key}`;
  useEffect(() => {
    fetch(URL)
      .then(res => res.json())
      .then(data => {
        setWeatherDetails({
          temp: Math.round(data.main.temp),
          wea: data.weather[0].main,
          city: data.name,
          country: data.sys.country,
        });
      })
      .catch(err => {
        console.log('error', err);
      });
    fetch(
      `${api.base}forecast?lat=${lat}&lon=${lon}&units=metric&APPID=${api.key}`,
    )
      .then(res => res.json())
      .then(result => {
        setLoading(false);
        let forecast_: any[] = [];
        for (let index = 7, k = 1; index < result.cnt; index += 8, k++) {
          let data = {
            key: k,
            temp: Math.round(result.list[index].main.temp),
            wea: result.list[index].weather[0].main,
          };
          forecast_.push(data);
        }
        setForecast(forecast_);
      });
  }, [lat, lon]);
  const search = () => {
    setLoading(true);
    fetch(
      `${api.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${api.key}` +
        process.env.REACT_APP_GOOGLE_API_KEY,
    )
      .then(res => res.json())
      .then(result => {
        console.log(result);
        if (result.name !== null) {
          setWeatherDetails({
            temp: Math.round(result.main.temp),
            wea: result.weather[0].main,
            city: result.name,
            country: result.sys.country,
          });
        } else {
          navigation.navigate('Home');
        }
      });
    fetch(
      `${api.base}forecast?lat=${lat}&lon=${lon}&units=metric&APPID=${api.key}`,
    )
      .then(res => res.json())
      .then(result => {
        setLoading(false);
        let forecast_: any[] = [];
        for (let index = 7, k = 1; index < result.cnt; index += 8, k++) {
          let data = {
            key: k,
            temp: Math.round(result.list[index].main.temp),
            wea: result.list[index].weather[0].main,
          };
          forecast_.push(data);
        }
        setForecast(forecast_);
      });
  };
  const renderItem = ({item}: any) => <Item title={item.temp} />;

  const _onPressSearch = (data: any, details: any) => {
    setLat(details.geometry.location.lat);
    setLon(details.geometry.location.lng);
  };
  if (isLoading) {
    return (
      <View style={styles.container}>
        <LottieView
          source={require('../anim/loader_animation.json')}
          autoPlay
          loop
        />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <ImageBackground
          style={[
            styles.background,
            {backgroundColor: weatherConditions[weatherDetails.wea]?.color},
          ]}>
          <View
            style={{
              position: 'absolute',
              top: 20,
              left: 20,
              width: '90%',
              zIndex: 1000,
            }}>
            <GooglePlacesAutocomplete
              placeholder="Nhập nơi bạn muốn xem"
              onPress={(data, details = null) => _onPressSearch(data, details)}
              query={{
                key: 'AIzaSyAESrmwiHrqo5vs6OzVH6rhPHJV-znp8YA',
                language: 'en',
              }}
              fetchDetails
            />
          </View>
          <Text style={styles.date}>{dateBuilder(new Date())}</Text>
          <Icon
            style={styles.icon}
            name={
              weatherDetails.wea === undefined
                ? 'circle-off-outline'
                : weatherConditions[weatherDetails.wea]?.icon
            }
            size={80}
            color={'white'}
          />

          <Text style={styles.temperature}>{weatherDetails.temp}°C</Text>
          <Text style={styles.location}>
            {weatherDetails?.city}, {weatherDetails?.country}
          </Text>
          <Text style={styles.weatherType}>{weatherDetails?.wea}</Text>
          <FlatList
            style={styles.flatList}
            data={forecast}
            renderItem={renderItem}
            keyExtractor={item => item.key}
          />
        </ImageBackground>
      </View>
    );
  }
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: StatusBar.currentHeight || 0,
  },
  date: {
    marginTop: 100,
    fontSize: 30,
    fontWeight: '300',
    marginBottom: 10,
  },
  icon: {
    marginTop: 10,
  },
  button: {
    width: '50%',
    height: 50,
    marginBottom: 50,
    backgroundColor: 'gold',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
    shadowColor: 'black',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '300',
    color: 'black',
  },
  temperature: {
    fontSize: 62,
    fontWeight: '100',
    margin: 5,
    marginTop: 20,
  },
  location: {
    fontSize: 16,
    fontWeight: '200',
    marginBottom: 10,
  },
  weatherType: {
    fontSize: 34,
    fontWeight: '500',
  },
  flatList: {
    width: '100%',
    marginTop: 50,
  },
  item: {
    backgroundColor: 'white',
    opacity: 0.9,
    padding: 18,
    marginVertical: 7,
    marginHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
  },
  day: {
    fontSize: 20,
    fontFamily: 'Arial',
    marginRight: '0%',
    fontWeight: '200',
  },
  input: {
    borderWidth: 1,
    borderColor: '#666',
    height: 40,
    marginVertical: 20,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  background: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  searchButton: {
    width: '100%',
    height: 50,
    marginBottom: 200,
    backgroundColor: '#fcf',
  },
});
