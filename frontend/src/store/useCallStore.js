import { create } from "zustand";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

const ICE_CONFIG = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
};

// Tries to get the requested media; if video fails (camera busy), falls back to audio-only
async function getMedia(callType) {
  if (callType === "audio") {
    return navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  }
  try {
    return await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
  } catch (err) {
    // Camera likely in use by another tab — fall back to audio
    toast("Camera unavailable — joining with audio only", { icon: "🎤" });
    useCallStore.setState({ callType: "audio", isCameraOff: true });
    return navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  }
}

// Module-level refs (not in store to avoid serialization issues)
let peerConnection = null;
let ringtoneCtx = null;
let ringtoneOscillator = null;
let ringtoneInterval = null;

const startRingtone = () => {
  try {
    ringtoneCtx = new AudioContext();
    let playing = false;

    ringtoneInterval = setInterval(() => {
      if (playing) return;
      playing = true;
      const osc = ringtoneCtx.createOscillator();
      const gain = ringtoneCtx.createGain();
      osc.connect(gain);
      gain.connect(ringtoneCtx.destination);
      osc.frequency.value = 440;
      gain.gain.value = 0.15;
      osc.start();
      setTimeout(() => {
        osc.stop();
        playing = false;
      }, 400);
    }, 800);
  } catch (e) {
    // AudioContext not available
  }
};

const stopRingtone = () => {
  if (ringtoneInterval) {
    clearInterval(ringtoneInterval);
    ringtoneInterval = null;
  }
  if (ringtoneCtx) {
    ringtoneCtx.close().catch(() => {});
    ringtoneCtx = null;
  }
};

export const useCallStore = create((set, get) => ({
  callStatus: "idle", // "idle" | "calling" | "ringing" | "in-call"
  callType: null, // "video" | "audio"
  peer: null, // { _id, fullName, profilePic }
  isMuted: false,
  isCameraOff: false,
  callStartTime: null,
  localStream: null,
  remoteStream: null,

  startCall: (peerUser, callType) => {
    const socket = useAuthStore.getState().socket;
    const authUser = useAuthStore.getState().authUser;
    if (!socket || !authUser || !peerUser) return;

    socket.emit("call:user", {
      to: peerUser._id,
      callerInfo: {
        _id: authUser._id,
        fullName: authUser.fullName,
        profilePic: authUser.profilePic,
      },
      callType,
    });

    set({
      callStatus: "calling",
      callType,
      peer: { _id: peerUser._id, fullName: peerUser.fullName, profilePic: peerUser.profilePic },
      isMuted: false,
      isCameraOff: false,
    });
  },

  acceptCall: async () => {
    const socket = useAuthStore.getState().socket;
    const { peer, callType } = get();
    if (!socket || !peer) return;

    stopRingtone();

    try {
      const stream = await getMedia(callType);

      set({ localStream: stream });

      socket.emit("call:accept", { to: peer._id });
      set({ callStatus: "in-call", callStartTime: Date.now() });
    } catch (err) {
      toast.error("Could not access microphone");
      socket.emit("call:reject", { to: peer._id });
      get().cleanup();
    }
  },

  rejectCall: () => {
    const socket = useAuthStore.getState().socket;
    const { peer } = get();
    if (!socket || !peer) return;

    stopRingtone();
    socket.emit("call:reject", { to: peer._id });
    get().cleanup();
  },

  endCall: () => {
    const socket = useAuthStore.getState().socket;
    const { peer } = get();
    if (!socket || !peer) return;

    socket.emit("call:end", { to: peer._id });
    get().cleanup();
  },

  toggleMute: () => {
    const { localStream, isMuted } = get();
    if (localStream) {
      localStream.getAudioTracks().forEach((t) => {
        t.enabled = isMuted; // toggle: if muted, enable; if not muted, disable
      });
      set({ isMuted: !isMuted });
    }
  },

  toggleCamera: () => {
    const { localStream, isCameraOff } = get();
    if (localStream) {
      localStream.getVideoTracks().forEach((t) => {
        t.enabled = isCameraOff;
      });
      set({ isCameraOff: !isCameraOff });
    }
  },

  cleanup: () => {
    stopRingtone();

    const { localStream } = get();
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
    }

    if (peerConnection) {
      peerConnection.close();
      peerConnection = null;
    }

    set({
      callStatus: "idle",
      callType: null,
      peer: null,
      isMuted: false,
      isCameraOff: false,
      callStartTime: null,
      localStream: null,
      remoteStream: null,
    });
  },
}));

