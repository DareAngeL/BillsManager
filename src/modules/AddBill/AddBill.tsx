/* eslint-disable react-hooks/exhaustive-deps */
import clsx from 'clsx';
import { SafeAreaView, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/src/types/navigation';
import { useEffect, useState } from 'react';
import { Box } from '../../components/ui/box';
import { FormControl, FormControlError, FormControlErrorText, FormControlLabel, FormControlLabelText } from '../../components/ui/form-control';
import { Input, InputField } from '../../components/ui/input';
import { getBill, getTags, saveBill } from '../../utils/util';
import { Heading } from '../../components/ui/heading';
import { Text } from '../../components/ui/text';
import { Badge, BadgeText } from '../../components/ui/badge';
import { BillData } from '../../types/types';
import { Button, ButtonText } from '../../components/ui/button';
import { nanoid } from 'nanoid/non-secure';
import { Pressable } from '../../components/ui/pressable';

type AddBillProps = NativeStackScreenProps<
    RootStackParamList,
    'AddBill',
    'Stack'
>

const AddBill = ({ navigation, route }: AddBillProps) => {

    const { group, id } = route.params;

    const [bill, setBill] = useState<BillData | null | undefined>({
        id: nanoid(),
        title: '',
        amount: 0,
        tag: '',
        isPaid: false,
    });

    const [tags, setTags] = useState<string[] | undefined>([]);

    const [isOnAddTag, setIsOnAddTag] = useState(false);
    const [isInvalid, setIsInvalid] = useState({
        title: false,
        amount: false,
    });

    useEffect(() => {
        if (route.params?.id) {
            const fetchBill = async () => {
                const _bill = await getBill(group, id);
                setBill(_bill);
            };

            fetchBill();
        }

        const fetchTags = async () => {
            const _tags = await getTags(group);
            // distinct tags
            const tagsSet = new Set(_tags);
            setTags(Array.from(tagsSet));
        };

        fetchTags();
    }, []);

    const handleOnChangeText = (name: keyof BillData, text: string) => {
        setBill((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                [name]: text,
            };
        });
    };

    const handleOnAddTag = () => {
        setIsOnAddTag(true);
    };

    const handleOnChooseTag = (tag: string) => {
        setBill((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                tag,
            };
        });
    }

    const handleSubmit = async () => {
        if (bill?.title === '') {
            setIsInvalid((prev) => ({
                ...prev,
                title: true,
            }));
            return;
        } else {
            setIsInvalid((prev) => ({
                ...prev,
                title: false,
            }));
        }

        if (isNaN(Number(bill?.amount)) || Number(bill?.amount) === 0) {
            setIsInvalid((prev) => ({
                ...prev,
                amount: true,
            }));
            return;
        } else {
            setIsInvalid((prev) => ({
                ...prev,
                amount: false,
            }));
        }

        // Save bill?
        if (!bill) return;

        await saveBill(group, {
            ...bill,
            amount: Number(bill.amount),
        });

        // Go back
        navigation.navigate('Home');
    };

    const renderAddTagMode = () => (
        <FormControl
            size="md"
            isDisabled={false}
            isReadOnly={false}
            isRequired={false}
        >
            <FormControlLabel className={clsx('mt-5')}>
                <FormControlLabelText
                    className={
                        clsx('text-2xl', 'font-interregular')
                    }
                >
                    Tag
                </FormControlLabelText>
            </FormControlLabel>
            <Input
                className={
                    clsx(
                        'rounded-2xl', 
                        'border-primary-400',
                        'h-12',
                    )
                }
                size={'xl'}>
                <InputField
                    className="font-interregular"
                    type="text"
                    placeholder="Enter tag..."
                    value={bill?.tag}
                    onChangeText={(text) => handleOnChangeText('tag', text)}
                />
            </Input>
        </FormControl>
    );

    const renderTags = () => (
        <>
            <Text
                className={
                    clsx('text-lg', 'mt-5')
                }
            >
                Choose a tag:
            </Text>

            <Box
                className={
                    clsx(
                        'flex',
                        'flex-row',
                        'flex-wrap',
                        'mt-3',
                    )
                }
            >
                {tags?.filter(tag => tag !== '').map((tag) => (
                    <Pressable
                        key={tag}
                        onPress={() => handleOnChooseTag(tag)}
                    >
                        <Badge
                            size="xl"
                            variant="solid" 
                            action="muted"
                            className={
                                clsx(
                                    bill?.tag === tag ? 'bg-secondary-500' : 'bg-primary-500',
                                    'rounded-lg', 
                                    'mx-1', 
                                    'my-1'
                                )
                            }
                        >
                            <BadgeText className="color-white">{tag}</BadgeText>
                        </Badge>
                    </Pressable>
                ))}
            </Box>

            {tags?.length === 0 && (
                <Text
                    className={
                        clsx('text-lg', 'text-center')
                    }
                >
                    No tags available
                </Text>
            )}

            <Button
                variant="outline"
                className={
                    clsx('h-12', 'rounded-2xl', 'mx-1', 'my-5', 'border-dashed')
                }
                onPress={handleOnAddTag}
            >
                <ButtonText>Add Tag</ButtonText>
            </Button>
        </>
    )

    return (
        <SafeAreaView 
            className={
                clsx('bg-container-500', 'p-5')
            }
            style={{
                paddingTop: StatusBar.currentHeight,
            }}
        >
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#F2F2F2"
            />

            <Box
                className={
                    clsx(
                        'flex',
                        'h-full',
                        'mt-5',
                    )
                }
            >
                <Heading
                    className={
                        clsx('text-4xl', 'text-center', 'p-5')
                    }
                >
                    {route.params?.id ? 'Edit Bill' : 'Add Bill'}
                </Heading>

                <FormControl
                    isInvalid={isInvalid.title}
                    size="md"
                    isDisabled={false}
                    isReadOnly={false}
                    isRequired={false}
                >
                    <FormControlLabel>
                        <FormControlLabelText
                            className={
                                clsx('text-2xl', 'font-interregular')
                            }
                        >
                            Title
                        </FormControlLabelText>
                    </FormControlLabel>
                    <Input
                        className={
                            clsx(
                                'rounded-2xl', 
                                'border-primary-400',
                                'h-12',
                            )
                        }
                        size={'xl'}>
                        <InputField
                            className="font-interregular"
                            type="text"
                            placeholder="Enter title..."
                            value={bill?.title}
                            onChangeText={(text) => handleOnChangeText('title', text)}
                        />
                    </Input>
                    <FormControlError>
                        <FormControlErrorText>
                            Title is required
                        </FormControlErrorText>
                    </FormControlError>

                </FormControl>

                <FormControl
                    isInvalid={isInvalid.amount}
                    size="md"
                    isDisabled={false}
                    isReadOnly={false}
                    isRequired={false}
                >
                    <FormControlLabel className={clsx('mt-5')}>
                        <FormControlLabelText
                            className={
                                clsx('text-2xl', 'font-interregular')
                            }
                        >
                            Amount
                        </FormControlLabelText>
                    </FormControlLabel>
                    <Input
                        className={
                            clsx(
                                'rounded-2xl', 
                                'border-primary-400',
                                'h-12',
                            )
                        }
                        size={'xl'}>
                        <InputField
                            className="font-interregular"
                            type="text"
                            placeholder="Enter amount..."
                            value={bill?.amount.toString()}
                            onChangeText={(text) => handleOnChangeText('amount', text)}
                        />
                    </Input>
                    <FormControlError>
                        <FormControlErrorText>
                            Amount is required; and must be greater than 0; and must be a number.
                        </FormControlErrorText>
                    </FormControlError>
                </FormControl>

                {isOnAddTag ? (
                    renderAddTagMode()
                ) : (
                    renderTags()
                )}

                <Button
                    variant="solid"
                    className={
                        clsx('h-12', 'rounded-2xl', 'mx-1', 'mt-5', 'border-dashed')
                    }
                    onPress={handleSubmit}
                >
                    <ButtonText>Save Bill</ButtonText>
                </Button>

                <Button
                    variant="solid"
                    className={
                        clsx('h-12', 'rounded-2xl', 'mx-1', 'my-5', 'border-dashed', 'bg-secondary-500')
                    }
                    onPress={() => navigation.goBack()}
                >
                    <ButtonText>Go Back</ButtonText>
                </Button>
            </Box>
        </SafeAreaView>
    );
}

export default AddBill;
