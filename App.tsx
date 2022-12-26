import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Navigator from './src/Navigator';

type Props = {};
const API_KEY = '8448982401148b809b855618efd23295';
const App = (props: Props) => {
  // const [toggleSearch, setToggleSearch] = useState('city');
  // const [city, setCity] = useState('Toronto');
  // const [postalCode, setPostalCode] = useState('L4W1S9');
  // const [lat, setLat] = useState(43.6532);
  // const [long, setLong] = useState(-79.3832);
  // const [weather, setWeather] = useState({});
  // const controller = new AbortController();
  // const signal = controller.signal;

  // //updates the weather when lat long changes
  // const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=${API_KEY}`;
  // useEffect(() => {
  //   fetch(URL, {signal})
  //     .then(res => res.json())
  //     .then(data => {
  //       setWeather(data);
  //     })
  //     .catch(err => {
  //       console.log('error', err);
  //     });
  //   return () => controller.abort();
  // }, [lat, long]);
  return <Navigator />;
};

export default App;

const styles = StyleSheet.create({});
