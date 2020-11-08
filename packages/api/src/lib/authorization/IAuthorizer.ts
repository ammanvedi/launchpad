export interface IAuthorizer<Config extends Object> {
    initialize(config: Config): Promise<void>
    validateToken(token: string): boolean
}