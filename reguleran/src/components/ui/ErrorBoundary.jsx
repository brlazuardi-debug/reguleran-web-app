import { Component } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Button } from './Button'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  handleReset = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 px-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <AlertTriangle size={28} className="text-red-500" />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">Terjadi Kesalahan</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md">
              {this.props.fallbackMessage || 'Terjadi kesalahan saat memuat halaman ini. Silakan coba lagi.'}
            </p>
          </div>
          <Button variant="primary" icon={RotateCcw} onClick={this.handleReset}>
            Coba Lagi
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}
