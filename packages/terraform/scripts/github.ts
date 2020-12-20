import { Octokit } from '@octokit/rest';
import { seal } from 'tweetsodium';
import { log } from './log';

export interface SecretUpdater {
    updateSecret(
        repository: string,
        secretName: string,
        newSecret: string,
    ): Promise<boolean>;
}

export class GithubService implements SecretUpdater {
    api = new Octokit({
        auth: this.token,
    });

    publicKey: string | null = '';

    constructor(protected readonly token: string) {}

    protected async getPublicKey(
        owner: string,
        repo: string,
    ): Promise<{ key: string; keyId: string } | null> {
        try {
            const pkResponse = await this.api.actions.getRepoPublicKey({
                owner,
                repo,
            });
            return {
                key: pkResponse.data.key,
                keyId: pkResponse.data.key_id,
            };
        } catch (e) {
            log.error('failed to fetch public key');
            log.error(e.toString());
            log.error(e.stack);
        }
    }

    protected async encryptSecret(
        owner: string,
        repo: string,
        newValue: string,
    ): Promise<{ encrypted_value: string; key_id: string } | null> {
        const pk = await this.getPublicKey(owner, repo);
        if (!pk) {
            throw new Error('FAIL: could not get public key');
        }

        const messageBytes = Buffer.from(newValue);
        const keyBytes = Buffer.from(pk.key, 'base64');

        // Encrypt using LibSodium.
        const encryptedBytes = seal(messageBytes, keyBytes);

        // Base64 the encrypted secret
        const encrypted = Buffer.from(encryptedBytes).toString('base64');

        return {
            encrypted_value: encrypted,
            key_id: pk.keyId,
        };
    }

    async updateSecret(
        repository: string,
        secretName: string,
        newSecret: string,
    ): Promise<boolean> {
        const [owner, repo] = repository.split('/');
        const encryptedValue = await this.encryptSecret(owner, repo, newSecret);

        if (!encryptedValue) {
            throw new Error('FAIL: no encrypted value was generated');
        }

        const updateResult = await this.api.actions.createOrUpdateRepoSecret({
            owner,
            repo,
            secret_name: secretName,
            ...encryptedValue,
        });

        return updateResult.status === 201 || updateResult.status === 204;
    }
}
