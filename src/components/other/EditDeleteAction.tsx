import clsx from 'clsx';
import { Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicatorWrapper, ActionsheetDragIndicator, ActionsheetItem, ActionsheetItemText } from '../ui/actionsheet';

interface EditDeleteActionProps {
    isPaid: boolean | undefined;
    showActionsheet: boolean;
    onClose: () => void;
    onEditPress: () => void;
    onDeletePress: () => void;
    onPaidPress: () => void;
    onResetPress: () => void;
}

const EditDeleteAction = ({ isPaid, onDeletePress, onResetPress, onEditPress, onPaidPress, onClose, showActionsheet }: EditDeleteActionProps) => {
    return (
        <Actionsheet isOpen={showActionsheet} onClose={onClose}>
            <ActionsheetBackdrop />
            <ActionsheetContent
                className={
                    clsx('pb-[50%]')
                }
            >
                <ActionsheetDragIndicatorWrapper>
                    <ActionsheetDragIndicator />
                </ActionsheetDragIndicatorWrapper>
                <ActionsheetItem onPress={onEditPress} disabled={isPaid}>
                    <ActionsheetItemText
                        className={
                            clsx(
                                'color-primary-500',
                                'font-interregular',
                                'text-2xl',
                                isPaid && 'opacity-30'
                            )
                        }
                    >
                        Edit Bill
                    </ActionsheetItemText>
                </ActionsheetItem>

                <ActionsheetItem onPress={onPaidPress} disabled={isPaid}>
                    <ActionsheetItemText
                        className={
                            clsx(
                                'color-primary-500',
                                'font-interregular',
                                'text-2xl',
                                isPaid && 'opacity-30'
                            )
                        }
                    >
                        Set As Paid
                    </ActionsheetItemText>
                </ActionsheetItem>

                <ActionsheetItem onPress={onResetPress}>
                    <ActionsheetItemText
                        className={
                            clsx(
                                'color-primary-500',
                                'font-interregular',
                                'text-2xl',
                            )
                        }
                    >
                        Reset Paid
                    </ActionsheetItemText>
                </ActionsheetItem>

                <ActionsheetItem
                    className={
                        clsx(
                            'bg-error-400',
                            'rounded-full',
                        )
                    }
                    onPress={onDeletePress}
                >
                    <ActionsheetItemText
                        className={
                            clsx(
                                'color-primary-500',
                                'font-interregular',
                                'text-2xl',
                            )
                        }
                    >
                        Delete Bill
                    </ActionsheetItemText>
                </ActionsheetItem>
            </ActionsheetContent>
        </Actionsheet>
    )
}

export default EditDeleteAction;
