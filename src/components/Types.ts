import type { StringMappingType } from "typescript"

export type GeometryPoint ={
    id: number
    idText: string
    createdAt: string
    longitude: Number
    latitude: Number
    person :  Pessoa
}

export type Pessoa ={
    idPerson?: Number
    idText?: string
    fullName: string
    codeDevice: number
}

export type HistoryConfig={
    historyConfig: Array<HistoryContent>
}

export type HistoryContent={
    initDateTime: string
    endDateTime: string
    distance: Number
    initial: Points
    finality: Points
}
  
export type Points={
    name: string
    address: Address
}

export type Address={
    town: string
    road: string
    state: string
    country: string
}
