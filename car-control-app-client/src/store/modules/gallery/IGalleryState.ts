import { ICaptureInfo } from '@/models/ICaptureInfo';
import { ICapture } from '@/models/ICapture';
import { CapturesApi } from '@/services/CapturesApi';
import { Optional } from '@/utils/Optional';

export interface IGalleryState {
    capturesApi: CapturesApi;
    isShown: boolean;
    pictures: ICapture[];   
    arePicturesLoading: boolean;
    zoomedPicture: Optional<ICapture>;
}