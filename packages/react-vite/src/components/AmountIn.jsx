import React, {useEffect, useState} from 'react';
import styles from "../styles";
import {chevronDown} from "../assets/index.js";
import CurrencyDialog from "./CurrencyDialog.jsx";
import clsx from "clsx";

const AmountIn = ({
                      value,
                      currencyValue,
                      onChange,
                      onSelectedCurrencyChange,
                      isSwapping,
                      availableTokens
                  }) => {
    const [showModal, setShowModal] = useState(false);
    const [activeToken, setActiveToken] = useState('Select a token');

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
                value={value}
                type="number"
                placeholder="0.0"
                disabled={isSwapping}
                onChange={(e) => typeof onChange === 'function' && onChange(e.target.value)}
                className={styles.amountInput}
            />
            <button title={activeToken} onClick={openModal} type="button" className={clsx(styles.currencyButton, 'max-w-[100px] xs:max-w-full')}>
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

export default AmountIn;