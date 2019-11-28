import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TextStyle,
  ViewStyle,
  TextInput,
  ListRenderItem,
  Button,
} from 'react-native';
import { formatCurrency } from '@wangcch/format-currency';
import { NavigationStackProp } from 'react-navigation-stack';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { CurrencyItem, RatesData, Rates } from '../types';
import CurrencyList from '../CurrencyList.json';
import CurrencyListItem from '../components/CurrencyListItem';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  } as ViewStyle,
  calculatedValueText: {
    color: '#414141',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.7,
  } as TextStyle,
  currencyList: {
    paddingBottom: 20,
  } as ViewStyle,
  input: {
    color: '#212121',
    fontSize: 40,
    fontWeight: '600',
    letterSpacing: 1.5,
    paddingVertical: 25,
    paddingHorizontal: 20,
  } as TextStyle,
  inputContainer: {
    backgroundColor: '#fff',
  } as ViewStyle,
  topContainer: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#fff',
    shadowColor: 'rgb(0, 0, 0)',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    zIndex: 2,
  } as ViewStyle,
  selectedCurrency: {
    borderBottomWidth: 0,
    borderTopWidth: 1,
    borderTopColor: '#e7e7e7',
    backgroundColor: '#fafafa',
  } as ViewStyle,
  emptyContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 30,
  } as ViewStyle,
  errorText: {
    textAlign: 'center',
    fontSize: 16,
  } as TextStyle,
});

interface ExchangeScreenProps {
  navigation: NavigationStackProp;
}

const ExchangeScreen = ({ navigation }: ExchangeScreenProps) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [rates, setRates] = React.useState<Rates>();
  const [price, setPrice] = React.useState('100');
  const [currencyCode, setCurrencyCode] = React.useState('USD');

  const selectedCurrency = React.useMemo(() => {
    return CurrencyList.find(currency => currency.code === currencyCode);
  }, [currencyCode]);

  const currencyList = React.useMemo(() => {
    return CurrencyList.filter(item => item.code !== currencyCode);
  }, [currencyCode, price]);

  const calculate = React.useCallback(
    (currency: CurrencyItem): string => {
      const rate = (rates || {})[currency.code];
      if (rate) {
        const value = rate * parseFloat(price) || 0;
        return formatCurrency(value, {
          decimalDigit: currency.decimal_digits,
          isSegment: false,
        });
      }

      return '0';
    },
    [rates, price]
  );

  const loadRates = React.useCallback(
    async (code: string = currencyCode) => {
      try {
        setError(false);
        setLoading(true);
        const rawData = await fetch(
          `https://api.exchangeratesapi.io/latest?base=${code}`
        );
        const data: RatesData = await rawData.json();

        if (!data || !data.rates) {
          throw new Error('Error load rates');
        }

        setRates(data.rates);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        setError(true);
      }
    },
    [currencyCode]
  );

  const renderCurrencyItem = React.useCallback<ListRenderItem<CurrencyItem>>(
    ({ item, index }) => (
      <CurrencyListItem
        key={index}
        currency={item}
        rightComponent={() => (
          <Text
            style={styles.calculatedValueText}
            numberOfLines={1}
            ellipsizeMode={'tail'}
          >
            {calculate(item)}
          </Text>
        )}
      />
    ),
    [rates, price]
  );

  const handleChangePrice = React.useCallback((text: string) => {
    const price = text.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    if (parseFloat(price) > 1e15) {
      return;
    }

    setPrice(price);
  }, []);

  const hanldeChooseCurrency = React.useCallback((code: string) => {
    setCurrencyCode(code);
    loadRates(code);
  }, []);

  React.useEffect(() => {
    loadRates();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            keyboardType={'numeric'}
            onChangeText={handleChangePrice}
            value={price}
          />
        </View>
        <CurrencyListItem
          onPress={() => {
            navigation.navigate('ChooseCurrency', {
              onChoose: hanldeChooseCurrency,
              selectedCurrencyCode: currencyCode,
            });
          }}
          currency={selectedCurrency}
          style={styles.selectedCurrency}
          rightComponent={() => (
            <Ionicons name={'ios-arrow-down'} size={24} color={'#757575'} />
          )}
        />
      </View>

      {loading && (
        <View style={styles.emptyContainer}>
          <ActivityIndicator />
        </View>
      )}

      {error && (
        <View style={styles.emptyContainer}>
          <Text style={styles.errorText}>Error load rates</Text>
          <Button title={'Retry'} onPress={() => loadRates()} />
        </View>
      )}

      {!loading && !error && (
        <FlatList
          contentContainerStyle={styles.currencyList}
          keyboardDismissMode={'on-drag'}
          data={currencyList}
          keyExtractor={item => item.code}
          renderItem={renderCurrencyItem}
        />
      )}
    </View>
  );
};

export default ExchangeScreen;
