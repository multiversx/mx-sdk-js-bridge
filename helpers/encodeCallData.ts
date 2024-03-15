import BigNumber from "bignumber.js";
import { numberToPaddedHex } from "@multiversx/sdk-core/out/utils.codec";

const uint32ArgBytes = 8
const uint64ArgBytes = 16

/**
 * Encodes call data for the deposit function with simplified argument handling.
 * Automatically attempts to detect and encode integers and strings.
 *
 * @param {string} endpointName - The name of the endpoint for the cross-chain call.
 * @param {number} gasLimit - The gas limit for the cross-chain call.
 * @param {any[]} args - The arguments for the cross-chain call, assumed to be strings or numbers.
 * @returns {string} The encoded callData string.
 */
export function encodeCallData(endpointName: string, gasLimit: number, args: any[]): string {
    let callData = '0x01';
    callData = addEndpointName(callData, endpointName);
    callData = addGasLimit(callData, gasLimit);
    callData = addArgs(callData, args);

    return callData;
}

export function addEndpointName(callData: string, endpointName: string): string {
    const endpointNameBuffer = Buffer.from(endpointName, 'utf8');
    const endpointNameLength = new BigNumber(endpointNameBuffer.length).toString(16).padStart(uint32ArgBytes, '0');
    const endpointNameHex = endpointNameBuffer.toString('hex');
    return callData + endpointNameLength + endpointNameHex;
}

export function addGasLimit(callData: string, gasLimit: number): string {
    const gasLimitHex = new BigNumber(gasLimit).toString(16).padStart(uint64ArgBytes, '0');
    return callData + gasLimitHex;
}

export function addArgs(callData: string, args: any[]): string {
    const numArgsHex = new BigNumber(args.length).toString(16).padStart(uint32ArgBytes, '0');
    let encodedArgs = '';
    args.forEach(arg => {
        let argHex, argLengthHex;
        if (typeof arg === 'number' || (!isNaN(arg) && !isNaN(parseFloat(arg)))) {
            // Treat as number and convert to padded hex
            argHex = numberToPaddedHex(arg);
        } else {
            // Treat as string
            const argBuffer = Buffer.from(arg, 'utf8');
            argHex = argBuffer.toString('hex');
        }
        argLengthHex = new BigNumber(argHex.length / 2).toString(16).padStart(uint32ArgBytes, '0');
        encodedArgs += argLengthHex + argHex;
    });
    return callData + numArgsHex + encodedArgs;
}


module.exports = {
    encodeCallData,
    addEndpointName,
    addGasLimit,
    addArgs
};
