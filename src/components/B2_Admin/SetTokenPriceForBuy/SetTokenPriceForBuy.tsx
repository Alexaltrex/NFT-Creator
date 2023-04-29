import React, {useState} from "react";
import style from "./setTokenPriceForBuy.module.scss";
import {CircularProgress, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {useStore} from "../../../store/useStore";
import {observer} from "mobx-react-lite";
import {FormikHelpers, useFormik} from "formik";
import {getProvider, getShopContract} from "../../../helpers/ethers.helper";

interface IValues {
    price: number
}

export const SetTokenPriceForBuy = observer(() => {
    const {
        cryptoStore: {
            tokenPriceForBuy, getTokenPriceForBuy,
            errorHandler, currentAccountAddress,
        }
    } = useStore();

    const [loading, setLoading] = useState(false);

    const initialValues: IValues = {
        price: tokenPriceForBuy || 1
    }

    const onSubmit = async ({price}: IValues, formikHelpers: FormikHelpers<IValues>) => {
        try {
            if (currentAccountAddress) {
                setLoading(true);

                const provider = getProvider();
                const shopContract = getShopContract(provider);
                const signer = provider.getSigner(currentAccountAddress);

                const tx = await shopContract
                    .connect(signer)
                    .setTokenPriceForBuy(price);
                await tx.wait(); // ждем ее завершения
                await getTokenPriceForBuy(); // получить новую цену
            }
        } catch (e: any) {
            errorHandler(e);
        } finally {
            setLoading(false);
            formikHelpers.resetForm();
        }
    }
    const formik = useFormik({
        initialValues,
        onSubmit,
        enableReinitialize: true,
    });

    return (
        <div className={style.setTokenPriceForBuy}>
            <Typography className={style.label}>
                Set token price for buy (only owner)
            </Typography>
            <form onSubmit={formik.handleSubmit}
                  className={style.form}
            >
                <TextField fullWidth
                           size="small"
                           type="number"
                           inputProps={{
                               min: 1
                           }}
                           {...formik.getFieldProps('price')}
                           disabled={!window.ethereum || loading}
                           className={style.field}
                           sx={{
                               "& .MuiOutlinedInput-notchedOutline": {
                                   border: "none"
                               }
                           }}
                />

                <Button type="submit"
                        variant="contained"
                        fullWidth
                        className={style.buyBtn}
                        disabled={!window.ethereum || loading}
                        size="small"
                        color="warning"
                        disableElevation
                >
                    <div className={style.preloaderWrapper}>
                        <p>set</p>
                        {
                            loading &&
                            <div className={style.preloader}>
                                <CircularProgress color="success" size={25}/>
                            </div>
                        }
                    </div>
                </Button>
            </form>
        </div>
    )
})
