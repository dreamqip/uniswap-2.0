import React from "react"
import styles from "./styles";
import {uniswapLogo} from "./assets";
import {useEthers} from "@usedapp/core";
import Loader from "./components/Loader";
import Exchange from "./components/Exchange";
import WalletButton from "./components/WalletButton";

const App = () => {
    const {account} = useEthers();
    const poolsLoading = false;

    return (
        <div className={styles.container}>
            <div className={styles.innerContainer}>
                <header className={styles.header}>
                    <img
                        src={uniswapLogo}
                        alt="uniswapLogo"
                        className="w-16 h-16 object-contain"
                    />
                    <WalletButton/>
                </header>

                <div className={styles.exchangeContainer}>
                    <h1 className={styles.headTitle}>Uniswap 2.0</h1>
                    <p className={styles.subTitle}>Exchange tokens</p>

                    <div className={styles.exchangeBoxWrapper}>
                        <div className={styles.exchangeBox}>
                            <div className="pink_gradient"/>
                            <div className={styles.exchange}>
                                {account
                                    ? poolsLoading ? <Loader title="Loading pools, please wait!"/> : <Exchange/>
                                    : <Loader title="Please connect your wallet"/>
                                }
                            </div>
                            <div className="blue_gradient"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;