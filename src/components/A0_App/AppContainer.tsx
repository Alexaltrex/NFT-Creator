import {rootStore, RootStore} from "../../store/RootStore";
import React, {createContext} from "react";
import { App } from "./App";
import {HashRouter} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "react-query";

export const StoreContext = createContext<RootStore>({} as RootStore);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: Infinity,
        }
    }
});

export const AppContainer = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <StoreContext.Provider value={rootStore}>
                <HashRouter>
                    <App/>
                </HashRouter>
            </StoreContext.Provider>
        </QueryClientProvider>
    )
}
