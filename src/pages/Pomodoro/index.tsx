import Header from "./components/Header";
import Footer from "./components/Footer";
import Timer from "./components/Timer";

function PomodoroPage() {
  const isImage = false;
  return (
    <>
      {isImage ? (
        <div
          className="bg-primary-light px-md md:px-xl text-secondary bg-center bg-cover z-base font-light text-sm"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(/image/fuji.webp)`,
          }}
        >
          {/* Header */}
          <Header />
          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center">
            <Timer bgIsImage={isImage}/>
          </div>
          {/* Footer */}
          <Footer />
        </div>
      ) : (
        <div className="relative flex flex-col min-h-screen w-full overflow-hidden px-md md:px-xl text-secondary font-light text-sm">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover -z-10"
          >
            <source src="/video/Vid_BG_1.mp4" type="video/mp4" />
          </video>

          {/* Header */}
          <Header />
          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center">
            <Timer bgIsImage={isImage}/>
          </div>
          {/* Footer */}
          <Footer />
        </div>
      )}
    </>
  );
}

export default PomodoroPage;
