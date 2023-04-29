export interface ITokenJson {
    description: string
    image: string
    name: string
    attributes: {
        trait_type: string
        value: string
    }[]
}

export interface createNFTMetadataPayload {
    totalSupply: number
    image: string
    attributes: {
        head: number
        eyes: number
        mouth: number
        nose: number
        bows: number
    }
}

export interface IShopToken {
    tokenId: number
    tokenUri: string
}

export interface IAccountTokenWithJson {
    tokenId: number
    json: ITokenJson
}
