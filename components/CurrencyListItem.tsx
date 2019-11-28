import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextStyle,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { CurrencyItem } from '../types';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  } as ViewStyle,
  currencyItem: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomColor: '#e7e7e7',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  codeWrapper: {
    flexDirection: 'row',
    marginBottom: 10,
  } as ViewStyle,
  codeText: {
    color: '#212121',
    fontSize: 22,
    fontWeight: '600',
  } as TextStyle,
  symbolText: {
    marginLeft: 5,
    color: '#9a9a9a',
    fontSize: 22,
  } as TextStyle,
  nameText: {
    color: '#656565',
    fontSize: 16,
    fontWeight: '500',
  } as TextStyle,
});

interface CurrencyListItemProps {
  currency: CurrencyItem;
  rightComponent?: () => React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

const CurrencyListItem = React.memo<CurrencyListItemProps>(
  ({ currency, rightComponent, style, onPress }) => (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.currencyItem}
        disabled={!onPress}
        activeOpacity={0.6}
        onPress={onPress}
      >
        <View style={{ flex: 1, marginRight: 10 }}>
          <View style={styles.codeWrapper}>
            <Text
              style={styles.codeText}
              numberOfLines={1}
              ellipsizeMode={'tail'}
            >
              {currency.code}
            </Text>
            <Text
              style={styles.symbolText}
              numberOfLines={1}
              ellipsizeMode={'tail'}
            >
              {currency.symbol}
            </Text>
          </View>
          <Text
            style={styles.nameText}
            numberOfLines={1}
            ellipsizeMode={'tail'}
          >
            {currency.name}
          </Text>
        </View>

        {rightComponent && rightComponent()}
      </TouchableOpacity>
    </View>
  )
);

export default CurrencyListItem;
