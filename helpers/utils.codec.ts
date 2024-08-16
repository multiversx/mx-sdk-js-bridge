import BigNumber from "bignumber.js";

export function numberToPaddedHex(value: bigint | number | BigNumber.Value) {
    let hexableNumber: { toString(radix?: number): string };

    if (typeof value === "bigint" || typeof value === "number") {
        hexableNumber = value;
    } else {
        hexableNumber = new BigNumber(value);
    }

    const hex = hexableNumber.toString(16);
    return zeroPadStringIfOddLength(hex);
}

export function zeroPadStringIfOddLength(input: string): string {
    input = input || "";

    if (input.length % 2 == 1) {
        return "0" + input;
    }

    return input;
}
