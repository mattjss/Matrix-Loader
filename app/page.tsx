import { MatrixLoader } from "@/components/matrix-loader"

export default function Page() {
  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#101010',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: 'var(--frame-sz)' as string,
        height: 'var(--frame-sz)' as string,
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 10,
        overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <MatrixLoader />
      </div>
    </div>
  )
}
