import { Command, PropList, boolean } from '@formidablejs/console'
import { client } from '../Harvest'
import { Task } from '../Store/Task'
import ora from 'ora'

export default class ListTasks extends Command {
    get signature(): string {
        return 'list:tasks {?--refresh}'
    }

    get description(): string {
        return 'List all tasks'
    }

    get props(): PropList {
        return {
            refresh: boolean('Refresh the task list')
        }
    }

    async handle(): Promise<void> {
        if (this.option('refresh')) {
            const spinner = ora('Refreshing projects...').start()

            const response = await client.tasks.list()

            if (!response) {
                spinner.stop()

                return this.message('warn', 'Could not retrieve tasks')
            }

            if ('message' in response) {
                spinner.stop()

                return this.message('error', response.message)
            }

            Task.update(response.tasks)

            spinner.stop()
        }

        const tasks = Task.get()

        if (tasks.length === 0) {
            return this.message('info', 'No tasks found')
        }

        this.message('info', `Found ${tasks.length} tasks(s)`)

        tasks.forEach((task) => {
            this.column(`<fg:blue>${task.name}</fg:blue>`, [`<dim>${task.id}</dim>`])
        })

    }
}
