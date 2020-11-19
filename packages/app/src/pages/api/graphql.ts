import { serverlessHandler } from 'api'

export const config = {
    api: {
        bodyParser: false,
    },
}

export default serverlessHandler