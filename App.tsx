import * as React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import ExchangeScreen from './screens/ExchangeScreen';
import ChooseCurrencyScreen from './screens/ChooseCurrencyScreen';

const navigationOptions = {
  defaultNavigationOptions: {
    header: null,
  },
};

const MainStack = createStackNavigator({ ExchangeScreen }, navigationOptions);
const RootStack = createAppContainer(
  createStackNavigator(
    {
      Main: {
        screen: MainStack,
        navigationOptions: { header: null },
      },
      ChooseCurrency: {
        screen: ChooseCurrencyScreen,
        navigationOptions: {
          headerStyle: { borderBottomWidth: 0 },
        },
      },
    },
    { mode: 'modal' }
  )
);

const App = () => {
  return <RootStack />;
};

export default App;
