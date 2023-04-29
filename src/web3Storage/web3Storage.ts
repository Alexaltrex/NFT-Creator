import {Web3Storage} from 'web3.storage'

export const makeStorageClient = () => {
    return new Web3Storage({
        token: process.env.REACT_APP_WEB3_STORAGE_TOKEN as string
    })
}
