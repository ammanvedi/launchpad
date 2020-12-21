import { readFileSync } from 'fs';

export interface ConfigReader {
    loadVars(filePath: string): void | never;
    getVar(keyName: string): string | null;
}

type VarMap = { [key: string]: string };

export class TFVarsReader implements ConfigReader {
    varsMap: VarMap | null = null;

    getVar(keyName: string): string | null {
        return this.varsMap[keyName] || null;
    }

    loadVars(filePath: string): void {
        const fileContents = readFileSync(filePath).toString();
        const lines = fileContents.split('\n');
        this.varsMap = lines.reduce<VarMap>((vars, line) => {
            const [varName, varValue] = line.split('=');
            if (varName && varValue) {
                const key = varName.trim().replace(/"/g, '');
                const value = varValue.trim().replace(/"/g, '');

                return {
                    ...vars,
                    [key]: value,
                };
            }

            return vars;
        }, {});
    }
}
