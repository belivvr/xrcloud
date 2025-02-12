import { Injectable, InternalServerErrorException } from '@nestjs/common'
import fetch from 'node-fetch'
import { addQuotesToNumbers } from 'src/common'
import {
    CreateFrameOptions,
    CreateRoomOptions,
    FindFramesOptions,
    FindRoomsBySceneIdOptions,
    FindRoomsOptions,
    FindScenesOptions,
    NoticeData,
    RemoveFrameOptions
} from './interfaces'
import { ReticulumConfigService } from './reticulum-config.service'
@Injectable()
export class ReticulumService {
    private readonly apiHost: string
    private readonly adminId: string

    constructor(private readonly configService: ReticulumConfigService) {
        this.apiHost = this.configService.apiHost
        this.adminId = this.configService.adminId
    }

    private async request(url: string, options?: any) {
        const response = await fetch(`${this.apiHost}/${url}`, options)

        if (response.status >= 300) {
            return
        }

        const responseText = await response.text()

        if (!responseText) {
            return true
        }

        try {
            return JSON.parse(addQuotesToNumbers(responseText))
        } catch (e) {
            return response
        }
    }

    async login(emailId: string) {
        const body = JSON.stringify({ email_id: emailId })
        console.log("reticulum login:", body)
        const response = await this.request('api/v1/belivvr/account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        })
        console.log("reticulum login response:", response)
        if (!response || !response.token || typeof response.token !== 'string') {
            throw new InternalServerErrorException('Reticulum: Failed to login')
        }

        return response
    }

    async loginByToken(token: string) {
        const response = await this.request(`api/v1/belivvr/account?token=${token}`, {
            method: 'GET'
        })

        if (!response) {
            throw new InternalServerErrorException('Reticulum: Failed to login by token')
        }

        return response
    }

    async findScenes(options: FindScenesOptions) {
        const { page, take, filter } = options

        const { account_id: accountId, token } = await this.login(this.adminId)

        const size = take > 5 ? 5 : take

        const queryString = `source=scenes&cursor=${page}&page_size=${size}&user=${accountId}&name=${filter}`

        const response = await this.request(`api/v1/belivvr/media/search?${queryString}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (!response) {
            throw new InternalServerErrorException('Reticulum: Failed to find scenes')
        }

        return response
    }

    async createRoom(options: CreateRoomOptions) {
        const { infraSceneId, name, token } = options

        const createRoomData = {
            hub: {
                scene_id: infraSceneId,
                name,
                token
            }
        }

        const body = JSON.stringify(createRoomData)

        const response = await this.request('api/v1/belivvr/hubs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        })

        if (!response) {
            throw new InternalServerErrorException('Reticulum: Failed to create room')
        }

        return response
    }

    async createFrame(options: CreateFrameOptions) {
        const { infraRoomId, fileUrl, objectName } = options

        const { token } = await this.login(this.adminId)

        const createFrameData = {
            file: fileUrl,
            objectName
        }

        const body = JSON.stringify(createFrameData)

        const response = await this.request(`api/v2/hubs/${infraRoomId}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body
        })

        if (!response) {
            throw new InternalServerErrorException('Reticulum: Failed to update frame')
        }

        return response
    }

    async findFrames(options: FindFramesOptions) {
        const { infraRoomId } = options

        const response = await this.request(`api/v2/hubs/${infraRoomId}`, {
            method: 'GET'
        })

        if (!response) {
            throw new InternalServerErrorException('Reticulum: Failed to find frames')
        }

        return response
    }

    async removeFrame(options: RemoveFrameOptions) {
        const { infraRoomId, objectId } = options

        const { token } = await this.login(this.adminId)

        const queryString = `objectId=${objectId}`

        const response = await this.request(`api/v2/hubs/${infraRoomId}?${queryString}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (!response) {
            throw new InternalServerErrorException('Reticulum: Failed to remove frame')
        }

        return response
    }

    async findRooms(options: FindRoomsOptions) {
        const { infraRoomId } = options

        const queryString = `source=rooms&cursor=0&page_size=1&hub_sids=${infraRoomId}`

        const response = await this.request(`api/v1/belivvr/media/search?${queryString}`, {
            method: 'GET'
        })

        if (!response) {
            throw new InternalServerErrorException('Reticulum: Failed to find rooms')
        }

        return response
    }

    async findRoomsBySceneId(options: FindRoomsBySceneIdOptions) {
        const { infraSceneId, page, size } = options

        const queryString = `source=rooms&cursor=${page}&page_size=${size}&scene_sid=${infraSceneId}`

        const response = await this.request(`api/v1/belivvr/media/search?${queryString}`, {
            method: 'GET'
        })

        if (!response) {
            throw new InternalServerErrorException('Reticulum: Failed to find rooms')
        }

        return response
    }

    async createNoticeForAll(noticeData: NoticeData) {
        const { payload } = noticeData

        const body = JSON.stringify({
            payload
        })

        const response = await this.request('api/v1/belivvr_notices/all', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        })

        if (!response) {
            throw new InternalServerErrorException(`Reticulum: Failed to create notice for all`)
        }
    }

    async createNoticeForScene(noticeData: NoticeData, sceneId: string) {
        const { payload } = noticeData

        const body = JSON.stringify({
            payload
        })

        const response = await this.request(`api/v1/belivvr_notices/scenes/${sceneId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        })

        if (!response) {
            throw new InternalServerErrorException(`Reticulum: Failed to create notice for scene`)
        }
    }

    async createNoticeForRoom(noticeData: NoticeData, roomId: string) {
        const { payload } = noticeData

        const body = JSON.stringify({
            payload
        })

        const response = await this.request(`api/v1/belivvr_notices/hubs/${roomId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        })

        if (!response) {
            throw new InternalServerErrorException(`Reticulum: Failed to create notice for hub`)
        }
    }
}
