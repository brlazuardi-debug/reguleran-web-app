declare module 'lucide-react-native' {
  import { ComponentType, SVGProps } from 'react'
  import { ColorValue } from 'react-native'

  interface LucideProps extends SVGProps<SVGSVGElement> {
    color?: ColorValue
    size?: number | string
  }

  export type Icon = ComponentType<LucideProps>

  export const LayoutDashboard: Icon
  export const Music: Icon
  export const List: Icon
  export const Calendar: Icon
  export const Settings: Icon
  export const Plus: Icon
  export const Search: Icon
  export const ChevronRight: Icon
  export const ChevronDown: Icon
  export const ChevronUp: Icon
  export const Trash2: Icon
  export const Edit3: Icon
  export const ArrowRight: Icon
  export const Play: Icon
  export const Pause: Icon
  export const SkipBack: Icon
  export const SkipForward: Icon
  export const Upload: Icon
  export const LogOut: Icon
  export const User: Icon
  export const Inbox: Icon
  export const GripVertical: Icon
  export const Activity: Icon
  export const Menu: Icon
  export const File: Icon
  export const FileText: Icon
  export const SlidersHorizontal: Icon
  export const Users: Icon
  export const Mic: Icon
  export const DollarSign: Icon
  export const Save: Icon
  export const Download: Icon
  export const Camera: Icon
  export const Share: Icon
  export const X: Icon
}
