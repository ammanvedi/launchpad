import {MediaManager, StringUrl} from "./media-manager";
import {v2 as cloudinary} from 'cloudinary';


type CloudinaryMediaManagerConfig = {
    cloudName: string,
    apiKey: string,
    apiSecret: string,
}

export class CloudinaryMediaManager implements MediaManager {

    constructor(public readonly config: CloudinaryMediaManagerConfig) {
        cloudinary.config({
            api_key: this.config.apiKey,
            api_secret: this.config.apiSecret,
            cloud_name: this.config.cloudName,
        });
    }

    storeImage(imageData: any): Promise<StringUrl> {
        return Promise.resolve('');
    }
}