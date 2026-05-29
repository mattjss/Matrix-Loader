import { MatrixLoader } from "@/components/matrix-loader"

export default function Page() {
  return (
    <div className="min-h-screen bg-[#101010] flex items-center justify-center">
      <div style={{ width: 460 }}>
        <MatrixLoader />
      </div>
    </div>
  )
}
