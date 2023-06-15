import { Command, PropList } from '@formidablejs/console'
import { Account } from '../Store'
import inquirer from 'inquirer'

export default class Logout extends Command {
    get signature(): string {
        return 'logout'
    }

    get description(): string {
        return 'Remove all accounts'
    }

    get props(): PropList {
        return {

        }
    }

    async handle(): Promise<void> {
        if (!process.argv.includes('--no-interaction')) {
            const answers = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'confirm',
                    message: 'Are you sure you want to logout?',
                    default: false
                }
            ])

            if (!answers.confirm) {
                return this.message('info', 'Logout aborted')
            }
        }

        const accounts = Account.get()

        if (!accounts.length) {
            return this.message('info', 'No accounts found')
        }

        Account.delete()

        this.message('info', 'Successfully logged out')
    }
}
