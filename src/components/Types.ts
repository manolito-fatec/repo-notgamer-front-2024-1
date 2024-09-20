export type GeometryPoint ={
    id: number
    idText: string
    createdAt: string
    longitude: float
    latitude: float
    person :  Pessoa

}
export type Pessoa ={
    idPerson?: Number
    idText?: string
    fullName: string
    codeDevice: number
}