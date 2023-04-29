//========= GET CONTRACT =========//
import {ethers} from "ethers";
import shopAddressDev from "../assets/contracts/dev/Shop-address.json";
import shopArtifactDev from "../assets/contracts/dev/Shop-artifact.json";
import tokenAddressDev from "../assets/contracts/dev/Token-address.json";
import tokenArtifactDev from "../assets/contracts/dev/Token-artifact.json";

import shopAddressProd from "../assets/contracts/prod/Shop-address.json";
import shopArtifactProd from "../assets/contracts/prod/Shop-artifact.json";
import tokenAddressProd from "../assets/contracts/prod/Token-address.json";
import tokenArtifactProd from "../assets/contracts/prod/Token-artifact.json";
// @ts-ignore
import {NFTShop, NFTToken} from "../types/contracts/contracts";

//========= GET PROVIDER =========//
export const getProvider = () => new ethers.providers.Web3Provider(window.ethereum);

//========= GET SHOP CONTRACT =========//
export const getShopContract = (provider: ethers.providers.Web3Provider) => {
    return new ethers.Contract(
        process.env.NODE_ENV === "production" ? shopAddressProd.address : shopAddressDev.address,
        process.env.NODE_ENV === "production" ? shopArtifactProd.abi : shopArtifactDev.abi,
        provider
    ) as NFTShop;
};

//========= GET SHOP CONTRACT ADDRESS =========//
export const shopAddress = process.env.NODE_ENV === "production" ? shopAddressProd.address : shopAddressDev.address

//========= GET TOKEN CONTRACT =========//
export const getTokenContract = (provider: ethers.providers.Web3Provider) => (
    new ethers.Contract(
        process.env.NODE_ENV === "production" ? tokenAddressProd.address : tokenAddressDev.address,
        process.env.NODE_ENV === "production" ? tokenArtifactProd.abi : tokenArtifactDev.abi,
        provider
    ) as NFTToken
);

//========= GET TOKEN CONTRACT ADDRESS =========//
export const tokenAddress = process.env.NODE_ENV === "production" ? tokenAddressProd.address : tokenAddressDev.address

//========= CHAIN ID =========//
export const chainIdDev = 31337;
export const chainIdProd = 11155111
export const chainId = process.env.NODE_ENV === "production" ? chainIdProd : chainIdDev;
