import { View, Text, TextInput as RNTextInput } from 'react-native'

interface InputProps {
  label?: string
  value: string
  onChangeText: (v: string) => void
  placeholder?: string
  secureTextEntry?: boolean
  keyboardType?: 'default' | 'email-address' | 'number-pad'
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  error?: string
  multiline?: boolean
}

export default function Input({
  label, value, onChangeText, placeholder, secureTextEntry,
  keyboardType, autoCapitalize, error, multiline,
}: InputProps) {
  return (
    <View className="mb-4">
      {label && <Text className="text-neutral-400 text-sm mb-1">{label}</Text>}
      <RNTextInput
        className={`bg-neutral-900 border ${error ? 'border-red-500' : 'border-neutral-700'} rounded-xl px-4 py-3 text-white ${multiline ? 'h-32' : ''}`}
        placeholder={placeholder}
        placeholderTextColor="#525252"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  )
}
