import { decodeCallData } from "../helpers/decodeCallData";

describe('decodeCallData Function', () => {
  test('correctly decodes the call data into the endpoint name, gas limit, and arguments', () => {
    // Arrange
    const callData = '0x0000001563616c6c50617961626c6557697468506172616d730000000001312d000100000002000000012500000020fccb3543fe6585d4f89c1bd52151f44146d71de20a87e432a4fef733794308001';
    const expectedResult = {
      endpointName: 'callPayableWithParams',
      gasLimit: 20000000,
      args: [
        '25',
        'fccb3543fe6585d4f89c1bd52151f44146d71de20a87e432a4fef73379430800'
      ]
    }

    // Act
    const result = decodeCallData(callData);

    // Assert
    expect(result).toBeDefined();
    expect(result).toEqual(expectedResult);
  });
});