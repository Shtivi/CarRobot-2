import { Optional } from '@/utils/Optional';

interface IToastAction {
    callback: (hideToast: () => void) => void;
    label: string | undefined;
    icon: string | undefined;
}

export interface IToastOptions {
    label: string;
    duration?: number;
    icon?: string;
    actions?: IToastAction[]
}