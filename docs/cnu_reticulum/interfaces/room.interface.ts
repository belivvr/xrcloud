export interface CreateRoomOptions {
    infraSceneId: string
    name: string
    token: string
}

export interface CreateFrameOptions {
    infraRoomId: string
    fileUrl: string
    objectName: string
}

export interface FindFramesOptions {
    infraRoomId: string
}

export interface RemoveFrameOptions {
    infraRoomId: string
    objectId: string
}

export interface FindRoomsOptions {
    infraRoomId: string
}

export interface FindRoomsBySceneIdOptions {
    infraSceneId: string
    page: number
    size: number
}
