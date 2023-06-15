import { Command, PropList } from '@formidablejs/console'
import { me } from '../Harvest'
import { Account } from '../Store'

export default class Status extends Command {
    get signature(): string {
        return 'status'
    }

    get description(): string {
        return 'Check if personal access token has been set'
    }

    get props(): PropList {
        return {

        }
    }

    async handle(): Promise<void> {
        if (!Account.hasDefault()) {
            return this.message('error', 'Not logged in')
        }

        const account = Account.default()

        const response = await me({
            accountId: account.accountId,
            personalAccessToken: account.personalAccessToken
        })

        if (!('id' in response)) {
            return this.message('error', response.message)
        }

        this.message('info', `Logged in as <fg:blue>${response.first_name} ${response.last_name}</fg:blue> <dim>[${response.email}]</dim>`)
    }
}
