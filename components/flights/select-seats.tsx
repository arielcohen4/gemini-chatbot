/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client'

import { useAIState, useActions, useUIState } from 'ai/rsc'
import { useState } from 'react'
import { SparklesIcon } from '../ui/icons'
import { SeatMap } from '@duffel/api/types'

interface SelectSeatsProps {
  summary: {
    departingCity: string
    arrivalCity: string
    flightCode: string
    date: string
  }
  seatMap: SeatMap
}

export const suggestions = [
  'Proceed to checkout',
  'List hotels and make a reservation'
]

export const SelectSeats = ({
  summary = {
    departingCity: 'New York City',
    arrivalCity: 'San Francisco',
    flightCode: 'CA123',
    date: '23 March 2024'
  },
  seatMap
}: SelectSeatsProps) => {
  const availableSeats = ['3B', '2D']
  const [aiState, setAIState] = useAIState()
  const [selectedSeat, setSelectedSeat] = useState('')
  const { departingCity, arrivalCity, flightCode, date } = summary
  const [_, setMessages] = useUIState()
  const { submitUserMessage } = useActions()

  const cabin = seatMap.cabins[0]
  const rows = cabin.rows

  return (
    <div className="grid gap-4">
      {/* ... */}
      <div className="relative flex w-ful p-4 sm:p-6 justify-center rounded-xl sm:rounded-lg bg-zinc-50">
        <div className="flex flex-col gap-4 p-4 border border-zinc-200 rounded-lg bg-zinc-50">
          {rows.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex flex-row gap-3">
              {row.sections.map((section, sectionIndex) => (
                <div
                  key={`section-${sectionIndex}`}
                  className="flex flex-row gap-3"
                >
                  {section.elements.map((element, elementIndex) => (
                    <div
                      key={`element-${elementIndex}`}
                      className={`align-center relative flex size-6 flex-row items-center justify-center rounded ${
                        element.type === 'seat'
                          ? selectedSeat === element.designator
                            ? 'cursor-pointer border-x border-b border-emerald-500 bg-emerald-300'
                            : element.available_services.length > 0
                              ? 'cursor-pointer border-x border-b border-sky-500 bg-sky-200'
                              : 'cursor-not-allowed border-x border-b border-zinc-300 bg-zinc-200'
                          : 'transparent'
                      }`}
                      onClick={() => {
                        if (
                          element.type === 'seat' &&
                          element.available_services.length > 0
                        ) {
                          setSelectedSeat(element.designator)
                          setAIState({
                            ...aiState,
                            interactions: [
                              `great, I have selected seat ${element.designator}`
                            ]
                          })
                        }
                      }}
                    >
                      {element.type === 'seat' && (
                        <div
                          className={`absolute top-0 h-2 w-7 rounded border ${
                            selectedSeat === element.designator
                              ? 'border-emerald-500 bg-emerald-300'
                              : element.available_services.length > 0
                                ? 'border-sky-500 bg-sky-300'
                                : 'border-zinc-300 bg-zinc-200'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ))}
              <div className="w-6 text-sm text-center shrink-0 text-zinc-500">
                {rowIndex + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* ... */}
    </div>
  )
}
