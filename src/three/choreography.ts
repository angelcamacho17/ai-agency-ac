/**
 * Per-chapter staging for the sculpture. One row per state:
 *
 *  0 THE SCULPTOR  hero          -> right lane (copy owns the left column)
 *  1 THE MIND      anatomy       -> left lane
 *  2 THE NETWORK   capabilities  -> right lane
 *  3 THE ASCENT    process       -> left lane
 *  4 THE MARK      final CTA     -> center stage, lifted above the closing copy
 *
 * LANE/LIFT are fractions of the visible half-width/half-height at the
 * camera's distance, so the framing holds on any aspect ratio. The object
 * glides between lanes exactly while a morph gap crosses the viewport, so it
 * always travels on an open stage with nothing above it.
 */
export const CHAPTER_Z = [5.0, 5.5, 6.3, 5.8, 6.1]
export const CHAPTER_LANE = [0.46, -0.46, 0.46, -0.46, 0]
export const CHAPTER_LIFT = [0, 0, 0, 0, 0.42]
export const CHAPTER_SCALE = [1.04, 0.8, 0.84, 0.94, 0.92]
