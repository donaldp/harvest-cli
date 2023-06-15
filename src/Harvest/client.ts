import { Account } from '../Store'
import harvest from 'harvest-v2'

const client = new harvest({
    account_ID: Account.hasDefault() ? Account.default().accountId : '',
    access_token: Account.hasDefault() ? Account.default().personalAccessToken : '',
    user_agent: 'Harvest CLI'
})

export { client }
