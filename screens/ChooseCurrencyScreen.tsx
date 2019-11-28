import * as React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { NavigationStackProp } from 'react-navigation-stack';
import { Ionicons } from '@expo/vector-icons';
import CurrencyList from '../CurrencyList.json';
import CurrencyListItem from '../components/CurrencyListItem';

type Navigation = NavigationStackProp<{}, {
  selectedCurrencyCode: string;
  onChoose: (code: string) => void;
}>;

interface ChooseCurrencyScreenProps {
  navigation: Navigation;
}

const ChooseCurrencyScreen = ({ navigation }: ChooseCurrencyScreenProps) => {
  const selectedCurrencyCode = navigation.getParam('selectedCurrencyCode');
  const onChoose = navigation.getParam('onChoose');

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        keyboardDismissMode={'on-drag'}
        data={CurrencyList}
        keyExtractor={item => item.code}
        renderItem={({ item, index }) => (
          <CurrencyListItem
            onPress={() => {
              onChoose(item.code);
              navigation.goBack();
            }}
            key={index}
            currency={item}
            rightComponent={() => (
              <Ionicons
                name={
                  selectedCurrencyCode !== item.code
                    ? 'ios-checkmark-circle-outline'
                    : 'ios-checkmark-circle'
                }
                size={24}
                color={'#007BFF'}
              />
            )}
          />
        )}
      />
    </View>
  );
};

ChooseCurrencyScreen.navigationOptions = ({ navigation }: { navigation: Navigation; }) => ({
  title: 'Choose currency',
  headerLeftContainerStyle: {
    paddingLeft: 16,
  },
  headerLeft: () => (
    <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.goBack()}>
      <Ionicons name={'ios-close'} size={34} color={'#212121'} />
    </TouchableOpacity>
  ),
});

export default ChooseCurrencyScreen;
