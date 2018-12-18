import { ILiveStreamingApi } from '@/services/LiveStreamingApi';
import { Optional } from '@/utils/Optional';
import { StreamingStatus } from '@/models/StreamingStatus';

export interface ILiveStreamingState {
    streamingStatus: StreamingStatus;
    liveStreamingApi: Optional<ILiveStreamingApi>;
    errorMessage: string;
    isCapturing: boolean;
}