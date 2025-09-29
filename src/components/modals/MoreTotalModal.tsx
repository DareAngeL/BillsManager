import { Modal, ModalBackdrop, ModalBody, ModalContent, ModalFooter, ModalHeader } from '../ui/modal';
import { Text } from '../ui/text';
import { Button, ButtonText } from '../ui/button';
import { VStack } from '../ui/vstack';
import { BillData } from '../../types/types';
import { useMemo } from 'react';
import { Heading } from '../ui/heading';
import clsx from 'clsx';
import { Box } from '../ui/box';

interface MoreTotalProps {
    bills: BillData[];
    title: string;
    isOpen: boolean;
    onClosed: () => void;
    onPositivePressed: () => void;
}

interface TotalByTag {
    [key: string]: number;
}

const MoreTotalModal = ({ bills, isOpen, onClosed, onPositivePressed, title }: MoreTotalProps) => {

    const totals = useMemo(() => {
        return bills?.reduce<TotalByTag>((acc, curr) => {

            if (curr.tag === '') {
                acc.Untagged = acc.Untagged ? acc.Untagged + curr.amount : curr.amount;
                return acc;
            }

            if (acc[curr.tag]) {
                acc[curr.tag] += curr.amount;
            } else {
                acc[curr.tag] = curr.amount;
            }

            return acc;
        }, {});
    }, [bills]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClosed}
            size="md"
        >
            <ModalBackdrop />
            <ModalContent>
                <ModalHeader>
                    <Heading size="xl" className="text-typography-950">
                        {title}
                    </Heading>
                </ModalHeader>
                <ModalBody>
                    <VStack>
                        {Object.keys(totals).map(tag => (
                            <Text key={tag} size="2xl" className="text-typography-500">
                                {tag} Total: ₱{totals[tag].toLocaleString()}
                            </Text>
                        ))}
                        <Box 
                            className={
                                clsx(
                                    'border-dashed',
                                    'border-b-[1px]',
                                    'border-primary-100',
                                    'w-full',
                                    'my-5',
                                )
                            }
                        />
                        <Text size="2xl" className="text-typography-500">
                            All Total: ₱{bills.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                        </Text>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button
                        onPress={onPositivePressed}
                    >
                        <ButtonText>Close</ButtonText>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default MoreTotalModal;
