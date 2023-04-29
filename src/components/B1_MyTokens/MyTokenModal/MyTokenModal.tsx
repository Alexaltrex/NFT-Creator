import React, {FC} from "react";
import Fade from "@mui/material/Fade";
import {Typography} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Modal from "@mui/material/Modal";
import style from "./MyTokenModal.module.scss"
import {IAccountTokenWithJson} from "../../../types/types";

interface IValues {
    price: number
}

interface IMyTokenModal {
    showModal: boolean
    accountTokenWithJson: IAccountTokenWithJson
    onClose: () => void
    currentAccountAddress: string | null
}

export const MyTokenModal: FC<IMyTokenModal> = ({
                                                    showModal,
                                                    accountTokenWithJson,
                                                    onClose,
                                                    currentAccountAddress,
                                                }) => {
    const {tokenId, json} = accountTokenWithJson;
    const {name, image, description, attributes } = json;

    const onCloseHandler = (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => {
        if (reason === 'backdropClick') return
        onClose();
    }

    return (
        <Modal className={style.myTokenModal}
               open={showModal}
               closeAfterTransition
               onClose={onCloseHandler}
               sx={{
                   "& .MuiBackdrop-root": {
                       backgroundColor: "rgba(0,0,0,0.9)"
                   }
               }}
        >
            <Fade in={showModal}>
                <div className={style.wrapper}>
                    <div className={style.content}>
                        <img src={image} alt="" className={style.img}/>
                        <div className={style.info}>
                            <Typography variant="h4">
                                {name}
                            </Typography>
                            <Typography variant="h5">
                                {description}
                            </Typography>

                            <Typography variant="h6"
                                        className={style.attributesLabel}
                            >
                                Attributes:
                            </Typography>
                            <div className={style.attributes}>
                                {
                                    attributes.map(({trait_type, value}, key) => (
                                        <p key={key}>
                                            <span>{trait_type}</span>: <span>{value}</span>
                                        </p>
                                    ))
                                }
                            </div>

                        </div>
                    </div>

                    <IconButton className={style.closeBtn}
                                size='large'
                                onClick={() => onClose()}
                    >
                        <CloseIcon fontSize="large" sx={{color: "#FFF"}}/>
                    </IconButton>
                </div>

            </Fade>
        </Modal>
    )
}
