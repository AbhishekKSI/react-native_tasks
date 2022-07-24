import React from 'react';
import {ActivityIndicator} from 'react-native';

export const COLORS = {
  primaryButton: '#2196F3',
  white: '#ffffff',
  borderColor: '#80DEEA',
  red: '#DD2C00',
  grey: '#90A4AE',
  black: '#000000',
};

export const Loader = ({isLoading}) => {
  return isLoading ? (
    <ActivityIndicator
      size={'large'}
      color={COLORS.primaryButton}
      animating={true}
    />
  ) : null;
};
