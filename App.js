import React, {useEffect} from 'react';
import StackNavigation from './app/navigation/StackNavigation';
import LottieSplashScreen from 'react-native-lottie-splash-screen';

const App = () => {
  useEffect(() => {
    LottieSplashScreen.hide();
  }, []);
  return <StackNavigation />;
};

export default App;
