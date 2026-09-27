// Erzeugt den Hashwert für einen Kalender-Code (Klassenstufen-Sprung).
// Aufruf: node tools/kalender-code.mjs ABCD-1234   → Hash in src/content/calendarCodes.ts eintragen.
// Ohne Argument wird ein neuer Zufallscode vorgeschlagen. Klartext-Codes NIE committen.
import { createHash, randomInt } from 'node:crypto';

const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const SALT = 'netzblick-kalender-v1:';
const normalize = (s) => s.toUpperCase().replace(/[\s\-_.]/g, '').replace(/O/g, '0').replace(/[IL]/g, '1');

let code = process.argv[2];
if (!code) {
  code = Array.from({ length: 8 }, () => ALPHABET[randomInt(32)]).join('');
  code = code.slice(0, 4) + '-' + code.slice(4);
  console.log('Neuer Code:', code);
}
console.log('Hash:', createHash('sha256').update(SALT + normalize(code), 'utf8').digest('hex'));
