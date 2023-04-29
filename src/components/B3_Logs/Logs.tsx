import React, {useEffect, useState} from "react";
import style from "./Logs.module.scss"
import {observer} from "mobx-react-lite";
import {useStore} from "../../store/useStore";
import {BuySellShopLogUnhandledType, IBuyFromShopLog, IPriceLog, PriceLogUnhandledType} from "../../types/log.type";
import {chainId, getProvider, getShopContract} from "../../helpers/ethers.helper";
import {buyFromShopLogArgsHandler, priceLogArgsHandler} from "../../helpers/logs.helpers";
import Typography from "@mui/material/Typography";
import {LogsTable} from "./LogsTable/LogsTable";

export const Logs = observer(() => {
    const {cryptoStore: {errorHandler}} = useStore();

    const [buyPriceLogs, setBuyPriceLogs] = useState<IPriceLog[]>([]);
    const [buyFromShopLogs, setBuyFromShopLogs] = useState<IBuyFromShopLog[]>([]);

    //========= GET BUY PRICE LOGS =========//
    const getBuyPriceLogs = async () => {
        try {
            if (window.ethereum) {
                const provider = getProvider();
                const contract = getShopContract(provider);
                const filter = contract.filters.BuyPriceChange();
                const logs = await contract.queryFilter(filter);
                setBuyPriceLogs(logs.map(({args}: { args: PriceLogUnhandledType }) => priceLogArgsHandler(args)))
            }
        } catch (e: any) {
            errorHandler(e)
        }
    }

    //========= GET BUY FROM SHOP LOGS =========//
    const getBuyFromShopLogs = async () => {
        try {
            if (window.ethereum) {
                const provider = getProvider();
                const contract = getShopContract(provider);
                const filter = contract.filters.BuyFromShop();
                const logs = await contract.queryFilter(filter);
                setBuyFromShopLogs(logs.map(({args}: { args: BuySellShopLogUnhandledType }) => buyFromShopLogArgsHandler(args)))
            }
        } catch (e: any) {
            errorHandler(e)
        }
    }

    //========= ADD EVENT LISTENERS =========
    const addListener = async () => {
        try {
            if (window.ethereum) {
                const provider = getProvider();
                const contract = getShopContract(provider);
                const startBlockNumber = await provider.getBlockNumber();

                provider.on("error", (e) => console.log(e));

                // @ts-ignore
                contract.on("BuyPriceChange", async (...args) => {
                    try {
                        const event = args[args.length - 1];
                        if (event.blockNumber > startBlockNumber) {
                            await getBuyPriceLogs();
                        }
                    } catch (e: any) {
                        errorHandler(e)
                    }
                })

                // @ts-ignore
                contract.on("BuyFromShop", async (...args) => {
                    try {
                        const event = args[args.length - 1];
                        if (event.blockNumber > startBlockNumber) {
                            await getBuyFromShopLogs();
                        }
                    } catch (e: any) {
                        errorHandler(e)
                    }
                })

            }
        } catch (e: any) {
            errorHandler(e)
        }
    }

    //========= МОНТИРОВАНИЕ =========//
    useEffect(() => {
        const omMountHandler = async () => {
            if (window.ethereum) {
                const provider = getProvider();
                const network = await provider.getNetwork();

                // проверка совпадения сети в которой развернут смарт-контракт с той, к которой подключились
                if (network.chainId === chainId) {
                    await addListener();
                    await getBuyPriceLogs();
                    await getBuyFromShopLogs();
                }
            }
        }
        omMountHandler().then();
    }, [window.ethereum]);

    return (
        <div className={style.logs}>

            <Typography variant="h4" color="primary">
                Logs
            </Typography>

            <LogsTable tableLibel="Buy From Shop Price Change"
                       headerLabels={["oldValue", "newValue", "timestamp"]}
                        // @ts-ignore
                       logs={buyPriceLogs}
                       headerClassName="header_price"
                       rowClassName="row_price"
            />

            <LogsTable tableLibel="Buy From Shop"
                       headerLabels={["buyer", "tokenId", "price", "timestamp"]}
                        // @ts-ignore
                       logs={buyFromShopLogs}
                       headerClassName="header_buy_sell_shop"
                       rowClassName="row_buy_sell_shop"
            />

        </div>
    )
})
