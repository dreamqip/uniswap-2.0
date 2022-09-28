import React, {useEffect, useState} from 'react';
import styles from "../styles/index.js";
import {chevronDown} from "../assets/index.js";
import {useAmountsOut} from "../utils/index.js";
import {formatUnits} from "ethers/lib/utils.js";
import CurrencyDialog from "./CurrencyDialog.jsx";
import clsx from "clsx";

const AmountOut = ({
                       fromToken,
                       toToken,
                       amountIn,
                       pairAddress,
                       currencyValue,
                       onSelectedCurrencyChange,
                       availableTokens
                   }) => {
    const [showModal, setShowModal] = useState(false);
    const [activeToken, setActiveToken] = useState('Select a token');
    const amountOut = useAmountsOut(pairAddress, amountIn, fromToken, toToken) ?? "0";

    useEffect(() => {
        if (Object.keys(availableTokens).includes(currencyValue)) {
            setActiveToken(availableTokens[currencyValue]);
        } else {
            setActiveToken('Select a token');
        }
    }, [currencyValue, availableTokens]);

    const activeTokenHandler = (token, tokenName) => {
        if (typeof onSelectedCurrencyChange === 'function') {
            onSelectedCurrencyChange(token);
        }
        setActiveToken(tokenName);
        setShowModal(false);
    }

    const openModal = () => {
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
    }

    return (
        <div className={styles.amountContainer}>
            <input
                type="number"
                placeholder="0.0"
                readOnly={true}
                value={formatUnits(amountOut)}
                className={styles.amountInput}
            />
                <button onClick={openModal} type="button" className={clsx(styles.currencyButton, 'max-w-[100px] xs:max-w-full')}>
                    <span className="text-ellipsis whitespace-nowrap overflow-hidden">{activeToken}</span>
                    <img
                        src={chevronDown}
                        alt="chevron"
                        className={clsx('w-4 h-4 object-contain ml-2', showModal ? 'rotate-180' : 'rotate-0')}
                    />
                </button>

                <CurrencyDialog
                    tokenHandler={activeTokenHandler}
                    availableTokens={availableTokens}
                    showModal={showModal}
                    closeModal={closeModal}
                />
        </div>
    );
};

export default AmountOut;