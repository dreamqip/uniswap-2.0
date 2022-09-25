import {Goerli} from "@usedapp/core";

export const ROUTER_ADDRESS = "0xEf40090C6C0Daf87658c21A03E7F1eF955ae99e6";

export const DAPP_CONFIG = {
    readOnlyChainId: Goerli.chainId,
    readOnlyUrls: {
        [Goerli.chainId]: "https://eth-goerli.g.alchemy.com/v2/ki3dX-O1VaMfWELGmlBr1McBJs-KbD_U",
    },
};