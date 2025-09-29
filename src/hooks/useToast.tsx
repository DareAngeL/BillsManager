import clsx from 'clsx';
import { Toast, ToastDescription, ToastTitle, useToast } from '../components/ui/toast';

const useCustomToast = () => {
    const toast = useToast();

    const showNewToast = (title: string, msg: string, type: 'err' | 'success' = 'success') => {
        toast.show({
            placement: 'top',
            duration: 3000,
            render: ({ id }) => {
                return (
                    <Toast
                        nativeID={id}
                        action="muted"
                        variant="solid"
                        className={
                            clsx(
                                type === 'success' ? 'bg-success-500' : 'bg-error-400',
                            )
                        }
                    >
                        <ToastTitle className="font-interbold">{title}</ToastTitle>
                        <ToastDescription className="font-interregular">
                            {msg}
                        </ToastDescription>
                    </Toast>
                );
            },
        });
    };

    return {
        showNewToast,
    };
};

export default useCustomToast;
