import { toast } from 'react-toastify';

export const showToast = {
    success: (message) => {
        toast.success(message, {
            icon: '✅'
        });
    },

    error: (message) => {
        toast.error(message, {
            icon: '❌'
        });
    },

    warning: (message) => {
        toast.warning(message, {
            icon: '⚠️'
        });
    },

    info: (message) => {
        toast.info(message, {
            icon: 'ℹ️'
        });
    }
};

export default showToast;