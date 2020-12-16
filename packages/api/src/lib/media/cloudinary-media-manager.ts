import { MediaManager, StringUrl } from './media-manager';
import { v2 as cloudinary } from 'cloudinary';

type CloudinaryMediaManagerConfig = {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
};

export class CloudinaryMediaManager extends MediaManager {
    constructor(public readonly config: CloudinaryMediaManagerConfig) {
        super();
        cloudinary.config({
            api_key: this.config.apiKey,
            api_secret: this.config.apiSecret,
            cloud_name: this.config.cloudName,
        });
    }

    async storeImage(imagePath: string): Promise<StringUrl> {
        return new Promise((res, rej) => {
            cloudinary.uploader.upload(imagePath, (err, result) => {
                if (err) {
                    return rej(err);
                }

                if (!result) {
                    return rej('No error but no result either');
                }

                res(result.secure_url);
            });
        });
    }
}
