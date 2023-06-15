import { Command, PropList, boolean, number, string } from '@formidablejs/console'
import { me } from '../Harvest'
import { Account } from '../Store'
import ora from 'ora'
import inquirer from 'inquirer'

type PromptAnswers = {
    accountId: number,
    personalAccessToken: string,
}

export default class Login extends Command {
    get signature(): string {
        return 'login {?--accountId=} {?--personalAccessToken=} {--force}'
    }

    get description(): string {
        return 'Set your personal access token'
    }

    get props(): PropList {
        return {
            accountId: number('The Harvest account id'),
            personalAccessToken: string('The Harvest personal access token'),
            force: boolean('Force the login process').default(false)
        }
    }

    async handle(): Promise<void> {
        const answers = await this.prompt()

        if (!this.option('force')) {
            if (Account.exists(answers.accountId)) {
                return this.message('error', 'This account already exists')
            }

            if (Account.get().length >= 1) {
                return this.message('error', 'You can only have one account at a time')
            }
        }

        const spinner = ora('Login in...').start()

        const response = await me({
            accountId: answers.accountId,
            personalAccessToken: answers.personalAccessToken
        })

        if (!('id' in response)) {
            return this.message('error', response.message)
        }

        if (this.option('force')) {
            Account.delete()
        }

        Account.create({
            accountId: answers.accountId,
            personalAccessToken: answers.personalAccessToken,
            profile: response
        })

        spinner.text = 'Fetching projects...'

        spinner.stop()

        this.message('info', `Hello ${response.first_name}! You can now start tracking your time. Happy Harvesting! ⏱️  🎉 `)
    }

    async prompt(): Promise<PromptAnswers> {
        const questions = []

        if (!this.option('accountId')) {
            questions.push({
                type: 'input',
                name: 'accountId',
                message: 'What is your Harvest account id?',
                validate: (value: string) => {
                    value = value.trim()

                    if (value.length === 0) {
                        return 'You must provide an account id'
                    }

                    if (isNaN(Number(value))) {
                        return 'The account id must be a number'
                    }

                    return true
                }
            })
        }

        if (!this.option('personalAccessToken')) {
            questions.push({
                type: 'input',
                name: 'personalAccessToken',
                message: 'What is your Harvest personal access token?',
                validate: (value: string) => {
                    value = value.trim()

                    if (value.length === 0) {
                        return 'You must provide a personal access token'
                    }

                    return true
                }
            })
        }

        const answers = await inquirer.prompt(questions)

        if (this.option('accountId')) {
            answers.accountId = Number(this.option('accountId'))
        }

        if (this.option('personalAccessToken')) {
            answers.personalAccessToken = this.option('personalAccessToken')
        }

        return answers
    }
}
