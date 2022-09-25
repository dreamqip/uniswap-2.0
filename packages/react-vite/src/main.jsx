import {createRoot} from "react-dom/client";
import {lazy, StrictMode} from "react";
import App from "./App";
import {DAPP_CONFIG} from "./config";

const DAppProvider = lazy(() => import("@usedapp/core").then(({DAppProvider}) => ({default: DAppProvider})));

import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
    <StrictMode>
        <DAppProvider config={DAPP_CONFIG}>
            <App/>
        </DAppProvider>
    </StrictMode>
);
