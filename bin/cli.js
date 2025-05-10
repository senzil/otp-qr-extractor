#!/usr/bin/env node
import Jimp from 'jimp';
import jsQR from 'jsqr';
import { decodeOtpBuffer, printOtps } from '../lib/decodeOtp.js';

async function main() {
    const input = process.argv[2];
    if (!input) {
        console.error('Usage: otp-qr-extractor <path-or-url-to-image>');
        process.exit(1);
    }

    try {
        // Load image (Jimp handles local paths and URLs)
        const image = await Jimp.read(input);
        const { width, height, data } = image.bitmap;

        // Convert to Uint8ClampedArray for jsQR
        const pixels = new Uint8ClampedArray(data);
        const qr = jsQR(pixels, width, height, { inversionAttempts: 'dontInvert' });

        if (!qr) {
            console.error('No QR code found in the image.');
            process.exit(1);
        }

        // Extract 'data' param from the scanned URL
        const url = new URL(qr.data);
        const b64 = url.searchParams.get('data');
        if (!b64) {
            throw new Error('QR code URL does not contain a "data" parameter');
        }

        const otpBuffer = Buffer.from(b64, 'base64');
        const payloadObj = await decodeOtpBuffer(otpBuffer);
        printOtps(payloadObj);

    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

main();