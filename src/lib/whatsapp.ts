// Innovatechs WhatsApp line; override per deployment with VITE_WHATSAPP_NUMBER.
const DEFAULT_NUMBER = '212699312362'

export const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || DEFAULT_NUMBER).replace(/\D/g, '')

export function whatsappLink(text: string, number = WHATSAPP_NUMBER) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}
