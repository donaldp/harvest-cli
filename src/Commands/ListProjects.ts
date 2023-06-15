import { Command, PropList, boolean } from '@formidablejs/console'
import { client } from '../Harvest'
import { Project } from '../Store'
import inquirer from 'inquirer'
import ora from 'ora'

export default class ListProjects extends Command {
    get signature(): string {
        return 'list:projects {?--refresh}'
    }

    get description(): string {
        return 'List all projects'
    }

    get props(): PropList {
        return {
            refresh: boolean('Refresh the project list')
        }
    }

    async handle(): Promise<void> {
        if (this.option('refresh')) {
            const spinner = ora('Refreshing projects...').start()

            const response = await client.projects.list()

            if (!response) {
                spinner.stop()

                return this.message('warn', 'Could not retrieve projects')
            }

            if ('message' in response) {
                const projects = await Project.getFromTimeEntries()

                if (!projects) {
                    spinner.stop()

                    return this.message('error', response.message)
                }

                spinner.stop()

                response.projects = projects

                this.message('warn', 'Could not retrieve projects from Harvest, retrieve from time entries instead')
            }

            Project.update(response.projects)

            spinner.stop()
        }

        const projects = Project.get()

        if (projects.length === 0) {
            return this.message('info', 'No projects found')
        }

        if (this.option('refresh')) {
            const answers = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'project',
                    message: "Select the default project",
                    choices: projects.map((project) => {
                        return {
                            name: project.name,
                            value: project.id
                        }
                    })
                }
            ])

            Project.setDefault(answers.project)
        }

        this.message('info', `Found ${projects.length} project(s)`)

        projects.forEach((project) => {
            this.column(`<fg:blue>${project.name}</fg:blue>` + (Project.isDefault(project.id) ? ' <dim>[default]</dim>' : ''), [`<dim>${project.id}</dim>`, `<bright>${project.client.name}</bright>`])
        })
    }
}
