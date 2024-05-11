import { ExternalLink } from '@/components/external-link'

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-2xl bg-zinc-50 sm:p-8 p-4 text-sm sm:text-base">
        <h1 className="text-2xl sm:text-3xl tracking-tight font-semibold max-w-fit inline-block">
          AI Travel Agent
        </h1>
        <p className="leading-normal text-zinc-900">
          Hi im Danny , your AI Travel Agent for flights. You can book a flight
          with me , cancel it , change seats and much more. Where are we flying
          today ?
        </p>
      </div>
    </div>
  )
}
