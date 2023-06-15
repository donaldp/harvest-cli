import { store } from './Store'
import { SuccessfulResponse as HarvestProfile } from '../Harvest'
import { validate } from '../Helpers'

export type User = {
    accountId: number,
    personalAccessToken: string,
    profile: HarvestProfile
}

type UpdatedData = {
    accounts: User[]
    defaultAccount?: number
}

export class Account {
    static create(account: User) {
        validate({
            accountId: {
                type: 'number',
                required: true,
            },
            personalAccessToken: {
                type: 'string',
                required: true,
            },
            profile: {
                type: 'object',
                required: true,
            }
        }, account)

        const data = store.read()
        const existingAccounts = data.accounts || []

        existingAccounts.push(account)

        const updatedData: UpdatedData = {
            accounts: existingAccounts
        }

        if (!data.defaultAccount) {
            updatedData.defaultAccount = account.accountId
        }

        store.write(Object.assign(data, updatedData))
    }

    static get(): User[] {
        const data = store.read()

        return data.accounts || []
    }

    static default(): User {
        const data = store.read()
        const defaultAccountId = data.defaultAccount

        if (!defaultAccountId) {
            throw new Error('No default account set')
        }

        const account = data.accounts.find(account => account.accountId === defaultAccountId)

        if (!account) {
            throw new Error(`No account found with id: ${defaultAccountId}`)
        }

        return account
    }

    static setDefault(accountId: number): void {
        const data = store.read()

        if (!data.accounts) {
            throw new Error('No accounts found')
        }

        const account = data.accounts.find(account => account.accountId === accountId)

        if (!account) {
            throw new Error(`No account found with id: ${accountId}`)
        }

        store.write(Object.assign(data, {
            defaultAccount: accountId
        }))
    }

    static delete(accountId?: number): void {
        const data = store.read()

        if (!data.accounts) {
            throw new Error('No accounts found')
        }

        if (accountId) {
            const account = data.accounts.find(account => account.accountId === accountId)

            if (!account) {
                throw new Error(`No account found with id: ${accountId}`)
            }

            const accounts = data.accounts.filter(account => account.accountId !== accountId)

            store.write(Object.assign(data, {
                accounts
            }))

            return
        }

        store.write(Object.assign(data, {
            accounts: [],
            defaultAccount: null
        }))
    }

    static isDefault(accountId: number): boolean {
        const data = store.read()

        return data.defaultAccount === accountId
    }

    static hasDefault(): boolean {
        const data = store.read()

        return !!data.defaultAccount
    }

    static exists(accountId: number): boolean {
        const data = store.read()

        if (!data.accounts) {
            return false
        }

        return !!data.accounts.find(account => account.accountId === accountId)
    }
}
