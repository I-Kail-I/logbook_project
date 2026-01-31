import BackgroundImg from "../../assets/background_bangunan_unm.jpg";

export default function Background() {
  return (
    <div className="absolute inset-0 z-0">
      <img
        src={BackgroundImg}
        alt="Background"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-amber-400/90 via-orange-500/90 to-amber-600/90" />
    </div>
  );
}