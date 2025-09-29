import clsx from 'clsx';
import { ScrollView, Text } from 'react-native';
import RippleButton from '../btns/RippleButton';
import { HStack } from '../ui/hstack';
import { memo, useState } from 'react';

interface GroupsProps {
    activeGroup: string;
    groups: string[];
    onGroupNamePressed: (group: string) => void;
    onAddGroupPressed: () => void;
    onDeleteGroupPressed: (group: string) => void;
}

const Groups = ({groups, activeGroup, onGroupNamePressed, onAddGroupPressed, onDeleteGroupPressed}: GroupsProps) => {

    const [isDeleteMode, setIsDeleteMode] = useState<{[group: string]: boolean}>({});

    const handleOnPress = (group: string) => {

        // check if there are groups in delete mode
        const isAnyDeleteMode = Object.values(isDeleteMode).some((val) => val);

        if (isDeleteMode[group]) {
            setIsDeleteMode((prev) => {
                return {
                    ...prev,
                    [group]: false,
                };
            });

            return;
        }

        if (isAnyDeleteMode) {
            return;
        }

        onGroupNamePressed(group);
    };

    const handleOnDeletePress = (group: string) => {
        onDeleteGroupPressed(group);

        const deleteModeGrps = {...isDeleteMode};
        delete deleteModeGrps[group];
        setIsDeleteMode(deleteModeGrps);
        
    };

    return (
        <HStack
            space="sm"
            className={
                clsx(
                    'max-h-12',
                    'mt-5',
                )
            }
        >
            <RippleButton
                onPress={onAddGroupPressed}
                className={
                    clsx(
                        'border-[1px]',
                        'border-dashed'
                    )
                }
            >
                <Text>Add Group +</Text>
            </RippleButton>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                <HStack 
                    space="sm"
                    className={
                        clsx(
                            'p-0'
                        )
                    }
                >
                    {groups.map(group => (
                        <RippleButton
                            {...(isDeleteMode[group] ? {
                                onPress: () => handleOnDeletePress(group),
                            } : {
                                onPress: () => handleOnPress(group),
                            })}
                            onLongPress={() => setIsDeleteMode((prev) => ({...prev, [group]: true}))}
                            key={group}
                            className={
                                clsx(
                                    'border-[1px]',
                                    'border-dashed',
                                    isDeleteMode[group] ? 'bg-error-400' : activeGroup === group ? 'bg-secondary-500' : 'bg-primary-500',
                                    'h-12'
                                )
                            }
                        >
                            <HStack 
                                space="sm"
                                className={
                                    clsx(
                                        'items-center',
                                    )
                                }
                            >
                                {isDeleteMode[group] && (
                                    <Text
                                        className={
                                            clsx(
                                                'text-white',
                                                'p-1',
                                                'px-2',
                                                'bg-primary-500',
                                                'rounded-full',
                                                'h-8',
                                            )
                                        }
                                        onPress={() => setIsDeleteMode((prev) => ({...prev, [group]: false}))}
                                    >
                                        {'Cancel'}
                                    </Text>
                                )}
                                <Text 
                                    className={clsx('text-white')}
                                >
                                    {isDeleteMode[group] ? `Delete ${group}` : group}
                                </Text>
                            </HStack>
                        </RippleButton>
                    ))}
                </HStack>
            </ScrollView>
        </HStack>
    );
};

export default memo(Groups);
