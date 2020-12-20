import fetch from 'node-fetch';

export interface EncryptedTokenStore {
    getEncryptedTokensForService(serviceId: string): Promise<EncryptedTokensMap | null>;
}

export interface DeploymentTrigger {
    triggerDeployment(serviceId: string): Promise<boolean>;
}

type AppSpecEnvar = {
    key: string;
    value: string;
    scope: 'RUN_TIME' | 'RUN_AND_BUILD_TIME' | 'BUILD_TIME';
    type?: 'SECRET' | 'GENERAL';
};

type AppSpecService = {
    name: string;
    envs: Array<AppSpecEnvar>;
};

type AppSpec = {
    name: string;
    services: Array<AppSpecService>;
};

type DigitalOceanApp = {
    id: string;
    spec: AppSpec;
};

type DigitalOceanAppResponse = {
    apps: Array<DigitalOceanApp>;
};

type EncryptedTokensMap = {
    [key: string]: string;
};

type DigitalOceanDeploymentResponse = {
    deployment: {
        id: string;
    };
};

export class DigitalOceanService implements EncryptedTokenStore, DeploymentTrigger {
    protected readonly API_BASE = 'https://api.digitalocean.com/v2';
    protected readonly API_APP = `${this.API_BASE}/apps`;
    protected readonly API_APP_DEPLOYMENT = (id: string) =>
        `${this.API_APP}/${id}/deployments`;
    protected readonly HEADERS = {
        Authorization: `Bearer ${this.token}`,
    };

    constructor(protected readonly token: string) {}

    protected async getAppWithName(name: string): Promise<DigitalOceanApp | null> {
        return fetch(this.API_APP, {
            headers: this.HEADERS,
        })
            .then((res) => res.json())
            .then((r: DigitalOceanAppResponse) => {
                const app = r.apps.find((a) => a.spec.name === name);
                return app || null;
            });
    }

    async getEncryptedTokensForService(
        serviceId: string,
    ): Promise<EncryptedTokensMap | null> {
        const appSpec = await this.getAppWithName(serviceId);
        if (!appSpec) {
            return null;
        }

        return appSpec.spec.services[0]?.envs.reduce((m, e) => {
            const isSecret = e.type === 'SECRET';
            const isEncryptedValue = /^EV\[1/.test(e.value);
            if (isSecret && isEncryptedValue) {
                return {
                    ...m,
                    [e.key]: e.value,
                };
            }
            return m;
        }, {});
    }

    async triggerDeployment(serviceId: string): Promise<boolean> {
        const app = await this.getAppWithName(serviceId);
        if (!app) {
            return false;
        }

        const res: DigitalOceanDeploymentResponse = await fetch(
            this.API_APP_DEPLOYMENT(app.id),
            {
                method: 'post',
                headers: this.HEADERS,
            },
        ).then((r) => r.json());

        console.log(`Created Deployment ${res.deployment.id} for ${serviceId}`);

        return Promise.resolve(false);
    }
}
