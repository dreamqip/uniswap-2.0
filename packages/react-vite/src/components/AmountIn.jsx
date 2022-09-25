import React, {useEffect, useRef, useState} from 'react';
import styles from "../styles";
import {chevronDown} from "../assets/index.js";
import {useOnClickOutside} from "../utils/index.js";

const AmountIn = ({
                      value,
                      currencyValue,
                      onChange,
                      onSelectedCurrencyChange,
                      isSwapping,
                      availableTokens
                  }) => {
    const [showList, setShowList] = useState(false);
    const [activeToken, setActiveToken] = useState('Select a token');
    const tokenListRef = useRef(null);

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
                value={value}
                type="number"
                placeholder="0.0"
                disabled={isSwapping}
                onChange={(e) => typeof onChange === 'function' && onChange(e.target.value)}
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
                    <ul
                        ref={tokenListRef}
                        className={styles.currencyList}
                    >
                        {Object.entries(availableTokens).map(([token, tokenName], index) => (
                            <li
                                onClick={() => activeTokenHandler(token, tokenName)}
                                key={index}
                                className={`${styles.currencyListItem} ${activeToken === tokenName ? 'bg-site-dim2' : ''} cursor-pointer`}>
                                {tokenName}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AmountIn;