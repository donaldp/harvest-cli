import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

class Store {
    private file: string

    constructor() {
        this.file = path.join(os.homedir(), '.harvest-cli', 'harvest.json')

        this.initialize()
    }

    private initialize(): void {
        if (!fs.existsSync(path.dirname(this.file))) {
            fs.mkdirSync(path.dirname(this.file), { recursive: true })
        }

        if (!fs.existsSync(this.file)) {
            const object = {
                accounts: [],
                projects: [],
                defaultAccount: null,
                defaultProject: [],
                tasks: [],
            }

            fs.writeFileSync(this.file, JSON.stringify(object), { encoding: 'utf-8' })
        }
    }

    read(): any {
        return JSON.parse(fs.readFileSync(this.file, { encoding: 'utf-8' }))
    }

    write(object: any): void {
        const data = Object.assign(this.read(), object)

        return fs.writeFileSync(this.file, JSON.stringify(data), { encoding: 'utf-8' })
    }
}

const store = new Store()

export { Store, store }
