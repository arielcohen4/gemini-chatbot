'use client'

/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import { useActions, useUIState } from 'ai/rsc'
import { Offer, Places } from '@duffel/api/types'

export const ListFlights = ({ offers }: { offers: Offer[] }) => {
  const { submitUserMessage } = useActions()
  const [_, setMessages] = useUIState()

  function formatISODuration(duration: string) {
    const regex = /P(?:\d+D)?T(\d+H)?(\d+M)?/
    const matches = duration.match(regex)
    let formattedDuration = ''

    if (matches) {
      const hours = matches[1] ? parseInt(matches[1]) : 0
      const minutes = matches[2] ? parseInt(matches[2]) : 0

      if (hours > 0) {
        formattedDuration += `${hours}hr `
      }
      if (minutes > 0) {
        formattedDuration += `${minutes}min`
      }
    }

    return formattedDuration.trim()
  }

  function formatISOHours(dateString: string) {
    let date = new Date(dateString)
    let hour = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })

    return hour
  }

  function formatISODate(dateString: string) {
    const date = new Date(dateString)

    // Format the date as desired
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })

    return formattedDate
  }

  return (
    <div className="grid gap-2 rounded-2xl border border-zinc-200 bg-white p-2 sm:p-4">
      <div className="grid gap-2 sm:flex sm:flex-row justify-between border-b p-2">
        <div className="sm:basis-1/4">
          <div className="text-xs text-zinc-600">Departure</div>
          <div className="font-medium">
            {(offers[0].slices[0].origin as Places).city_name}
          </div>
        </div>
        <div className="sm:basis-1/4">
          <div className="text-xs text-zinc-600">Arrival</div>
          <div className="font-medium">
            {(offers[0].slices[0].destination as Places).city_name}
          </div>
        </div>
        <div className="sm:basis-1/2">
          <div className="sm:text-right text-xs text-zinc-600">Date</div>
          <div className="sm:text-right font-medium">
            {formatISODate(offers[0].slices[0].segments[0].arriving_at)}
          </div>
        </div>
      </div>
      <div className="grid gap-3">
        {offers.length > 0 &&
          offers.map(offer => (
            <div
              key={offer.slices[0].segments[0].operating_carrier_flight_number}
              className="flex cursor-pointer flex-row items-start sm:items-center gap-4 rounded-xl p-2 hover:bg-zinc-50"
              onClick={async () => {
                const response = await submitUserMessage(
                  `The user has selected flight offer id ${offer.id}, departing at ${offer.slices[0].segments[0].departing_at} and arriving at ${offer.slices[0].segments[0].arriving_at} for $${offer.total_amount}. Now proceeding to select seats.`
                )
                setMessages((currentMessages: any[]) => [
                  ...currentMessages,
                  response
                ])
              }}
            >
              <div className="w-10 sm:w-12 shrink-0 aspect-square rounded-lg bg-zinc-50 overflow-hidden">
                <img
                  src={offer.owner.logo_symbol_url || undefined}
                  className="object-cover aspect-square"
                  alt="airline logo"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-4 items-start sm:gap-6 flex-1">
                <div className="col-span-2">
                  <div className="font-medium">
                    {formatISOHours(offer.slices[0].segments[0].departing_at)} -{' '}
                    {formatISOHours(offer.slices[0].segments[0].arriving_at)}
                  </div>
                  <div className="text-sm text-zinc-600">
                    {offer.owner.name}
                  </div>
                </div>
                <div>
                  <div className="font-medium">
                    {formatISODuration(offer.slices[0].duration as string)}
                  </div>
                  <div className="text-sm text-zinc-600">
                    {offer.slices[0].origin.iata_code} -{' '}
                    {offer.slices[0].destination.iata_code}
                  </div>
                </div>
                <div>
                  <div className="sm:text-right font-medium font-mono">
                    ${offer.total_amount}
                  </div>
                  <div className="sm:text-right text-xs text-zinc-600">
                    One Way
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
