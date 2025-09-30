import React from 'react';
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from '../ui/modal';
import { Button, ButtonText } from '../ui/button';
import { VStack } from '../ui/vstack';
import { Text } from '../ui/text';
import { Heading } from '../ui/heading';
import { Image } from '../ui/image';
import { Pressable } from '../ui/pressable';
import CloseIC from '../../assets/icons/close.png';
import clsx from 'clsx';
import useBillStore from '../../store/useBillStore';
import { SortOption } from '../../types/types';

interface SortModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SortModal = ({ isOpen, onClose }: SortModalProps) => {
  const { sortOption, setSortOption } = useBillStore();

  const sortOptions: { label: string; value: SortOption; description: string }[] = [
    { label: 'Default', value: 'none', description: 'No sorting applied' },
    { label: 'Tag A-Z', value: 'tag-asc', description: 'Sort by tag alphabetically' },
    { label: 'Tag Z-A', value: 'tag-desc', description: 'Sort by tag reverse alphabetically' },
    { label: 'Paid First', value: 'paid-first', description: 'Show paid bills first' },
    { label: 'Unpaid First', value: 'unpaid-first', description: 'Show unpaid bills first' },
  ];

  const handleOptionSelect = (option: SortOption) => {
    setSortOption(option);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading size="xl" className="text-typography-950">
            Sort Bills
          </Heading>
          <ModalCloseButton>
            <Pressable
              onPress={onClose}
              android_ripple={{
                color: 'rgba(48, 48, 48, 0.32)',
                borderless: false,
              }}
            >
              <Image
                source={CloseIC}
                className={clsx('w-8', 'h-8')}
                alt="Close"
              />
            </Pressable>
          </ModalCloseButton>
        </ModalHeader>
        
        <ModalBody>
          <VStack space="md">
            {sortOptions.map((option) => (
              <Button
                key={option.value}
                className={clsx('p-2', 'rounded-lg')}
                size="md"
                variant={sortOption === option.value ? 'solid' : 'outline'}
                action="primary"
                onPress={() => handleOptionSelect(option.value)}
              >
                <VStack className={clsx('items-start', 'flex-1')}>
                  <ButtonText>
                    {sortOption === option.value ? '✓ ' : ''}{option.label}
                  </ButtonText>
                  <Text 
                    size="sm"
                    className={clsx('text-typography-500')}
                    style={{
                      color: sortOption === option.value ? 'white' : '#6b7280' // Teal-600 or Gray-500
                    }}
                  >
                    {option.description}
                  </Text>
                </VStack>
              </Button>
            ))}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SortModal;