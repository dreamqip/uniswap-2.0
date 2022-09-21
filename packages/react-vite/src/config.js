import {Goerli} from "@usedapp/core";

export const ROUTER_ADDRESS = "0x8cf5eedc2dab303bb0530bbac91393a686c345f5cdc0e82f0a7da711ebafc911";

export const DAPP_CONFIG = {
    readOnlyChainId: Goerli.chainId,
    readOnlyUrls: {
        [Goerli.chainId]: "https://eth-goerli.g.alchemy.com/v2/ki3dX-O1VaMfWELGmlBr1McBJs-KbD_U",
    },
};