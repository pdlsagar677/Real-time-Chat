import { useEffect, useRef, useState } from "react";
import { PhoneOff } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ICE = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

const VideoCall = () => {
  const socket = useAuthStore((s) => s.socket);
  const authUser = useAuthStore((s) => s.authUser);
  const selectedUser = useChatStore((s) => s.selectedUser);

  const pcRef = useRef(null);
  const localRef = useRef(null);
  const remoteRef = useRef(null);

  const [incomingFrom, setIncomingFrom] = useState(null);
  const [inCall, setInCall] = useState(false);
  const [localStream, setLocalStream] = useState(null);

  // ================= CLEANUP =================
  const cleanup = () => {
    pcRef.current?.close();
    pcRef.current = null;

    localStream?.getTracks().forEach((t) => t.stop());
    setLocalStream(null);

    setIncomingFrom(null);
    setInCall(false);
  };

  // ================= MEDIA =================
  const initMedia = async () => {
    if (localStream) return localStream;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localRef.current.srcObject = stream;
    setLocalStream(stream);
    return stream;
  };

  // ================= PEER =================
  const createPC = (stream, peerId) => {
    const pc = new RTCPeerConnection(ICE);

    stream.getTracks().forEach((t) => pc.addTrack(t, stream));

    pc.ontrack = (e) => {
      remoteRef.current.srcObject = e.streams[0];
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("webrtc:ice-candidate", {
          to: peerId,
          candidate: e.candidate,
        });
      }
    };

    pcRef.current = pc;
    return pc;
  };

  // ================= CALL CONTROL =================
  const acceptCall = async () => {
    setInCall(true);
    const stream = await initMedia();
    createPC(stream, incomingFrom);
    socket.emit("call:accept", { to: incomingFrom });
  };

  const rejectCall = () => {
    socket.emit("call:reject", { to: incomingFrom });
    cleanup();
  };

  const endCall = () => {
    const peerId = incomingFrom || selectedUser?._id;
    if (peerId) socket.emit("call:end", { to: peerId });
    cleanup();
  };

  // ================= SOCKET EVENTS =================
  useEffect(() => {
    if (!socket) return;

    socket.on("call:incoming", ({ from }) => {
      setIncomingFrom(from);
    });

    socket.on("call:accepted", async () => {
      setInCall(true);
      const stream = await initMedia();
      const pc = createPC(stream, selectedUser._id);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("webrtc:offer", {
        to: selectedUser._id,
        offer,
      });
    });

    socket.on("call:rejected", () => {
      toast.error("Call rejected");
      cleanup();
    });

    socket.on("call:busy", () => {
      toast.error("User is busy");
      cleanup();
    });

    socket.on("call:ended", () => {
      toast("Call ended");
      cleanup();
    });

    socket.on("webrtc:offer", async ({ offer }) => {
      const stream = await initMedia();
      const pc = createPC(stream, incomingFrom);

      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("webrtc:answer", {
        to: incomingFrom,
        answer,
      });
    });

    socket.on("webrtc:answer", ({ answer }) => {
      pcRef.current?.setRemoteDescription(answer);
    });

    socket.on("webrtc:ice-candidate", ({ candidate }) => {
      pcRef.current?.addIceCandidate(candidate);
    });

    return () => socket.off();
  }, [socket, incomingFrom, selectedUser, localStream]);

  if (!incomingFrom && !inCall) return null;

  return (
    <div className="fixed inset-0 bg-black z-50">
      {incomingFrom && !inCall && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white p-6 rounded">
            <p className="mb-4">Incoming Video Call</p>
            <div className="flex gap-4">
              <button onClick={acceptCall}>Accept</button>
              <button onClick={rejectCall}>Reject</button>
            </div>
          </div>
        </div>
      )}

      {inCall && (
        <>
          <video
            ref={remoteRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <video
            ref={localRef}
            autoPlay
            muted
            playsInline
            className="absolute bottom-4 right-4 w-40 rounded"
          />
          <button
            onClick={endCall}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-red-600 p-4 rounded-full"
          >
            <PhoneOff />
          </button>
        </>
      )}
    </div>
  );
};

export default VideoCall;
