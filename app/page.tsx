import { MatrixLoader } from "@/components/matrix-loader"

export default function Page() {
  return (
    <div
      className="min-h-screen bg-[#101010] flex items-center justify-center"
      style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)', borderRadius: 10 }}
    >
      <div style={{ width: 460 }}>
        <MatrixLoader />
      </div>
    </div>
  )
}
