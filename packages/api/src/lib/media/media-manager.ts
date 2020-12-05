export type StringUrl = string

export interface MediaManager {
    storeImage(imageData: any): Promise<StringUrl>;
};

