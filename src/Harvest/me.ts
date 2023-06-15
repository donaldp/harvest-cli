import axios from 'axios'
import type { AxiosResponse } from 'axios'

type HarvestPersonalInformation = {
    accountId: number,
    personalAccessToken: string
}

type SuccessfulResponse = {
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    telephone: string,
    timezone: string,
    weekly_capacity: number,
    has_access_to_all_future_projects: boolean,
    is_contractor: boolean,
    is_active: boolean,
    calendar_integration_enabled: boolean,
    calendar_integration_source: string,
    created_at: string,
    updated_at: string,
    can_create_projects: boolean,
    default_hourly_rate: number,
    cost_rate: number,
    roles: string[],
    access_role: string[],
    permissions_claims: string[],
    avatar_url: string,
}

type InvalidResponse = {
    message: string
}

type HarvestResponse = SuccessfulResponse | InvalidResponse

const handleResponse = (response: AxiosResponse): HarvestResponse => {
    switch (response.status) {
        case 404:
            return {
                message: 'The account id provided does not exist'
            }

        case 401:
            return {
                message: 'The access token provided is expired, revoked, malformed or invalid for other reasons'
            }

        case 200:
            return response.data

        default:
            return {
                message: 'An unknown error occurred'
            }
        }
}

const me = async ({ accountId, personalAccessToken }: HarvestPersonalInformation): Promise<HarvestResponse> => {
    try {
        const response = await axios.get<HarvestResponse>('https://api.harvestapp.com/api/v2/users/me.json', {
            headers: {
                'Harvest-Account-ID': accountId,
                'Authorization': `Bearer ${personalAccessToken}`,
                'User-Agent': 'Harvest CLI'
            },
        })

        return handleResponse(response)
    } catch (error) {
        return handleResponse(error.response)
    }
}

export {
    HarvestPersonalInformation,
    InvalidResponse,
    me,
    SuccessfulResponse,
}
