import clsx from 'clsx';
import { Pressable } from '../ui/pressable';
import { Box } from '../ui/box';

interface RippleButtonProps {
    onPress: () => void;
    onLongPress?: () => void;
    children?: React.ReactNode;
    className?: string;
}

const RippleButton = ({ children, className, onPress, onLongPress }: RippleButtonProps) => {
    return (
        <Box
            className={clsx(
                'overflow-hidden',
                'rounded-full',
                'justify-center',
                'items-center',
                className
            )}
        >
            <Pressable
                android_ripple={{
                    color: 'rgba(48, 48, 48, 0.32)',
                    borderless: false,
                }}
                className={
                    clsx(
                        'p-2',
                    )
                }
                onPress={onPress}
                onLongPress={onLongPress}
            >
                {children}
            </Pressable>
        </Box>
    );
};

export default RippleButton;
