const { execSync } = require('child_process');

describe('OTP QR Extractor CLI', () => {
    beforeAll(() => {
        execSync('node test/generateTest.js');
    });

    test('extracts OTP from generated QR', () => {
        const output = execSync('node bin/cli.js test/sample.png').toString();
        expect(output).toMatch(/Issuer: Example1/);
        expect(output).toMatch(/Name:   user1@example.com/);
        expect(output).toMatch(/Issuer: Example2/);
        expect(output).toMatch(/Name:   user2@example.com/);
        expect(output).toMatch(/Secret:/);
    });
});