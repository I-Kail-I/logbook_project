import Logo from "../../../../public/assets/logo.png"
import Image from "next/image"

export default function LogoSection() {
  return (
    <div className="flex flex-col items-center mb-8 animate-fade-in">
      <div className="w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center mb-6 transform hover:scale-105 transition-transform duration-300">
        <Image
          height={10}
          width={10}
          src={Logo}
          alt="Logo"
          className="w-24 h-24 object-contain"
        />
      </div>
      <h1 className="text-white text-4xl font-bold tracking-wider drop-shadow-lg font-poppins">
        LOGBOOK
      </h1>
    </div>
  )
}
