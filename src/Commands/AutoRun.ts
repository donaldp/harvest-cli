import { Command, PropList, number, string } from '@formidablejs/console'
import { client } from '../Harvest'
import { Project, Task } from '../Store'
import ms from 'ms'

export default class AutoRun extends Command {
    get signature(): string {
        return 'auto:run {--project=} {--task=} {?--notes=} {--duration=}'
    }

    get description(): string {
        return 'Log time'
    }

    get props(): PropList {
        return {
            project: number('The project id'),
            task: number('The task id'),
            notes: string('The notes'),
            duration: string('The duration. Example: 5.3 hours').default('8 hours')
        }
    }

    async handle(): Promise<void> {
        if (!Project.exists(this.option('project'))) {
            this.message('error', 'This project does not exist')

            this.exit(1)
        }

        if (!Task.exists(this.option('task'))) {
            this.message('error', 'This task does not exist')

            this.exit(1)
        }

        const response = await client.timeEntries.create({
            project_id: this.option('project'),
            task_id: this.option('task'),
            notes: this.option('notes'),
            hours: ms(this.option('duration')) / 3600000,
            spent_date: new Date()
        })

        if ('id' in response) {
            return this.message('info', `Successfully logged ${this.option('duration')} hours on ${new Date().toLocaleDateString()}`)
        }

        this.message('error', response.message)

        this.exit(1)
    }
}
