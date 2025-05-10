# otp-qr-extractor

CLI tool to extract OTP secrets from QR code images (e.g. from Google Authenticator), with multi-QR support.

## Installation

```bash
npm install -g @senzil/otp-qr-extractor
```

## Usage
```bash
npx @senzil/otp-qr-extractor path/to/qr.png
```

## Development and Testing
```bash
git clone https://github.com/senzil/otp-qr-extractor.git
npm install
npx jest
```
Sample test image: test/sample.png
```bash
npx . test/sample.png
```
