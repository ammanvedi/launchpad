import loadable from '@loadable/component'

export const SetNewPasswordLazy = loadable(() => import(/* webpackChunkName: "set-new-password" */ './index'))