import React, {useEffect} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import style from "./App.module.scss";
import {Header} from "../A1_Header/Header";
import {getRoutes} from "../A1_Header/routes";
import {CustomAlert} from "../X_common/CustomAlert/CustomAlert";
import {observer} from "mobx-react-lite";
import {useStore} from "../../store/useStore";
import {chainId, getProvider, getShopContract, shopAddress} from "../../helpers/ethers.helper";

export const App = observer(() => {
    const {cryptoStore: {
        currentAccountAddress, errorHandler,
        getShopOwner, shopOwner,
        getTokenPriceForBuy,
    }} = useStore();

    // при изменении состояния смарт-контракта одним акккаунтом, другие обрабатывают это изменение через события
    // BuyPriceChange: getTokenPriceForBuy - обновить цену покупки

    //========= ADD EVENT LISTENERS =========
    const addListener = async () => {
        try {
            if (window.ethereum) {
                const provider = getProvider();
                const contract = getShopContract(provider);
                const startBlockNumber = await provider.getBlockNumber();

                provider.on("error", (e) => console.log(e));

                // Buy Price Change
                // @ts-ignore
                contract.on("BuyPriceChange", async (...args) => {
                    try {
                        const event = args[args.length - 1];
                        if (event.blockNumber > startBlockNumber) {
                            await getTokenPriceForBuy();
                        }
                    } catch (e: any) {
                        errorHandler(e)
                    }
                });

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
                    await getShopOwner();
                }
            }
        }
        omMountHandler().then();
    }, [window.ethereum]);

    return (
        <div className={style.app}>
            <Header/>
            <CustomAlert/>
            <main className={style.main}>
                <Routes>
                    {
                        getRoutes({currentAccountAddress, shopOwner})
                            .map(({path, element, condition}, key) => (
                                <Route key={key} path={path} element={condition ? element : <Navigate to="/" replace={true} />}/>
                            ))
                    }
                </Routes>
            </main>
        </div>
    );
})
