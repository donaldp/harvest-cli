import { client } from '../Harvest'
import { store } from './Store'

type TaskEntry = {
    id: number
    name: string
    billable_by_default: boolean
    is_default: boolean
    is_active: boolean
    created_at: string
    updated_at: string
}

export class Task {
    static update(tasks: TaskEntry[]): void {
        const data = store.read()

        store.write(Object.assign(data, {
            tasks
        }))
    }

    static async refresh(): Promise<void> {
        const response = await client.tasks.list()

        if (!response || 'message' in response) {
            return
        }

        Task.update(response.tasks)
    }

    static get(): TaskEntry[] {
        const data = store.read()

        return data.tasks || []
    }

    static exists(taskId: number): boolean {
        const data = store.read()

        return !!data.tasks.find(task => task.id === taskId)
    }

    static find(taskId: number): TaskEntry {
        const data = store.read()

        return data.tasks.find(task => task.id === taskId)
    }
}
