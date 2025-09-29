import { Button, ButtonText } from '../ui/button';
import { Heading } from '../ui/heading';
import { Image } from '../ui/image';
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from '../ui/modal';
import { Text } from '../ui/text';
import CloseIC from '../../assets/icons/close.png';
import clsx from 'clsx';
import { Pressable } from '../ui/pressable';

interface ConfirmationModalProps {
    title: string;
    description: string;
    isOpen: boolean;
    onClosed: () => void;
    onPositivePressed: () => void;
    onNegativePressed: () => void;
}


const ConfirmationModal = ({ description, isOpen, onClosed, onNegativePressed, onPositivePressed, title }: ConfirmationModalProps) => {

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClosed}
            size="md"
        >
            <ModalBackdrop />
            <ModalContent>
            <ModalHeader>
                <Heading size="md" className="text-typography-950">
                    {title}
                </Heading>
                <ModalCloseButton>
                <Pressable
                    onPress={onClosed}
                    android_ripple={{
                        color: 'rgba(48, 48, 48, 0.32)',
                        borderless: false,
                    }}
                >
                    <Image
                        source={CloseIC}
                        className={
                            clsx(
                                'w-8',
                                'h-8',
                            )
                        }
                        alt="Close"
                    />
                </Pressable>
                </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
                <Text size="sm" className="text-typography-500">
                    {description}
                </Text>
            </ModalBody>
            <ModalFooter>
                <Button
                    variant="outline"
                    action="secondary"
                    onPress={onNegativePressed}
                >
                    <ButtonText>Cancel</ButtonText>
                </Button>
                <Button
                    onPress={onPositivePressed}
                >
                    <ButtonText>OK</ButtonText>
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ConfirmationModal;
