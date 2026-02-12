import Image from "next/image"
import BackgroundImg from "../../../../public/assets/background_bangunan_unm.jpg"

export default function Background() {
  return (
    <div className="absolute inset-0 z-0">
      <Image
        src={BackgroundImg}
        alt="Background"
        fill
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-br from-amber-400/90 via-orange-500/90 to-amber-600/90" />
    </div>
  )
}
