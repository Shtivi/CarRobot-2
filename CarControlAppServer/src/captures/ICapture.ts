export interface ICapture {
    details: {
        time: number;
        fileName: string;
        extension: string;
        name: string;
        source: string;
        takenByUser: string;
        kilobytes: number;
        width: number;
        height: number;
    },
    data: any
}