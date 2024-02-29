const Web3 = require('web3');

/**
 * Encodes call data for the deposit function with simplified argument handling.
 * Automatically attempts to detect and encode integers and strings.
 *
 * @param {string} endpointName - The name of the endpoint for the cross-chain call.
 * @param {number} gasLimit - The gas limit for the cross-chain call.
 * @param {any[]} args - The arguments for the cross-chain call, assumed to be strings or numbers.
 * @returns {string} The encoded callData string.
 */
function encodeCallData(endpointName, gasLimit, args) {
    const web3 = new Web3();

    // Convert endpoint name to bytes and prepend its length
    const endpointNameBytes = web3.utils.asciiToHex(endpointName);
    const endpointNameLength = web3.utils.leftPad(web3.utils.numberToHex(endpointNameBytes.length / 2), 8); // 4 bytes length

    // Convert gasLimit to 8 bytes hex string
    const gasLimitHex = web3.utils.leftPad(web3.utils.numberToHex(gasLimit), 16);

    // Encode arguments, automatically handling as strings or numbers
    let encodedArgs = '';
    args.forEach(arg => {
        let argHex;
        if (typeof arg === 'number' || (!isNaN(arg) && !isNaN(parseFloat(arg)))) {
            // Treat as number
            argHex = web3.utils.numberToHex(arg);
        } else {
            // Default to treating as string
            argHex = web3.utils.asciiToHex(arg);
        }
        const argLength = web3.utils.leftPad(web3.utils.numberToHex(argHex.length / 2), 8); // 4 bytes length
        encodedArgs += argLength.substr(2) + argHex.substr(2); // Remove '0x' prefix
    });

    // Number of arguments in 4 bytes hex string
    const numArgsHex = web3.utils.leftPad(web3.utils.numberToHex(args.length), 8);

    // Combine everything
    const callData = '01' + // Custom prefix
        endpointNameLength.substr(2) + // Remove '0x' prefix
        endpointNameBytes.substr(2) +
        gasLimitHex.substr(2) +
        numArgsHex.substr(2) +
        encodedArgs;

    return '0x' + callData;
}


module.exports = encodeCallData;
