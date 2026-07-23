// Excludes visually ambiguous characters (I, O, 0, 1).
const PNR_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const PNR_LENGTH = 6;

export function generatePnr(): string {
  let out = "";
  for (let i = 0; i < PNR_LENGTH; i++) {
    out += PNR_ALPHABET[Math.floor(Math.random() * PNR_ALPHABET.length)];
  }
  return out;
}
