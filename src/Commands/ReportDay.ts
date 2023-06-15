import { Command, PropList } from '@formidablejs/console'

export default class ReportDay extends Command {
    get signature(): string {
        return 'report:day'
    }

    get description(): string {
        return 'Check today\'s logged time'
    }

    get props(): PropList {
        return {

        }
    }

    async handle(): Promise<void> {
        //
    }
}
