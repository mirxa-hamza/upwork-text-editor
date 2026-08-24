/**
 * Unicode "Mathematical Alphanumeric Symbols" block (U+1D400–U+1D7FF).
 *
 * Upwork's plain-text fields strip HTML/CSS formatting, but they can't strip
 * Unicode. So instead of *applying* bold/italic formatting, we swap each
 * letter for a different Unicode codepoint that already looks bold/italic.
 * This module is the codepoint math behind that trick — no DOM, no React,
 * just character mapping, so it's trivial to unit test in isolation.
 *
 * Ranges used:
 *   Bold          A-Z U+1D400   a-z U+1D41A   0-9 U+1D7CE
 *   Italic        A-Z U+1D434   a-z U+1D44E   (no digit variant exists)
 *   Bold Italic   A-Z U+1D468   a-z U+1D482   (no digit variant; falls back to Bold digits)
 *
 * Known Unicode gap: U+1D455 (mathematical italic small h) was never
 * assigned. Every "fancy text" generator substitutes U+210E (PLANCK
 * CONSTANT), which renders identically, and so do we.
 *
 * All of these codepoints live outside the Basic Multilingual Plane, so they
 * must be built with String.fromCodePoint (UTF-16 surrogate pairs), never
 * String.fromCharCode.
 */

export type InlineStyle = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
};

export const PLAIN_STYLE: InlineStyle = { bold: false, italic: false, underline: false };

const UPPER_A = 'A'.charCodeAt(0);
const UPPER_Z = 'Z'.charCodeAt(0);
const LOWER_A = 'a'.charCodeAt(0);
const LOWER_Z = 'z'.charCodeAt(0);
const DIGIT_0 = '0'.charCodeAt(0);
const DIGIT_9 = '9'.charCodeAt(0);

const BOLD_UPPER_BASE = 0x1d400;
const BOLD_LOWER_BASE = 0x1d41a;
const BOLD_DIGIT_BASE = 0x1d7ce;

const ITALIC_UPPER_BASE = 0x1d434;
const ITALIC_LOWER_BASE = 0x1d44e;
const ITALIC_SMALL_H_FALLBACK = 0x210e; // PLANCK CONSTANT — fills the U+1D455 gap

const BOLD_ITALIC_UPPER_BASE = 0x1d468;
const BOLD_ITALIC_LOWER_BASE = 0x1d482;

function isUpper(code: number): boolean {
  return code >= UPPER_A && code <= UPPER_Z;
}
function isLower(code: number): boolean {
  return code >= LOWER_A && code <= LOWER_Z;
}
function isDigit(code: number): boolean {
  return code >= DIGIT_0 && code <= DIGIT_9;
}

/**
 * Maps one plain-ASCII letter/digit to its styled Mathematical Alphanumeric
 * Symbols equivalent. Anything else (spaces, punctuation, non-Latin script,
 * emoji, already-Unicode text) is returned unchanged — there's no styled
 * variant for it, so passing it through untouched is the honest behavior
 * rather than silently mangling or dropping it.
 */
export function toStyledChar(char: string, style: { bold: boolean; italic: boolean }): string {
  if (!style.bold && !style.italic) return char;
  if (char.length !== 1) return char; // defensive: single UTF-16 unit only

  const code = char.charCodeAt(0);

  if (isUpper(code)) {
    if (style.bold && style.italic) return String.fromCodePoint(BOLD_ITALIC_UPPER_BASE + (code - UPPER_A));
    if (style.bold) return String.fromCodePoint(BOLD_UPPER_BASE + (code - UPPER_A));
    return String.fromCodePoint(ITALIC_UPPER_BASE + (code - UPPER_A));
  }

  if (isLower(code)) {
    if (style.bold && style.italic) return String.fromCodePoint(BOLD_ITALIC_LOWER_BASE + (code - LOWER_A));
    if (style.bold) return String.fromCodePoint(BOLD_LOWER_BASE + (code - LOWER_A));
    if (char === 'h') return String.fromCodePoint(ITALIC_SMALL_H_FALLBACK); // U+1D455 gap
    return String.fromCodePoint(ITALIC_LOWER_BASE + (code - LOWER_A));
  }

  if (isDigit(code)) {
    // No italic digit variant exists in Unicode at all. Bold and bold-italic
    // both fall back to the one available serif "bold" digit set; an
    // italic-only run leaves digits as plain ASCII.
    if (style.bold) return String.fromCodePoint(BOLD_DIGIT_BASE + (code - DIGIT_0));
    return char;
  }

  return char;
}

/** Combining Low Line (U+0332) — draws an underline under the preceding character. */
export const COMBINING_UNDERLINE = '\u0332';

/**
 * Applies bold/italic Unicode substitution and, if requested, an underline
 * combining character, to an entire string. Iterates by Unicode codepoint
 * (via Array.from) so it never splits an existing surrogate pair.
 */
export function styleText(text: string, style: InlineStyle): string {
  if (!text) return text;
  const chars = Array.from(text);
  return chars
    .map((ch) => {
      const styled = toStyledChar(ch, style);
      return style.underline ? styled + COMBINING_UNDERLINE : styled;
    })
    .join('');
}
