import axios from "axios";
import {ITokenJson} from "../types/types";

export const getTokenJson = async (uri: string): Promise<ITokenJson> => {
    const response = await axios.get(uri);
    return response.data;
}
