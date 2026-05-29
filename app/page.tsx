import { MatrixLoader } from "@/components/matrix-loader"
import { LoaderSpinner } from "@/components/loader-spinner"

export default function Page() {
  return (
    <div className="min-h-screen bg-[#101010] flex items-center justify-center">
      <div className="w-[700px] h-[700px] bg-[#101010] flex items-center justify-start pl-[56px]">
        <div className="flex items-center gap-[16px]">
          <LoaderSpinner />
          <MatrixLoader />
        </div>
      </div>
    </div>
  )
}
