import { writeFileSync } from 'fs';

/**
 * When we dpploy code to a hosting provider we may only expose environment variables
 * int the env and probably wont have the ability to provide them through a .env file at
 * build time, since we rely on having the .env file lets generate one from the current env
 */

const INCLUDE_REGEX = /^TF_VAR/;

export const generateDotEnv = () => {
    const keys = Object.keys(process.env);
    const data = keys.reduce((fileData, key) => {
        if (!INCLUDE_REGEX.test(key)) {
            return fileData;
        }
        return fileData + `${key}=${process.env[key]}\n`;
    }, '');
    writeFileSync('./.env', data, {
        encoding: 'utf8',
    });
};

generateDotEnv();
