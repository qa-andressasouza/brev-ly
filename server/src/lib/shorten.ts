import { z } from 'zod'

const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

/**
 * Gera um código curto aleatório (fallback caso o usuário não informe um alias).
 */
export function generateShortCode(length = 6): string {
  let code = ''
  for (let i = 0; i < length; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  }
  return code
}

// Validação do alias encurtado: apenas letras, números, hífen e underscore.
export const shortUrlSchema = z
  .string()
  .min(3)
  .max(50)
  .regex(/^[a-zA-Z0-9-_]+$/, {
    message: 'A URL encurtada deve conter apenas letras, números, hífen e underscore.',
  })
