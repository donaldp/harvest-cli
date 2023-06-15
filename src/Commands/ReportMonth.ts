import { Command, PropList } from '@formidablejs/console'

export default class ReportMonth extends Command {
    get signature(): string {
        return 'report:month'
    }

    get description(): string {
        return 'Check this month\'s logged time'
    }

    get props(): PropList {
        return {

        }
    }

    async handle(): Promise<void> {
        //
    }
}
