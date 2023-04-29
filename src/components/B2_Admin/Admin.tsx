import React, {useEffect, useState} from "react";
import style from "./Admin.module.scss"
import {observer} from "mobx-react-lite";
import {useStore} from "../../store/useStore";
import {useNavigate} from "react-router-dom";
import {ethers} from "ethers";
import {chainId, getProvider, getShopContract, shopAddress} from "../../helpers/ethers.helper";
import {Button, CircularProgress, LinearProgress} from "@mui/material";
import Typography from "@mui/material/Typography";
import {SetTokenPriceForBuy} from "./SetTokenPriceForBuy/SetTokenPriceForBuy";

export const Admin = observer(() => {
    const {
        cryptoStore: {
            loading, currentAccountAddress,
            shopOwner, errorHandler,
            shopBalance, getShopBalance,
            getTokenPriceForBuy, tokenPriceForBuy,

        }
    } = useStore();

    const navigate = useNavigate();
    useEffect(() => {
        if (
            currentAccountAddress && shopOwner && ethers.utils.getAddress(currentAccountAddress) !== ethers.utils.getAddress(shopOwner)
        ) {
            navigate(-1);
        }
    }, []);

    //========= МОНТИРОВАНИЕ =========//
    useEffect(() => {
        const omMountHandler = async () => {
            if (window.ethereum) {
                const provider = getProvider();
                const network = await provider.getNetwork();

                // проверка совпадения сети в которой развернут смарт-контракт с той, к которой подключились
                if (network.chainId === chainId && currentAccountAddress) {
                    await getShopBalance();
                    await getTokenPriceForBuy();
                }
            }
        }
        omMountHandler().then();
    }, [window.ethereum, currentAccountAddress]);

    const [localLoading, setLocalLoading] = useState(false);

    //========= WITHDRAW ALL =========//
    const onWithdrawHandler = async () => {
        try {
            if (currentAccountAddress) {
                setLocalLoading(true);
                const provider = getProvider();
                const shopContract = getShopContract(provider);
                const signer = provider.getSigner(currentAccountAddress);
                const tx = await shopContract.connect(signer).withdrawAll();
                await tx.wait();
                await getShopBalance();
            }
        } catch (e: any) {
            errorHandler(e);
        } finally {
            setLocalLoading(false);
        }
    }

    return (
        <div className={style.admin}>

            {
                loading &&
                <LinearProgress className={style.progress}
                                color="secondary"
                />
            }

            <Typography variant="h4" color="primary">
                Admin
            </Typography>

            <Typography variant="h5" color="primary">
                Manage your shop
            </Typography>

            <div className={style.infoBlockColumn}>
                <Typography className={style.label}>Shop address</Typography>
                <Typography className={style.value}>{shopAddress}</Typography>
            </div>

            {
                shopOwner &&
                <div className={style.infoBlockColumn}>
                    <Typography className={style.label}>Shop owner</Typography>
                    <Typography className={style.value}>{shopOwner}</Typography>
                </div>
            }

            {
                shopBalance &&
                <div className={style.infoBlockColumn}>
                    <Typography className={style.label}>Shop balance (wei)</Typography>
                    <Typography className={style.value}>{shopBalance}</Typography>
                </div>
            }

            {
                tokenPriceForBuy &&
                <div className={style.infoBlockColumn}>
                    <Typography className={style.label}>Token price for buy (wei)</Typography>
                    <Typography className={style.value}>{tokenPriceForBuy}</Typography>
                </div>
            }

            <SetTokenPriceForBuy/>

            <Button variant="contained"
                    fullWidth
                    className={style.btn}
                    disabled={Number(shopBalance) === 0}
                    size="small"
                    color="warning"
                    onClick={onWithdrawHandler}
            >
                <div className={style.preloaderWrapper}>
                    <p>Withdraw all</p>
                    {
                        localLoading &&
                        <div className={style.preloader}>
                            <CircularProgress color="success" size={25}/>
                        </div>
                    }
                </div>
            </Button>

        </div>
    )
})
