import { Optional } from '@/utils/Optional';

export interface IToastOptions {
    label: string;
    duration?: number;
    icon?: string;
    actions?: [{
        label?: string,
        callback: (hideToast: () => void) => void,
        icon?: string
    }]
}