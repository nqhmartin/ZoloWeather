import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';

type Props = {};
const API_KEY = 'c22cb714942332e46ea3e08e8d5123a1';
const GOOGLE_KEY = 'AIzaSyAESrmwiHrqo5vs6OzVH6rhPHJV-znp8YA';
const App = (props: Props) => {
  const [toggleSearch, setToggleSearch] = useState('city');
  const [city, setCity] = useState('Toronto');
  const [postalCode, setPostalCode] = useState('L4W1S9');
  const [lat, setLat] = useState(43.6532);
  const [long, setLong] = useState(-79.3832);
  const [weather, setWeather] = useState({});
  console.log(weather);
  const controller = new AbortController();
  const signal = controller.signal;

  //fetch lat long by city
  const fetchLatLongHandler = () => {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${API_KEY}`,
    )
      .then(res => res.json())
      .then(data => {
        setLat(data.coord.lat);
        setLong(data.coord.lon);
      });
  };

  //fetch lat long by postal code/zip since OpenWeather Api only accepts zips
  const fetchByPostalHandler = () => {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?key=${GOOGLE_KEY}&components=postal_code:${postalCode}`,
    )
      .then(res => res.json())
      .then(data => {
        setLat(data.results[0].geometry.location.lat);
        setLong(data.results[0].geometry.location.lng);
      });
  };

  //updates the weather when lat long changes
  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`,
      {signal},
    )
      .then(res => res.json())
      .then(data => {
        setWeather(data);
      })
      .catch(err => {
        console.log('error', err);
      });
    return () => controller.abort();
  }, [lat, long]);
  return (
    <View>
      <Text>App</Text>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({});
