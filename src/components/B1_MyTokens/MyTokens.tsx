import React, {useEffect, useState} from "react";
import style from "./MyTokens.module.scss"
import {observer} from "mobx-react-lite";
import {useStore} from "../../store/useStore";
import {chainId, getProvider } from "../../helpers/ethers.helper";
import {useQueries} from "react-query";
import { getTokenJson } from "../../axios/axios";
import LinearProgress from "@mui/material/LinearProgress";
import {Typography} from "@mui/material";
import { MyTokenCard } from "./MyTokenCard/MyTokenCard";
import {IAccountTokenWithJson} from "../../types/types";
import {MyTokenModal} from "./MyTokenModal/MyTokenModal";


export const MyTokens = observer(() => {
    const {
        cryptoStore: {
            currentAccountAddress, loading,
            errorHandler,
            accountTokens, getAccountTokens
        }
    } = useStore();

    //========= МОНТИРОВАНИЕ =========//
    useEffect(() => {
        const omMountHandler = async () => {
            if (window.ethereum) {
                const provider = getProvider();
                const network = await provider.getNetwork();

                // проверка совпадения сети в которой развернут смарт-контракт с той, к которой подключились
                if (network.chainId === chainId && currentAccountAddress) {
                    await getAccountTokens(currentAccountAddress);
                }
            }
        }
        omMountHandler().then();
    }, [window.ethereum, currentAccountAddress]);

    // GET TOKENS JSONS
    const results = useQueries(
        (accountTokens || []).map(({tokenUri}) => ({
                queryKey: [tokenUri],
                queryFn: () => getTokenJson(tokenUri),
                enabled: Boolean(accountTokens)
            })
        )
    );

    const [showModal, setShowModal] = useState(false);
    const [selectedAccountTokenWithJson, setSelectedAccountTokenWithJson] = useState<null | IAccountTokenWithJson>(null);

    return (
        <div className={style.myTokens}>

            {
                loading &&
                <LinearProgress className={style.progress}
                                color="secondary"
                />
            }

            <Typography variant="h4" color="primary">
                My tokens
            </Typography>

            <Typography variant="h5" color="primary">
                List of NFT tokens of current account
            </Typography>

            {
                !loading && results.length === 0 &&
                <p className={style.empty}>empty</p>
            }

            <>
                {
                    accountTokens && (
                        <div className={style.cards}>
                            <div className={style.inner}>
                                {
                                    [...results]
                                        .map(({data}, index) => ({
                                            tokenId: accountTokens[index].tokenId,
                                            json: data,
                                        }))
                                        .map((token, key) => {
                                                return (
                                                    <React.Fragment key={key}>
                                                        {
                                                            token.json && (
                                                                <MyTokenCard
                                                                    accountTokenWithJson={token as IAccountTokenWithJson}
                                                                    onClick={() => {
                                                                        setShowModal(true);
                                                                        setSelectedAccountTokenWithJson(token as IAccountTokenWithJson);
                                                                    }}
                                                                />
                                                            )
                                                        }
                                                    </React.Fragment>
                                                )
                                            }
                                        )
                                }
                            </div>
                        </div>
                    )
                }
            </>

            {
                selectedAccountTokenWithJson &&
                <MyTokenModal showModal={showModal}
                              accountTokenWithJson={selectedAccountTokenWithJson}
                              onClose={() => setShowModal(false)}
                              currentAccountAddress={currentAccountAddress}
                />
            }

        </div>
    )
})
