import React, {useEffect, useRef, useState} from 'react';
import styles from "../styles/index.js";
import {chevronDown} from "../assets/index.js";
import {useAmountsOut, useOnClickOutside} from "../utils/index.js";
import {formatUnits} from "ethers/lib/utils.js";

const AmountOut = ({
                       fromToken,
                       toToken,
                       amountIn,
                       pairAddress,
                       currencyValue,
                       onSelectedCurrencyChange,
                       availableTokens
                   }) => {
    const [showList, setShowList] = useState(false);
    const [activeToken, setActiveToken] = useState('Select a token');
    const tokenListRef = useRef(null);
    const amountOut = useAmountsOut(pairAddress, amountIn, fromToken, toToken) ?? "0";

    useOnClickOutside(tokenListRef, () => setShowList(false));

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
        setShowList(false);
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
            <div className="relative" onClick={() => setShowList((prevState) => !prevState)}>
                <button className={styles.currencyButton}>
                    {activeToken}
                    <img
                        src={chevronDown}
                        alt="chevron"
                        className={`w-4 h-4 object-contain ml-2 ${showList ? "rotate-180" : "rotate-0"}`}
                    />
                </button>

                {showList && (
                    <ul ref={tokenListRef} className={styles.currencyList}>
                        {Object.entries(availableTokens).map(([token, tokenName], index) => (
                            <li
                                onClick={() => activeTokenHandler(token, tokenName)}
                                key={index}
                                className={styles.currencyListItem}
                            >
                                {tokenName}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AmountOut;