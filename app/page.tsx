import { MatrixLoader } from "@/components/matrix-loader"

export default function Page() {
  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#101010',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: 422, height: 422,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 16,
        paddingRight: 16,
        boxSizing: 'border-box' as const,
      }}>
        <MatrixLoader />
      </div>
    </div>
  )
}
