const crypto = require('crypto');
const fs = require('fs');

function getCipher(pubkey) {
  const algorithm = 'aes-192-ctr';
  const key = crypto.scryptSync(pubkey, 'salt', 24);
  const iv = Buffer.alloc(16, 0);

  return crypto.createCipheriv(algorithm, key, iv);
}

function getDecipher(pubkey) {
  const algorithm = 'aes-192-ctr';
  const key = crypto.scryptSync(pubkey, 'salt', 24);
  const iv = Buffer.alloc(16, 0);

  return crypto.createDecipheriv(algorithm, key, iv);
}

function encrypt(input, output, key, cb = () => {}) {
  const inp = fs.createReadStream(input);
  const outp = fs.createWriteStream(output);

  inp.on('error', cb);
  outp.on('error', cb);

  inp
    .pipe(getCipher(key))
    .pipe(outp)
    .on('close', cb);
}

function decrypt(input, output, key, cb = () => {}) {
  const inp = fs.createReadStream(input);
  const outp = fs.createWriteStream(output);

  inp.on('error', cb);
  outp.on('error', cb);

  inp
    .pipe(getDecipher(key))
    .pipe(outp)
    .on('close', cb);
}

module.exports = {
  getCipher,
  getDecipher,
  encrypt,
  decrypt,
};
