import { encodeCallData, addEndpointName, addGasLimit, addArgs } from '../helpers/encodeCallData';
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
            expect(callData).toEqual(`${expectedNumArgumentsHex}${expectedFirstArgumentLengthHex}${expectedFirstArgumentValueHex}${expectedSecondArgumentLengthHex}${expectedSecondArgumentValueHex}`);
        });
    });

    describe('encodeCallData Function', () => {
        test('correctly concatenates the encoded endpoint name, gas limit, and arguments into a single hex string', () => {
            const result = encodeCallData(endpointName, gasLimit, args);
            const expected = `0x01${expectedLengthHex}${expectedNameHex}${expectedGasLimitHex}${expectedNumArgumentsHex}${expectedFirstArgumentLengthHex}${expectedFirstArgumentValueHex}${expectedSecondArgumentLengthHex}${expectedSecondArgumentValueHex}`;
            expect(result).toEqual(expected);
        });
    });
});
