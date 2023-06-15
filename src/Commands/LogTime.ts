import { Command, PropList, number, string } from '@formidablejs/console'
import { client } from '../Harvest'
import { Project } from '../Store'
import { Task } from '../Store'
import date from 'date-and-time'
import inquirer from 'inquirer'
import ora from 'ora'
import ms from 'ms'

type PromptAnswers = {
    project: number
    notes?: string
    duration: number
    date: string
    task: number
}

export default class LogTime extends Command {
    get signature(): string {
        return 'log:time {?--project=} {?--task=} {?--notes=} {?--duration=} {?--date=}'
    }

    get description(): string {
        return 'Log time'
    }

    get props(): PropList {
        return {
            project: number('The project id'),
            task: number('The task id'),
            notes: string('The notes'),
            duration: string('The duration. Example: 5.3 hours'),
            date: string('The date. Format: YYYY-MM-DD. Example: 2023-06-14')
        }
    }

    async handle(): Promise<void> {
        const answers = await this.prompt()

        const spinner = ora('Logging time...').start()

        const response = await client.timeEntries.create({
            project_id: answers.project,
            task_id: answers.task,
            notes: answers.notes,
            hours: answers.duration,
            spent_date: answers.date
        })

        spinner.stop()

        if ('id' in response) {
            return this.message('info', `Successfully logged ${answers.duration} hours on ${date.format(new Date(answers.date), 'MMM DD YYYY')}`)
        }

        this.message('error', response.message)
    }

    async prompt(): Promise<PromptAnswers> {
        const questions = []

        if (!this.option('project')) {
            questions.push({
                type: 'list',
                name: 'project',
                message: 'Select a project',
                choices: Project.get().map(project => ({
                    name: project.name,
                    value: project.id
                }))
            })
        }

        if (!this.option('task')) {
            questions.push({
                type: 'list',
                name: 'task',
                message: 'Select a task',
                choices: Task.get().map(task => ({
                    name: task.name,
                    value: task.id
                }))
            })
        }

        if (!this.option('duration')) {
            questions.push({
                type: 'input',
                name: 'duration',
                message: 'Enter the duration',
            })
        }

        const answers = await inquirer.prompt(questions)

        if (this.option('project')) {
            answers.project = this.option('project')

            if (!Project.exists(answers.project)) {
                this.message('error', 'This project does not exist')

                this.exit(1)
            }
        }

        if (this.option('duration')) {
            answers.duration = ms(this.option('duration')) / 3600000
        } else {
            answers.duration = ms(answers.duration) / 3600000
        }

        if (this.option('date')) {
            answers.date = this.option('date')
        } else {
            answers.date = new Date()
        }

        if (this.option('task')) {
            answers.task = this.option('task')

            if (!Task.exists(answers.task)) {
                this.message('error', 'This task does not exist. Run `harvest list:tasks --refresh` to see all tasks')

                this.exit(1)
            }
        }

        return answers
    }
}
