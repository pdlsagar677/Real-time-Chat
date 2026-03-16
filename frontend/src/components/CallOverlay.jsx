import { useEffect, useRef, useState } from "react";
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { useCallStore } from "../store/useCallStore";

const CallTimer = ({ startTime }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime) return;
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(id);
  }, [startTime]);

  const mins = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const secs = String(elapsed % 60).padStart(2, "0");
  return <span className="text-white/80 text-lg font-mono">{mins}:{secs}</span>;
};

const CallOverlay = () => {
  const {
    callStatus, callType, peer, isMuted, isCameraOff,
    callStartTime, localStream, remoteStream,
    acceptCall, rejectCall, endCall, toggleMute, toggleCamera, cleanup,
  } = useCallStore();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Attach streams to video elements
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // End call on tab close
  useEffect(() => {
    if (callStatus === "idle") return;
    const handler = () => endCall();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [callStatus, endCall]);

  if (callStatus === "idle") return null;

  const profilePic = peer?.profilePic || "/avatar.png";
  const peerName = peer?.fullName || "Unknown";

  // ==================== RINGING (incoming) ====================
  if (callStatus === "ringing") {
    return (
      <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          {/* Pulsing avatar */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-green-500/30 animate-ping" />
            <img
              src={profilePic}
              alt={peerName}
              className="w-28 h-28 rounded-full object-cover border-4 border-white/20 relative z-10"
            />
          </div>

          <div className="text-center">
            <h2 className="text-white text-2xl font-semibold">{peerName}</h2>
            <p className="text-white/60 mt-1">
              Incoming {callType === "video" ? "Video" : "Audio"} Call
            </p>
          </div>

          <div className="flex gap-8 mt-4">
            <button
              onClick={rejectCall}
              className="bg-red-600 hover:bg-red-700 text-white p-5 rounded-full transition-colors"
            >
              <PhoneOff className="w-7 h-7" />
            </button>
            <button
              onClick={acceptCall}
              className="bg-green-600 hover:bg-green-700 text-white p-5 rounded-full transition-colors"
            >
              <Phone className="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== CALLING (outgoing, waiting) ====================
  if (callStatus === "calling") {
    return (
      <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping" />
            <img
              src={profilePic}
              alt={peerName}
              className="w-28 h-28 rounded-full object-cover border-4 border-white/20 relative z-10"
            />
          </div>

          <div className="text-center">
            <h2 className="text-white text-2xl font-semibold">{peerName}</h2>
            <p className="text-white/60 mt-1">Calling...</p>
          </div>

          <button
            onClick={endCall}
            className="bg-red-600 hover:bg-red-700 text-white p-5 rounded-full mt-4 transition-colors"
          >
            <PhoneOff className="w-7 h-7" />
          </button>
        </div>
      </div>
    );
  }

  // ==================== IN-CALL ====================
  const isVideoCall = callType === "video";

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col">
      {/* Main area */}
      <div className="flex-1 relative flex items-center justify-center">
        {isVideoCall ? (
          <>
            {/* Remote video fullscreen */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Local video corner */}
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="absolute bottom-24 right-4 w-32 rounded-xl border-2 border-white/20 shadow-lg"
            />
          </>
        ) : (
          <>
            {/* Audio call: show avatar + timer */}
            <div className="flex flex-col items-center gap-4">
              <img
                src={profilePic}
                alt={peerName}
                className="w-32 h-32 rounded-full object-cover border-4 border-white/20"
              />
              <h2 className="text-white text-2xl font-semibold">{peerName}</h2>
              <CallTimer startTime={callStartTime} />
            </div>
            {/* Hidden audio elements to ensure stream plays */}
            <video ref={remoteVideoRef} autoPlay playsInline className="hidden" />
            <video ref={localVideoRef} autoPlay muted playsInline className="hidden" />
          </>
        )}
      </div>

      {/* Control bar */}
      <div className="flex items-center justify-center gap-6 pb-8 pt-4 bg-gradient-to-t from-black/80 to-transparent">
        {/* Mute toggle */}
        <button
          onClick={toggleMute}
          className={`p-4 rounded-full transition-colors ${
            isMuted ? "bg-red-500/80 text-white" : "bg-white/20 text-white hover:bg-white/30"
          }`}
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        {/* Camera toggle (video calls only) */}
        {isVideoCall && (
          <button
            onClick={toggleCamera}
            className={`p-4 rounded-full transition-colors ${
              isCameraOff ? "bg-red-500/80 text-white" : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            {isCameraOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </button>
        )}

        {/* End call */}
        <button
          onClick={endCall}
          className="bg-red-600 hover:bg-red-700 text-white p-5 rounded-full transition-colors"
        >
          <PhoneOff className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};

export default CallOverlay;
