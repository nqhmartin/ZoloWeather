import React, {useEffect, useState} from 'react';
import {ImageBackground, FlatList, Text, View, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from '@react-native-community/geolocation';
import {dateBuilder, dayBuilder} from '../../Constants/Home';
import {weatherConditions} from '../../Utils/weatherConditions';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
const api = {
  key: '8448982401148b809b855618efd23295',
  base: 'https://api.openweathermap.org/data/2.5/',
};
type Props = {};

const HomeScreen = (props: Props) => {
  const [isLoading, setLoading] = useState(true);
  const [lat, setLat] = useState<any>(13.0881861);
  const [lon, setLon] = useState<any>(109.0928764);
  const [weatherDetails, setWeatherDetails] = useState<any>({});
  const [forecast, setForecast] = useState<any>({});
  let offset = 1;
  const Item = ({title}: any) => {
    return (
      <View style={styles.item}>
        <Text style={styles.day}>{dayBuilder(new Date(), offset++)}</Text>
        <Text style={styles.title}>{title} °C</Text>
      </View>
    );
  };

  // useEffect(() => {
  //   Geolocation.getCurrentPosition(
  //     position => {
  //       setLat(Math.round(position.coords.latitude));
  //       setLon(Math.round(position.coords.longitude));
  //     },
  //     error => {
  //       console.log(error.code, error.message);
  //     },
  //     {
  //       enableHighAccuracy: true,
  //       timeout: 10000,
  //       maximumAge: 10000,
  //     },
  //   );
  // }, []);

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api.key}`,
    )
      .then(res => res.json())
      .then(data => {
        console.log(data);
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
  const renderItem = ({item}: any) => <Item title={item.temp} />;
  const _onPressSearch = (data: any, details: any) => {
    console.log('🚀 ~ file: index.tsx:158 ~ HomeScreen ~ details', details);

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
          source={weatherConditions[weatherDetails.wea]?.background}
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
              styles={{textInput: {color: '#000000'}}}
              placeholder="Nhập tỉnh/thành phố bạn muốn xem"
              onPress={(data, details = null) => _onPressSearch(data, details)}
              query={{
                key: 'AIzaSyAESrmwiHrqo5vs6OzVH6rhPHJV-znp8YA',
                language: 'vi',
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
          <Text style={styles.weatherType}>
            {weatherConditions[weatherDetails?.wea]?.title}
          </Text>
          <FlatList
            style={styles.flatList}
            data={forecast}
            renderItem={renderItem}
            keyExtractor={item => item.key}
            ListFooterComponent={() => <View style={{paddingBottom: 50}} />}
            ListHeaderComponent={() => <View style={{paddingTop: 10}} />}
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
    opacity: 0.9,
    padding: 18,
    marginVertical: 7,
    marginHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: '#FFFFFF',
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
