import { Command, PropList } from '@formidablejs/console'
import { Account } from '../Store'

export default class ListAccounts extends Command {
    get signature(): string {
        return 'list:accounts'
    }

    get description(): string {
        return 'List all accounts'
    }

    get props(): PropList {
        return {

        }
    }

    async handle(): Promise<void> {
        const accounts = Account.get()

        if (!accounts.length) {
            return this.message('info', 'No accounts found')
        }

        this.message('info', `Found ${accounts.length} account(s)`)

        accounts.forEach((account) => {
            this.column(`<fg:blue>${account.profile.first_name} ${account.profile.last_name}</fg:blue>` + (Account.isDefault(account.accountId) ? ' <dim>[default]</dim>' : ''), [`<dim>${account.accountId}</dim>`, `<bright>${account.profile.email}</bright>`])
        })
    }
}
