import { useLang } from '../lib/lang'

/**
 * The OpenAI Select Partner badge from the official partner kit, used exactly
 * as provided (white tile, black border) per OpenAI's sharing guidance. The
 * alt text carries the exact required phrase, so the credential is also
 * machine-readable wherever the badge appears.
 */
export function PartnerBadge({ className = 'h-14' }: { className?: string }) {
  const { t } = useLang()
  return (
    <a
      href={t.ORG.openAiPartnerUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${t.ORG.openAiPartner} — ${t.ORG.openAiPartnerNetwork}`}
      className="inline-block transition-transform hover:scale-[1.03] active:scale-[0.98]"
    >
      <img
        src="/partners/openai-select-partner.svg"
        alt={t.ORG.openAiPartner}
        width={375}
        height={177}
        className={`w-auto ${className}`}
      />
    </a>
  )
}
