import Constants from 'expo-constants';

// load extra config from the app.json file
const extra = Constants.manifest?.extra ?? {};

export default {
  // use 10.0.2.2 for Android to connect to host machine
  apiUrl: 'https://8080-maximiliano-reactnative-9pho09dfqpu.ws-us45.gitpod.io/',
  // use fixtures instead of real API requests
  useFixtures: false,
  // debug mode
  debugMode: __DEV__,
  extra,
};
