import { Command, PropList } from '@formidablejs/console'

export default class ReportYesterday extends Command {
    get signature(): string {
        return 'report:yesterday'
    }

    get description(): string {
        return 'Check yesterday\'s logged time'
    }

    get props(): PropList {
        return {

        }
    }

    async handle(): Promise<void> {
        //
    }
}
