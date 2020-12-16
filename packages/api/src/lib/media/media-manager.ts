import mkdirp from 'mkdirp';
import { createLoggerSet } from '../logging/logger';
import { createWriteStream, ReadStream, unlink } from 'fs';
import { v4 as uuid } from 'uuid';
import { join } from 'path';
export type StringUrl = string;

export abstract class MediaManager {
    protected tempDir: string | null = null;
    protected log = createLoggerSet('MediaManager');

    // Absolute path to the desired temp directory
    async createTempDir(path: string): Promise<void> {
        this.tempDir = path;
        try {
            await mkdirp(path);
            this.log.info('Created temp directory');
        } catch (e) {
            this.log.err('Failed to create the temp directory');
            this.log.err(e.toString());
        }
    }

    async writeStreamToTempDirectory(
        stream: ReadStream,
        fileName: string,
    ): Promise<string> {
        if (!this.tempDir) {
            return Promise.reject(
                new Error('Could nto handle upload when no temp directory exists'),
            );
        }

        const tempName = `${uuid()}-${fileName}`;
        const destination = join(this.tempDir, tempName);
        const writeStream = createWriteStream(destination);
        return new Promise((res, rej) => {
            stream
                .pipe(writeStream)
                .on('error', (e) => {
                    this.log.err(e.toString());
                })
                .on('close', () => {
                    res(destination);
                });
        });
    }

    async removeFileFromTempDirectory(filePath: string): Promise<void> {
        return new Promise((res, rej) => {
            unlink(filePath, (err) => {
                if (err) {
                    this.log.err(err.toString());
                    return rej(err);
                }
                res();
            });
        });
    }

    abstract storeImage(imagePath: string): Promise<StringUrl>;
}
