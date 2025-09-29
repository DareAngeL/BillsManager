import clsx from 'clsx';
import { Box } from '../ui/box';
import { memo } from 'react';
import { Text } from '../ui/text';
import { HStack } from '../ui/hstack';
import { Image } from '../ui/image';
import TAGDARKIC from '../../assets/icons/tag-dark.png';
import TAGLIGHTIC from '../../assets/icons/tag-light.png';
import { VStack } from '../ui/vstack';
import { Pressable } from '../ui/pressable';

interface BillCardProps {
    title: string;
    tag: string;
    amount: string;
    isPaid?: boolean;
    isSelected?: boolean;
    onPress?: () => void;
}

const BillCard = ({ amount, tag, title, isPaid, isSelected, onPress }: BillCardProps) => {

    return (
        <Box
            className={
                clsx(
                    'my-1',
                    'border-solid',
                    'border-[1px]',
                    'border-primary-500',
                    isSelected ? 'bg-gray-300' : isPaid ? 'bg-primary-500' : 'bg-transparent',
                    'w-full',
                    'rounded-3xl',
                    'overflow-hidden',
                )
            }
        >
            <Pressable
                android_ripple={{
                    color: 'rgba(48, 48, 48, 0.32)',
                    borderless: false,
                }}
                className={
                    clsx(
                        'p-5',
                        'overflow-hidden',
                    )
                }
                onPress={onPress}
            >
                <HStack>
                    <VStack
                        className={clsx('flex-1')}
                    >
                        <Text
                            className={clsx(
                                'text-2xl',
                                isPaid ? 'color-white' : 'color-primary-500',
                            )}
                        >
                            {title}
                        </Text>

                        <HStack
                            className={clsx('ms-3', 'items-center', 'mt-2')}
                            space="sm"
                        >
                            {!isPaid ? (
                                <Image
                                    source={TAGDARKIC}
                                    className={clsx('w-10', 'h-10')}
                                    alt="tag"
                                />
                            ) : (
                                <Image
                                    source={TAGLIGHTIC}
                                    className={clsx('w-10', 'h-10')}
                                    alt="tag"
                                />
                            )}

                            <Text
                                className={clsx('text-lg', tag === '' && !isPaid ? 'color-gray-500' : 'color-secondary-500')}
                            >
                                {tag === '' ? 'Untagged' : tag}
                            </Text>

                        </HStack>
                    </VStack>

                    <Box
                        className={clsx('flex-1', 'items-end', 'justify-center')}
                    >
                        {!isPaid ? (
                            <Text
                                className={clsx('text-2xl')}
                            >
                                ₱{amount}
                            </Text>
                        ) : (
                            <Text
                                className={clsx('text-2xl', 'color-secondary-500', 'font-bold')}
                            >
                                Paid
                            </Text>
                        )}
                    </Box>
                </HStack>
            </Pressable>
        </Box>
    );
};

export default memo(BillCard);
