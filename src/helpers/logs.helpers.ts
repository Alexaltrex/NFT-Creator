import {getDate} from "./helpers";
import {
    BuySellShopLogUnhandledType,
    PriceLogUnhandledType,
} from "../types/log.type";

export const priceLogArgsHandler = (args: PriceLogUnhandledType) => (
    args ? ({
        oldValue: String(args[0].toNumber()),
        newValue: String(args[1].toNumber()),
        timestamp: getDate(args[2].toNumber()),
    }) : ({
        oldValue: '',
        newValue: '',
        timestamp: '',
    })
);

export const buyFromShopLogArgsHandler = (args: BuySellShopLogUnhandledType) => (
    args ? ({
        buyer: args[0],
        tokenId: String(args[1].toNumber()),
        price: String(args[2].toNumber()),
        timestamp: getDate(args[3].toNumber()),
    }) : ({
        buyer: '',
        tokenId: '',
        price: '',
        timestamp: '',
    })
);
