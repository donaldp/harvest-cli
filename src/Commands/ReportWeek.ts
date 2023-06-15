import { Command, PropList } from '@formidablejs/console'

export default class ReportWeek extends Command {
    get signature(): string {
        return 'report:week'
    }

    get description(): string {
        return 'Check this week\'s logged time'
    }

    get props(): PropList {
        return {

        }
    }

    async handle(): Promise<void> {
        //
    }
}
