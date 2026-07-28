import { TouchableOpacity, Text, ActivityIndicator } from 'react-native'

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  loading?: boolean
  disabled?: boolean
}

export default function Button({ title, onPress, variant = 'primary', loading, disabled }: ButtonProps) {
  const isDisabled = loading || disabled

  const variantStyles: Record<string, string> = {
    primary: 'bg-white',
    secondary: 'border border-neutral-700',
    ghost: '',
    danger: 'bg-red-600',
  }

  const textStyles: Record<string, string> = {
    primary: 'text-black',
    secondary: 'text-white',
    ghost: 'text-white',
    danger: 'text-white',
  }

  return (
    <TouchableOpacity
      className={`rounded-xl py-4 items-center ${variantStyles[variant]} ${isDisabled ? 'opacity-50' : ''}`}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#000' : '#fff'} />
      ) : (
        <Text className={`font-semibold text-base ${textStyles[variant]}`}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}