// ================= WEBRTC HELPERS =================

async function initPeerConnection(socket, peerId, localStream, callType) {
  const pc = new RTCPeerConnection(ICE_CONFIG);
  peerConnection = pc;

  localStream.getTracks().forEach((t) => pc.addTrack(t, localStream));

  pc.ontrack = (e) => {
    useCallStore.setState({ remoteStream: e.streams[0] });
  };

  pc.onicecandidate = (e) => {
    if (e.candidate) {
      socket.emit("webrtc:ice-candidate", { to: peerId, candidate: e.candidate });
    }
  };

  pc.oniceconnectionstatechange = () => {
    if (pc.iceConnectionState === "failed" || pc.iceConnectionState === "disconnected") {
      toast.error("Connection lost");
      useCallStore.getState().endCall();
    }
  };

  return pc;
}

// ================= SOCKET LISTENERS =================

export function setupCallListeners(socket) {
  socket.on("call:incoming", ({ from, callerInfo, callType }) => {
    const { callStatus } = useCallStore.getState();
    // Ignore if already in a call
    if (callStatus !== "idle") return;

    startRingtone();
    useCallStore.setState({
      callStatus: "ringing",
      callType,
      peer: callerInfo,
    });
  });

  socket.on("call:accepted", async () => {
    const { peer, callType } = useCallStore.getState();
    if (!peer) return;

    try {
      const stream = await getMedia(callType);

      useCallStore.setState({ localStream: stream, callStatus: "in-call", callStartTime: Date.now() });

      const pc = await initPeerConnection(socket, peer._id, stream, callType);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("webrtc:offer", { to: peer._id, offer });
    } catch (err) {
      toast.error("Could not access camera/microphone");
      useCallStore.getState().endCall();
    }
  });

  socket.on("call:rejected", () => {
    toast.error("Call rejected");
    useCallStore.getState().cleanup();
  });

  socket.on("call:busy", () => {
    toast.error("User is busy");
    useCallStore.getState().cleanup();
  });

  socket.on("call:user-offline", () => {
    toast.error("User is offline");
    useCallStore.getState().cleanup();
  });

  socket.on("call:ended", () => {
    toast("Call ended");
    useCallStore.getState().cleanup();
  });

  socket.on("call:missed", () => {
    toast("No answer");
    useCallStore.getState().cleanup();
  });

  socket.on("call:timeout", () => {
    stopRingtone();
    toast("Missed call");
    useCallStore.getState().cleanup();
  });

  // WebRTC signaling
  socket.on("webrtc:offer", async ({ from, offer }) => {
    const { localStream, peer } = useCallStore.getState();
    if (!localStream || !peer) return;

    const pc = await initPeerConnection(socket, from, localStream, useCallStore.getState().callType);

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit("webrtc:answer", { to: from, answer });
  });

  socket.on("webrtc:answer", async ({ from, answer }) => {
    if (peerConnection) {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    }
  });

  socket.on("webrtc:ice-candidate", async ({ from, candidate }) => {
    if (peerConnection) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  });
}

export function teardownCallListeners(socket) {
  const events = [
    "call:incoming", "call:accepted", "call:rejected", "call:busy",
    "call:user-offline", "call:ended", "call:missed", "call:timeout",
    "webrtc:offer", "webrtc:answer", "webrtc:ice-candidate",
  ];
  events.forEach((ev) => socket.off(ev));
}
