import clsx from 'clsx';
import { Button, ButtonText } from '../ui/button';
import { Heading } from '../ui/heading';
import { Modal, ModalBackdrop, ModalBody, ModalContent, ModalFooter, ModalHeader } from '../ui/modal';
import { FormControl, FormControlError, FormControlErrorText, FormControlLabel, FormControlLabelText } from '../ui/form-control';
import { Input, InputField } from '../ui/input';
import { useState } from 'react';

interface AddGroupModalProps {
    title: string;
    isOpen: boolean;
    onClosed: () => void;
    onPositivePressed: (group: string) => void;
    onNegativePressed: () => void;
}

const AddGroupModal = ({ isOpen, title, onClosed, onNegativePressed, onPositivePressed }: AddGroupModalProps) => {

    const [groupName, setGroupName] = useState('');
    const [isInvalid, setIsInvalid] = useState(false);

    const handleSubmit = () => {
        if (groupName === '') {
            setIsInvalid(true);
            return;
        }

        onPositivePressed(groupName);
    };

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
                    <FormControl
                        isInvalid={isInvalid}
                        size="md"
                        isDisabled={false}
                        isReadOnly={false}
                        isRequired={false}
                    >
                        <FormControlLabel>
                            <FormControlLabelText
                                className={
                                    clsx('text-xl', 'font-interregular')
                                }
                            >
                                Group Name
                            </FormControlLabelText>
                        </FormControlLabel>
                        <Input
                            className={
                                clsx(
                                    'rounded-xl',
                                    'border-primary-400',
                                    'h-12',
                                )
                            }
                            size={'lg'}>
                            <InputField
                                className="font-interregular"
                                type="text"
                                placeholder="Enter group name..."
                                onChangeText={(text) => setGroupName(text)}
                            />
                        </Input>
                        <FormControlError>
                            <FormControlErrorText>
                                Group name is required.
                            </FormControlErrorText>
                        </FormControlError>

                    </FormControl>
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
                        onPress={handleSubmit}
                    >
                        <ButtonText>Save</ButtonText>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddGroupModal;
