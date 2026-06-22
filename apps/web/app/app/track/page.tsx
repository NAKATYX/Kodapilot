'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { useStore } from '@/lib/store'

const statuses = ['ESCROWED', 'IN_TRANSIT', 'DELIVERED', 'RELEASED']

export default function TrackPage() {
  const { currentOrder } = useStore()
  const [order, setOrder] = useState(currentOrder)
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(!order)

  useEffect(() => {
    if (order?.id) {
      const loadOrder = async () => {
        try {
          const freshOrder = await api.getOrder(order.id)
          if (freshOrder) setOrder(freshOrder)
        } catch (err) {
          console.error('Failed to load order:', err)
        } finally {
          setLoading(false)
        }
      }
      const interval = setInterval(loadOrder, 5000)
      return () => clearInterval(interval)
    }
  }, [order?.id])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-brand-primary border-t-transparent mb-3"></div>
          <p className="text-neutral-600 text-sm">loading order...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <Card className="text-center py-8">
        <div className="text-4xl mb-2">📦</div>
        <p className="text-neutral-600">no active order</p>
        <p className="text-sm text-neutral-500 mt-1">make a purchase to track</p>
      </Card>
    )
  }

  const currentStatus = order.status || 'ESCROWED'
  const mockOrder = {
    id: order.id,
    product: 'oraimo freepods 4',
    price: order.price,
    seller: 'Chiamaka U.',
    deliveryDeadline: '2 hours',
    icon: '🎧',
  }

  const timelineSteps = [
    {
      status: 'ESCROWED',
      label: 'payment locked',
      description: 'your money is safe on 0G blockchain',
      time: '2 hours ago',
      icon: '🔒',
    },
    {
      status: 'IN_TRANSIT',
      label: 'on the way',
      description: 'seller is delivering to your location',
      time: 'right now',
      icon: '🚚',
    },
    {
      status: 'DELIVERED',
      label: 'ready for pickup',
      description: 'item has arrived at your location',
      time: 'not yet',
      icon: '📦',
    },
    {
      status: 'RELEASED',
      label: 'confirmed received',
      description: 'funds released to seller',
      time: 'pending your action',
      icon: '✅',
    },
  ]

  const handleConfirmDelivery = async () => {
    try {
      setConfirming(true)
      await api.confirmDelivery(order.id)
      // Refresh order
      const freshOrder = await api.getOrder(order.id)
      if (freshOrder) setOrder(freshOrder)
    } catch (err) {
      console.error('Confirmation failed:', err)
    } finally {
      setConfirming(false)
    }
  }

  const isCompleted = (status: string) => {
    const currentIndex = statuses.indexOf(currentStatus)
    return statuses.indexOf(status) <= currentIndex
  }

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-lg bg-brand-light flex items-center justify-center text-2xl">
            {mockOrder.icon}
          </div>
          <div className="flex-1">
            <div className="font-manrope text-xs text-neutral-500">order {mockOrder.id}</div>
            <div className="font-sora font-black text-lg text-neutral-900">{mockOrder.product}</div>
            <div className="font-manrope text-sm text-brand-primary">₦{mockOrder.price.toLocaleString()}</div>
          </div>
        </div>
        <div className="border-t border-neutral-200 pt-3 flex items-center justify-between">
          <div>
            <div className="font-manrope text-xs text-neutral-500">from</div>
            <div className="font-manrope font-semibold text-neutral-900">{mockOrder.seller}</div>
          </div>
          <div className="text-right">
            <div className="font-manrope text-xs text-neutral-500">arrives in</div>
            <div className="font-sora font-bold text-brand-primary">{mockOrder.deliveryDeadline}</div>
          </div>
        </div>
      </Card>

      {/* Timeline */}
      <div className="space-y-3">
        {timelineSteps.map((step, idx) => {
          const completed = isCompleted(step.status)
          const isActive = currentStatus === step.status

          return (
            <div key={step.status} className="relative">
              {/* Connector Line */}
              {idx < timelineSteps.length - 1 && (
                <div
                  className={`absolute left-6 top-14 h-8 w-0.5 transition ${
                    completed ? 'bg-earn' : 'bg-neutral-200'
                  }`}
                />
              )}

              {/* Step Card */}
              <Card
                className={`relative transition ${
                  isActive
                    ? 'border-brand-primary bg-brand-light'
                    : completed
                      ? 'border-earn/30 bg-earn-soft/50'
                      : 'border-neutral-200'
                }`}
              >
                <div className="flex gap-3">
                  {/* Step Icon Circle */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-lg transition ${
                      completed
                        ? 'bg-earn text-white'
                        : isActive
                          ? 'bg-brand-primary text-white scale-110'
                          : 'bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    {step.icon}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-sora font-bold text-neutral-900">{step.label}</div>
                        <p className="font-manrope text-sm text-neutral-600 mt-0.5">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    <div className="font-manrope text-xs text-neutral-500 mt-2">{step.time}</div>
                  </div>
                </div>
              </Card>
            </div>
          )
        })}
      </div>

      {/* Action Button */}
      {currentStatus === 'DELIVERED' && (
        <Button
          className="w-full"
          variant="primary"
          size="lg"
          onClick={handleConfirmDelivery}
          disabled={confirming}
        >
          {confirming ? '⏳ confirming...' : '✅ i received it'}
        </Button>
      )}

      {currentStatus === 'RELEASED' && (
        <Card className="bg-earn-soft border border-earn/50 text-center py-6">
          <div className="text-5xl mb-3">🎉</div>
          <div className="font-sora font-black text-lg text-neutral-900 mb-2">
            transaction complete
          </div>
          <p className="font-manrope text-sm text-neutral-700">
            seller received ₦{order.price.toLocaleString()}. thanks for using kodapilot!
          </p>
        </Card>
      )}

      {/* Info */}
      <Card className="bg-blue-50 border border-info/30">
        <div className="space-y-2">
          <div className="font-sora font-bold text-neutral-900">⚡ instant settlement</div>
          <p className="font-manrope text-sm text-neutral-700">
            once you confirm delivery, the seller gets paid instantly on 0G blockchain. no middleman, no delays.
          </p>
        </div>
      </Card>
    </div>
  )
}
