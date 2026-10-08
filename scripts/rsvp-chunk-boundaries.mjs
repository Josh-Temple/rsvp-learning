/**
 * Detect suspicious RSVP boundaries. Mechanical checks cannot certify
 * natural Japanese or the semantic correctness of a chunk.
 */
export function inspectRsvpChunkBoundaries(chunks) {
  const findings = [];
  if (!Array.isArray(chunks)) return findings;
  for (let index = 0; index < chunks.length - 1; index += 1) {
    const left = chunks[index]?.text;
    const right = chunks[index + 1]?.text;
    if (typeof left !== "string" || typeof right !== "string") continue;
    const a = left.trimEnd();
    const b = right.trimStart();
    if (!a || !b) continue;
    if (/[A-Za-z]$/.test(a) && /^[A-Za-z]/.test(b)) {
      findings.push({ index, code: "ADJACENT_LATIN_TEXT", severity: "ERROR", left, right });
      continue;
    }
    // Consecutive particles may form one grammatical unit (e.g. に + も).
    // REVIEW, not ERROR: Japanese grammar still needs a human judgment.
    if (/(?:に|で|と|へ)$/.test(a) && /^(?:も|は)(?=[\p{Script=Han}\p{Script=Katakana}])/u.test(b)) {
      findings.push({ index, code: "POSSIBLE_COMPOUND_PARTICLE_SPLIT", severity: "REVIEW", left, right });
      continue;
    }
    if (/(?:だけで|を|に|で|が|は|も|へ|と)$/.test(a)) {
      findings.push({ index, code: "POSSIBLE_PARTICLE_SPLIT", severity: "REVIEW", left, right });
    }
  }
  return findings;
}
