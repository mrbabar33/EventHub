const QRCode = require('qrcode');

// QR image ko base64 data URL ki shakal mein deta hai (img src mein seedha chalta hai)
async function generateQR(text) {
  return QRCode.toDataURL(text, { width: 300, margin: 1 });
}

module.exports = generateQR;