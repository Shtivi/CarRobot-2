import { Optional } from '@/utils/Optional';

interface IToastAction {
    callback: (hideToast: () => void) => void;
    label?: string;
    icon?: string;
}

export interface IToastOptions {
    label: string;
    duration?: number;
    icon?: string;
    actions?: IToastAction[]
}