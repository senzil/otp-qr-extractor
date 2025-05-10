import base32 from 'hi-base32';
import { dirname, join } from 'path';
import protobuf from 'protobufjs';
import { fileURLToPath } from 'url';

// ESM __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Decode the Google Authenticator migration payload (Protocol Buffer)
 * @param {Uint8Array} buffer - Buffer of the binary payload
 * @returns {Promise<Object>} - Object with otpParameters array
 */
export async function decodeOtpBuffer(buffer) {
  const root = await protobuf.load(join(__dirname, 'migration-payload.proto'));
  const Payload = root.lookupType('MigrationPayload');
  const err = Payload.verify(buffer);
  if (err) throw new Error(`Invalid payload: ${err}`);
  const message = Payload.decode(buffer);
  return Payload.toObject(message, { enums: String, longs: String });
}

/**
 * Print OTP codes from decoded payload
 * @param {{ otpParameters: Array }} payloadObj
 */
export function printOtps(payloadObj) {
  for (const otp of payloadObj.otpParameters) {
    const secretBase32 = base32.encode(otp.secret);
    console.log(`Issuer: ${otp.issuer}`);
    console.log(`Name:   ${otp.name}`);
    console.log(`Secret: ${secretBase32}`);
    console.log('-----------------------------------');
  }
}