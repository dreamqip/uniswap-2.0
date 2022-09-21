import React, {useEffect, useState} from 'react';
import {shortenAddress, useEthers, useLookupAddress} from "@usedapp/core";
import styles from "../styles";

const WalletButton = () => {
    const [renderedAddress, setRenderedAddress] = useState('');
    const {ens} = useLookupAddress();
    const {activateBrowserWallet, deactivate, account} = useEthers();

    useEffect(() => {
        if (ens) {
            setRenderedAddress(ens);
        } else if (account) {
            setRenderedAddress(shortenAddress(account));
        } else {
            setRenderedAddress('');
        }
    }, [account, ens, setRenderedAddress]);

    const handleConnect = () => {
        if (!account) {
            activateBrowserWallet();
        } else {
            deactivate();
        }
    }

    return (
        <button
            className={styles.walletButton}
            onClick={handleConnect}
        >
            {renderedAddress || 'Connect Wallet'}
        </button>
    );
};

export default WalletButton;