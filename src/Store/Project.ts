import { store } from './Store'
import { client } from '../Harvest'

type ProjectEntry = {
    id: number
    name: string
    code: string
    client: Client
}

type Client = {
    id: number
    name: string
}

export class Project {
    static update(projects: ProjectEntry[]): void {
        const data = store.read()

        store.write(Object.assign(data, {
            projects
        }))
    }

    static async refresh(): Promise<void> {
        const response = await client.projects.list()

        if (!response) {
            return
        }

        if ('message' in response) {
            response.projects = await Project.getFromTimeEntries()
        }

        Project.update(response.projects)
    }

    static get(): ProjectEntry[] {
        const data = store.read()

        return data.projects || []
    }

    static async getFromTimeEntries(): Promise<ProjectEntry[]> {
        const data = await client.timeEntries.list()

        const projects = []

        data.time_entries.forEach((entry) => {
            const project = entry.project

            project.client = entry.client

            projects.push(project)
        })

        return projects.filter((project, index, self) => self.findIndex((p) => p.id === project.id) === index)
    }

    static setDefault(projectId: number): void {
        const data = store.read()

        if (!data.projects) {
            throw new Error('No projects found')
        }

        const project = data.projects.find(project => project.id === projectId)

        if (!project) {
            throw new Error(`No project found with id: ${projectId}`)
        }

        store.write(Object.assign(data, {
            defaultProject: projectId
        }))
    }

    static isDefault(projectId: number): boolean {
        const data = store.read()

        if (!data.projects) {
            throw new Error('No projects found')
        }

        return data.defaultProject === projectId
    }

    static exists(projectId: number): boolean {
        const data = store.read()

        if (!data.projects) {
            throw new Error('No projects found')
        }

        return !!data.projects.find(project => project.id === projectId)
    }

    static find(projectId: number): ProjectEntry {
        const data = store.read()

        return data.projects.find(project => project.id === projectId)
    }
}
