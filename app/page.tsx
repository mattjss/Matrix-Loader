import { MatrixLoader } from "@/components/matrix-loader"

export default function Page() {
  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#101010',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div
        className="project-frame"
        style={{
          overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 16,
        }}
      >
        <MatrixLoader />
      </div>
    </div>
  )
}
