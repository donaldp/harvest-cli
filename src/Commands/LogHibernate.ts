import { Command, PropList } from '@formidablejs/console'

export default class LogHibernate extends Command {
    get signature(): string {
        return 'log:hibernate {--duration=}'
    }

    get description(): string {
        return 'Stop auto logging for X time'
    }

    get props(): PropList {
        return {

        }
    }

    async handle(): Promise<void> {
        //
    }
}
