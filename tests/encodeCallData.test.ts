import {
    encodeCallData,
    addEndpointName,
    addGasLimit,
    addArgs,
    ArgumentsPresentProtocolMarker,
} from '../helpers/encodeCallData';
import BigNumber from "bignumber.js";
describe('Encoding Functions', () => {
    // Define any shared constants or setup functions here
    const endpointName = 'testEndpoint';
    const gasLimit = 50000;
    const args = [42, 'hello'];

    const expectedLengthHex = "0000000c"
    const expectedNameHex = "74657374456e64706f696e74"
    const expectedGasLimitHex = "000000000000c350";
    const expectedNumArgumentsHex = "00000002";
    const expectedFirstArgumentLengthHex = "00000001";
    const expectedFirstArgumentValueHex = "2a";
    const expectedSecondArgumentLengthHex = "00000005";
    const expectedSecondArgumentValueHex = "68656c6c6f";

    describe('addEndpointName Function', () => {
        test('correctly adds the hex-encoded length and value of the endpoint name to the call data', () => {
            let callData = addEndpointName("", endpointName);
            expect(callData).toEqual(`${expectedLengthHex}${expectedNameHex}`);
        });
    });

    describe('addGasLimit Function', () => {
        test('correctly adds the hex-encoded gas limit, padded to the specified length, to the call data', () => {
            let callData = addGasLimit("", gasLimit);
            expect(callData).toEqual(expectedGasLimitHex);
        });
    });

    describe('addArgs Function', () => {
        test('Correctly encodes the arguments` lengths and values and adds them to the call data.', () => {
            let callData = addArgs("", args);
            expect(callData).toEqual(`01${expectedNumArgumentsHex}${expectedFirstArgumentLengthHex}${expectedFirstArgumentValueHex}${expectedSecondArgumentLengthHex}${expectedSecondArgumentValueHex}`);
        });
    });

    describe('addArgs Function', () => {
        test('works with BigNumber', () => {
            const args = [BigNumber(42), 'hello'];
            let callData = addArgs("", args);
            expect(callData).toEqual(`${ArgumentsPresentProtocolMarker}${expectedNumArgumentsHex}${expectedFirstArgumentLengthHex}${expectedFirstArgumentValueHex}${expectedSecondArgumentLengthHex}${expectedSecondArgumentValueHex}`);
        });
    });

    describe('encodeCallData Function', () => {
        test('correctly concatenates the encoded endpoint name, gas limit, and arguments into a single hex string', () => {
            const result = encodeCallData(endpointName, gasLimit, args);
            const expected = `0x${expectedLengthHex}${expectedNameHex}${expectedGasLimitHex}${ArgumentsPresentProtocolMarker}${expectedNumArgumentsHex}${expectedFirstArgumentLengthHex}${expectedFirstArgumentValueHex}${expectedSecondArgumentLengthHex}${expectedSecondArgumentValueHex}`;
            expect(result).toEqual(expected);
        });
    });

    describe('encodeCallData Function', () => {
        test('works and generate the same encodedData as on go codec', () => {
            const expected = '0x0000000c656e64706f696e744e616d650000000002faf0800100000002000000012500000009737472696e67417267';
            const endpointName = 'endpointName';
            const gasLimit = 50000000;
            const args = [37, 'stringArg'];
            const result = encodeCallData(endpointName, gasLimit, args);
            expect(result).toEqual(expected);
        });
    });

});
