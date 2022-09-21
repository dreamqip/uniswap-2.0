import {createRoot} from "react-dom/client";
import {DAppProvider} from "@usedapp/core";
import {StrictMode} from "react";

import App from "./App";
import {DAPP_CONFIG} from "./config";

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
