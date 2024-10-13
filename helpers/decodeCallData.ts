import BigNumber from "bignumber.js";

const uint32ArgBytes = 8
const uint64ArgBytes = 16
const ArgumentsPresentProtocolMarkerHex = '01'

/**
 * Decodes call data into the endpoint name, gas limit, and arguments.
 * Arguments are returned as hex strings.
 * 
 * It returns undefined if the call data is invalid.
 * 
 * @param {string} callData - The call data to decode.
 * @returns {object} The decoded call data.
 */
export function decodeCallData(
  callData: string
): {
  endpointName: string,
  gasLimit: number,
  args: string[]
} | undefined {
  try {
    let offset = 2; // Skip '0x'

    // Extract endpoint name
    if (callData.length < offset + uint32ArgBytes) {
      throw new Error('Invalid endpoint name length');
    }
    const endpointNameLengthHex = callData.slice(offset, offset + uint32ArgBytes);
    const endpointNameLength = new BigNumber(endpointNameLengthHex, 16).toNumber();
    offset += uint32ArgBytes;

    if (callData.length < offset + endpointNameLength * 2) {
      throw new Error('Invalid endpoint name');
    }
    const endpointNameHex = callData.slice(offset, offset + endpointNameLength * 2);
    const endpointName = Buffer.from(endpointNameHex, 'hex').toString('utf8');
    offset += endpointNameLength * 2;

    // Extract gas limit
    if (callData.length < offset + uint64ArgBytes) {
      throw new Error('Invalid gas limit length');
    }
    const gasLimitHex = callData.slice(offset, offset + uint64ArgBytes);
    const gasLimit = new BigNumber(gasLimitHex, 16).toNumber();
    offset += uint64ArgBytes;

    // Extract arguments
    if (callData.length < offset + 2) {
      throw new Error('Invalid protocol marker length');
    }
    const protocolMarker = callData.slice(offset, offset + 2);
    offset += 2;

    let args: string[] = [];
    if (protocolMarker === ArgumentsPresentProtocolMarkerHex) {
      if (callData.length < offset + uint32ArgBytes) {
        throw new Error('Invalid number of arguments length');
      }
      const numArgsHex = callData.slice(offset, offset + uint32ArgBytes);
      const numArgs = new BigNumber(numArgsHex, 16).toNumber();
      offset += uint32ArgBytes;

      for (let i = 0; i < numArgs; i++) {
        if (callData.length < offset + uint32ArgBytes) {
          throw new Error('Invalid argument length');
        }
        const argLengthHex = callData.slice(offset, offset + uint32ArgBytes);
        const argLength = new BigNumber(argLengthHex, 16).toNumber();
        offset += uint32ArgBytes;

        if (callData.length < offset + argLength * 2) {
          throw new Error('Invalid argument');
        }
        const argHex = callData.slice(offset, offset + argLength * 2);
        offset += argLength * 2;

        args.push(argHex);
      }
    }

    return { endpointName, gasLimit, args };
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to decode call data: ${error.message}`);
    } else {
      console.error(`Failed to decode data: Unknown error`);
    }
    return;
  }
}