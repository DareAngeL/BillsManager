import React from 'react';
import { Text } from '../ui/text';
import clsx from 'clsx';
import { HStack } from '../ui/hstack';
import RippleButton from '../btns/RippleButton';

interface FilterIconProps {
  onPress: () => void;
  isActive?: boolean;
}

const FilterIcon = ({ onPress, isActive }: FilterIconProps) => {
  return (
    <RippleButton
      onPress={onPress}
      className={clsx('mt-5')}
    >
      <HStack 
        space="xs" 
        className={clsx('items-center', 'justify-center')}
      >
        {/* Simple filter icon using text characters */}
        <Text 
          className={clsx(
            'text-xl',
            'font-bold',
            isActive ? 'color-primary-500' : 'color-gray-600'
          )}
        >
          ☰
        </Text>
        <Text 
          className={clsx(
            'text-sm',
            isActive ? 'color-primary-500' : 'color-gray-600'
          )}
        >
          Sort
        </Text>
        {isActive && (
          <Text 
            className={clsx(
              'text-2xl',
              'color-primary-500',
              'font-bold',
              'color-secondary-500',
            )}
          >
            •
          </Text>
        )}
      </HStack>
    </RippleButton>
  );
};

export default FilterIcon;