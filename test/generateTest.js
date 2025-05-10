#!/usr/bin/env node
import protobuf from 'protobufjs';
import QRCode from 'qrcode';

(async () => {
    // Sample OTP parameters for two accounts
    const otpParams = [
        {
            issuer: 'Example1',
            name: 'user1@example.com',
            secret: Uint8Array.from(Buffer.from('11111111111111111111'))
        },
        {
            issuer: 'Example2',
            name: 'user2@example.com',
            secret: Uint8Array.from(Buffer.from('22222222222222222222'))
        }
    ];

    // Load protobuf definition
    const root = await protobuf.load('lib/migration-payload.proto');
    const Payload = root.lookupType('MigrationPayload');

    // Create a payload containing both OTP parameters
    const payloadMsg = Payload.create({ otpParameters: otpParams });
    const buf = Payload.encode(payloadMsg).finish();
    const b64 = Buffer.from(buf).toString('base64');
    const uri = `otpauth-migration://offline?data=${b64}`;

    // Generate a single QR code image with both parameters
    const qrPath = 'test/sample.png';
    await QRCode.toFile(qrPath, uri, { type: 'png', width: 400 });
    console.log(`Generated multi-QR payload image: ${qrPath}`);
})();