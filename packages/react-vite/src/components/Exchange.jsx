import React, {useEffect, useState} from 'react';
import AmountIn from "./AmountIn.jsx";
import AmountOut from "./AmountOut.jsx";
import Balance from "./Balance.jsx";
import {
    findPoolByTokens,
    getAvailableTokens,
    getCounterpartTokens,
    getFailureMessage,
    getSuccessMessage,
    isOperationPending
} from "../utils/index.js";
import styles from "../styles/index.js";
import clsx from "clsx";
import {ERC20, useContractFunction, useEthers, useTokenAllowance, useTokenBalance} from "@usedapp/core";
import {parseUnits} from "ethers/lib/utils";
import {Contract, ethers} from "ethers";
import {ROUTER_ADDRESS} from "../config.js";
import {abis} from "@my-app/contracts";

const Exchange = ({pools}) => {
    const {account} = useEthers();
    const [fromValue, setFromValue] = useState("0");
    const [fromToken, setFromToken] = useState(pools[0].token0Address);
    const [toToken, setToToken] = useState("");
    const [resetState, setResetState] = useState(false);

    const fromValueBigNumber = parseUnits(fromValue || "0");
    const availableTokens = getAvailableTokens(pools);
    const counterpartTokens = getCounterpartTokens(pools, fromToken);
    const pairAddress = findPoolByTokens(pools, fromToken, toToken)?.address ?? "";

    const routerContract = new Contract(ROUTER_ADDRESS, abis.router02);
    const fromTokenContract = new Contract(fromToken, ERC20.abi);
    const fromTokenBalance = useTokenBalance(fromToken, account);
    const toTokenBalance = useTokenBalance(toToken, account);
    const tokenAllowance = useTokenAllowance(fromToken, account, ROUTER_ADDRESS) || parseUnits("0");
    const approvedNeeded = fromValueBigNumber.gt(tokenAllowance);
    const fromValueIsGreaterZero = fromValueBigNumber.gt(parseUnits("0"));
    const hasEnoughBalance = fromValueBigNumber.lte(fromTokenBalance ?? parseUnits("0"));

    const {state: swapApproveState, send: swapApproveSend} = useContractFunction(fromTokenContract, "approve", {
        transactionName: "onApproveRequested",
        gasLimitBufferPercentage: 10,
    });

    const {
        state: swapExecuteState,
        send: swapExecuteSend
    } = useContractFunction(routerContract, "swapExactTokensForTokens", {
        transactionName: "swapExactTokensForTokens",
        gasLimitBufferPercentage: 10,
    });


    const isApproving = isOperationPending(swapApproveState);
    const isSwapping = isOperationPending(swapExecuteState);
    const canApprove = !isApproving && approvedNeeded;
    const canSwap = !isSwapping && !approvedNeeded && fromValueIsGreaterZero && hasEnoughBalance;

    const successMessage = getSuccessMessage(swapApproveState, swapExecuteState);
    const failureMessage = getFailureMessage(swapApproveState, swapExecuteState);

    const approveButtonClass = clsx(styles.actionButton, {
        'bg-site-pink text-white': canApprove,
        'bg-site-dim2 text-site-dim2': !canApprove,
    })

    const swapButtonClass = clsx(styles.actionButton, {
        'bg-site-pink text-white': canSwap,
        'bg-site-dim2 text-site-dim2': !canSwap,
    })

    const onApproveRequested = () => {
        swapApproveSend(ROUTER_ADDRESS, ethers.constants.MaxInt256);
    }

    const onSwapRequested = () => {
        swapExecuteSend(
            fromValueBigNumber,
            0,
            [fromToken, toToken],
            account,
            Math.floor(Date.now() / 1000) + 60 * 20
        ).then(() => {
            setFromValue("0");
        })
    }

    const onFromValueChange = (value) => {
        const trimmedValue = value.trim();

        try {
            trimmedValue && parseUnits(value);
            setFromValue(value);
        } catch (e) {
            console.log(e);
        }
    }

    const onFromTokenChange = (value) => {
        setFromToken(value);
    }

    const onToTokenChange = (value) => {
        setToToken(value);
    }

    useEffect(() => {
        if (successMessage || failureMessage) {
            setTimeout(() => {
                setResetState(true);
                setFromValue("0");
                setToToken("");
            }, 5000);
        }
    }, [successMessage, failureMessage]);

    return (
        <div className="flex flex-col w-full items-center">
            <div className="mb-8">
                <AmountIn
                    value={fromValue}
                    onChange={onFromValueChange}
                    currencyValue={fromToken}
                    onSelectedCurrencyChange={onFromTokenChange}
                    availableTokens={availableTokens}
                    isSwapping={isSwapping && hasEnoughBalance}
                />
                <Balance
                    tokenBalance={fromTokenBalance}
                />
            </div>
            <div className="mb-8 w-full">
                <AmountOut
                    fromToken={fromToken}
                    toToken={toToken}
                    amountIn={fromValueBigNumber}
                    pairAddress={pairAddress}
                    currencyValue={toToken}
                    onSelectedCurrencyChange={onToTokenChange}
                    availableTokens={counterpartTokens}
                />
                <Balance
                    tokenBalance={toTokenBalance}
                />
            </div>

            {approvedNeeded && !isSwapping
                ? <button
                    onClick={onApproveRequested}
                    disabled={!canApprove}
                    className={approveButtonClass}
                >
                    {isApproving ? 'Approving...' : 'Approve'}
                </button>
                : <button
                    onClick={onSwapRequested}
                    disabled={!canSwap}
                    className={swapButtonClass}
                >
                    {isSwapping ? 'Swapping...' : hasEnoughBalance ? 'Swap' : 'Insufficient balance'}
                </button>
            }

            {failureMessage && !resetState
                ? <p className={styles.message}>{failureMessage}</p>
                : successMessage ? <p className={styles.message}>{successMessage}</p> : ''
            }
        </div>
    );
};

export default Exchange;