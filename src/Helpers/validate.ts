type Schema = {
    [key: string]: {
        type: string,
        required: boolean,
    }
}

export const validate = (schema: Schema, object) => {
    for (const key in schema) {
        const { type, required } = schema[key]
        const value = object[key]

        if (required && value === undefined) {
            throw new Error(`Missing required property: ${key}`)
        }

        if (value !== undefined && typeof value !== type) {
            throw new Error(`Invalid type for property: ${key}`)
        }
    }
}
