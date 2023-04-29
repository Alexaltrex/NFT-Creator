import React, {useEffect, useRef, useState} from "react";
import style from "./Creator.module.scss"
import {CircularProgress, Typography} from "@mui/material";
import {Slider} from "./Slider/Slider";
import body from "../../assets/png/B0_Creator/body.png";
import earLeft from "../../assets/png/B0_Creator/earLeft.png";
import earRight from "../../assets/png/B0_Creator/earRight.png";
import mask from "../../assets/png/B0_Creator/mask.png";
import text from "../../assets/png/B0_Creator/text.png";
import {bows, eyes, heads, mouths, noses, srcs} from "./layers";
import {observer} from "mobx-react-lite";
import {useStore} from "../../store/useStore";
import Button from "@mui/material/Button";
import {makeStorageClient} from "../../web3Storage/web3Storage";
import {chainId, getProvider, getShopContract, getTokenContract} from "../../helpers/ethers.helper";
import {
    createImageIPFSLink,
    createNFTMetadata,
    createTokenIPFSLink,
    getCanvas,
    getRandomNumber,
    toBlob
} from "../../helpers/helpers";

export const Creator = observer(() => {
    const {
        cryptoStore: {
            currentAccountAddress, setAlert,
            tokenPriceForBuy, getTokenPriceForBuy,
            swipers, setSwiper,
        }
    } = useStore();

    const [headIndex, setHeadIndex] = useState(0);
    const [eyesIndex, setEyesIndex] = useState(0);
    const [mouthIndex, setMouthIndex] = useState(0);
    const [noseIndex, setNoseIndex] = useState(0);
    const [bowsIndex, setBowsIndex] = useState(0);

    const [loading, setLoading] = useState(false);

    // монтирование
    useEffect(() => {
        const omMountHandler = async () => {
            if (window.ethereum) {
                const provider = getProvider();
                const network = await provider.getNetwork();

                // проверка совпадения сети в которой развернут смарт-контракт с той, к которой подключились
                if (network.chainId === chainId) {
                    await getTokenPriceForBuy();
                }
            }
        }
        omMountHandler().then();
    }, [window.ethereum]);

    const onCreateHandler = async () => {
        try {
            if (currentAccountAddress && tokenPriceForBuy) {
                setLoading(true);

                // get tokenId
                const provider = getProvider();
                const tokenContract = getTokenContract(provider);
                const totalSupply = (await tokenContract.totalSupply()).toNumber();
                const tokenId = totalSupply + 1;

                // deploy img to ipfs
                const client = makeStorageClient();
                const canvas = await getCanvas({
                    headIndex,
                    eyesIndex,
                    mouthIndex,
                    noseIndex,
                    bowsIndex
                });
                if (canvas) {
                    const imgBlob = await toBlob(canvas);
                    const imgFiles = [
                        new File([imgBlob], `${tokenId}.png`)
                    ];
                    const imgCid = await client.put(imgFiles);
                    const imageIPFSLink = createImageIPFSLink(imgCid, tokenId);

                    // deploy nft metadata to ipfs
                    const tokenJson = createNFTMetadata({
                        headIndex,
                        eyesIndex,
                        mouthIndex,
                        noseIndex,
                        bowsIndex,
                        tokenId,
                        imageIPFSLink,
                    });
                    const blob = new Blob([JSON.stringify(tokenJson, null, 2)], {
                        type: "application/json",
                    });
                    const files = [
                        new File([blob], `${tokenId}.json`)
                    ];
                    const cid = await client.put(files);
                    const tokenUri = createTokenIPFSLink(cid, tokenId)
                    //console.log("tokenIPFSLink: ", tokenIPFSLink)

                    // send tx to smart-contract to create and buy token
                    const shopContract = getShopContract(provider);
                    const signer = provider.getSigner(currentAccountAddress);
                    const tx = await shopContract
                        .connect(signer)
                        .createTokenAndBuy(tokenUri, {value: tokenPriceForBuy});
                    await tx.wait();

                    setAlert({
                        open: true,
                        message: "NFT token successfully created and bought",
                        severity: "success"
                    })
                }
            }
        } catch (e: any) {
            console.log(e.message)
        } finally {
            setLoading(false);
            defaultHandler();
        }
    }

    const randomizeHandler = () => {
        swipers.head?.slideTo(getRandomNumber(0, 2));
        swipers.eyes?.slideTo(getRandomNumber(0, 1));
        swipers.mouth?.slideTo(getRandomNumber(0, 5));
        swipers.nose?.slideTo(getRandomNumber(0, 3));
        swipers.bows?.slideTo(getRandomNumber(0, 2));
    }

    const defaultHandler = () => {
        swipers.head?.slideTo(0);
        swipers.eyes?.slideTo(0);
        swipers.mouth?.slideTo(0);
        swipers.nose?.slideTo(0);
        swipers.bows?.slideTo(0);
    }

    return (
        <div className={style.creator}>
            <Typography variant="h4" color="primary">
                Creator
            </Typography>

            <Typography variant="h5" color="primary">
                Create your own token
            </Typography>

            <div className={style.content}>

                <div className={style.left}>
                    <div className={style.wrapper}>
                        <img src={body} alt="" className={style.body}/>
                        <img src={earLeft} alt="" className={style.earLeft}/>

                        <Slider className={style.swiperHead}
                                slides={heads}
                                onSlideChangeHandler={(index: number) => setHeadIndex(index)}
                                buttonLabel="head"
                                btnClassName={style.btnClassName}
                                swiper={swipers.head}
                                setSwiper={(swiper) => setSwiper("head", swiper)}
                        />

                        <Slider className={style.swiperEyes}
                                slides={eyes}
                                onSlideChangeHandler={(index: number) => setEyesIndex(index)}
                                buttonLabel="eyes"
                                btnClassName={style.btnClassName}
                                swiper={swipers.eyes}
                                setSwiper={(swiper) => setSwiper("eyes", swiper)}
                        />

                        <Slider className={style.swiperMouth}
                                slides={mouths}
                                onSlideChangeHandler={(index: number) => setMouthIndex(index)}
                                buttonLabel="mouth"
                                btnClassName={style.btnClassName}
                                swiper={swipers.mouth}
                                setSwiper={(swiper) => setSwiper("mouth", swiper)}
                        />

                        <Slider className={style.swiperNose}
                                slides={noses}
                                onSlideChangeHandler={(index: number) => setNoseIndex(index)}
                                buttonLabel="nose"
                                btnClassName={style.btnClassName}
                                swiper={swipers.nose}
                                setSwiper={(swiper) => setSwiper("nose", swiper)}
                        />

                        <Slider className={style.swiperBows}
                                slides={bows}
                                onSlideChangeHandler={(index: number) => setBowsIndex(index)}
                                buttonLabel="bows"
                                btnClassName={style.btnClassName}
                                swiper={swipers.bows}
                                setSwiper={(swiper) => setSwiper("bows", swiper)}
                        />

                        <img src={earRight} alt="" className={style.earRight}/>
                        <img src={mask} alt="" className={style.mask}/>
                        <img src={text} alt="" className={style.text}/>
                    </div>

                    <Button color="primary"
                            variant="contained"
                            className={style.createBtn}
                            onClick={randomizeHandler}
                            size="small"
                    >
                        Randomize
                    </Button>

                    <Button color="primary"
                            variant="contained"
                            className={style.createBtn}
                            onClick={defaultHandler}
                            size="small"
                    >
                        Default
                    </Button>

                    {
                        tokenPriceForBuy && (
                            <Button color="secondary"
                                    variant="contained"
                                    className={style.createBtn}
                                    disabled={!currentAccountAddress || loading}
                                    onClick={onCreateHandler}
                            >
                                <div className={style.preloaderWrapper}>
                                    <p>Create and buy NFT Token for <span>{tokenPriceForBuy}</span> wei</p>
                                    {
                                        loading && (
                                            <div className={style.preloader}>
                                                <CircularProgress color="success" size={25}/>
                                            </div>
                                        )
                                    }
                                </div>
                            </Button>
                        )

                    }

                </div>

                <div className={style.right}>
                    <Typography variant="h6" color="primary">
                        Token attributes:
                    </Typography>

                    <div className={style.attributes}>
                        {
                            [
                                {
                                    label: "headIndex",
                                    value: headIndex,
                                },
                                {
                                    label: "bowsIndex",
                                    value: bowsIndex,
                                },
                                {
                                    label: "eyesIndex",
                                    value: eyesIndex,
                                },
                                {
                                    label: "noseIndex",
                                    value: noseIndex,
                                },
                                {
                                    label: "mouthIndex",
                                    value: mouthIndex,
                                },
                            ].map(({label, value}, key) => (
                                <p key={key}>
                                    <span>{`${label}: `}</span>{value}
                                </p>
                            ))
                        }
                    </div>

                </div>

            </div>

        </div>
    )
})
