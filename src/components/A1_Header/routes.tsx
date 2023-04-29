import React from "react";
import {ethers} from "ethers";
import {Creator} from "../B0_Creator/Creator";
import {MyTokens} from "../B1_MyTokens/MyTokens";
import {Admin} from "../B2_Admin/Admin";
import {Logs} from "../B3_Logs/Logs";

export interface IGetRoutes {
    currentAccountAddress: string | null
    shopOwner: string | null
}

export const getRoutes = ({
                              currentAccountAddress,
                              shopOwner
}: IGetRoutes) => ([
    {
        path: "/",
        label: "Creator",
        element: <Creator/>,
        condition: true,
    },
    {
        path: "/mytokens",
        label: "My tokens",
        element: <MyTokens/>,
        condition: Boolean(currentAccountAddress),
    },
    {
        path: "/admin",
        label: "Admin",
        element: <Admin/>,
        condition: currentAccountAddress && shopOwner && ethers.utils.getAddress(currentAccountAddress) === ethers.utils.getAddress(shopOwner),
    },
    {
        path: "/logs",
        label: "Logs",
        element: <Logs/>,
        condition: true,
    },
]);
