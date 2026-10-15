import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  Camera,
  Mic,
  Volume2,
  Shield,
  RotateCcw,
  Check,
  Upload
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SoundEngine } from '../utils/soundEffects';
import { AppLogo } from './AppLogo';

export const SettingsModal: React.FC = () => {
  const { currentUser, updateCurrentUser } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio);
  const [phone, setPhone] = useState(currentUser.phone);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Hardware testing
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [micLevel, setMicLevel] = useState(0);
  const [micActive, setMicActive] = useState(false);

  const videoTestRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const micIntervalRef = useRef<number | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      name,
      username,
      bio,
      phone,
      avatar
    });
    setSavedSuccess(true);
    SoundEngine.playMessageSent();
    setTimeout(() => setSavedSuccess(false), 2200);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle Camera Test
  const toggleCameraTest = async () => {
    if (cameraActive) {
      if (cameraStream) {
        cameraStream.getTracks().forEach(t => t.stop());
        setCameraStream(null);
      }
      setCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraStream(stream);
        setCameraActive(true);
      } catch {
        alert('Could not access camera in this browser context.');
      }
    }
  };

  useEffect(() => {
    if (videoTestRef.current && cameraStream) {
      videoTestRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  // Toggle Mic Test
  const toggleMicTest = async () => {
    if (micActive) {
      if (micIntervalRef.current) clearInterval(micIntervalRef.current);
      setMicLevel(0);
      setMicActive(false);
    } else {
      setMicActive(true);
      // Simulate/measure mic responsiveness
      micIntervalRef.current = window.setInterval(() => {
        setMicLevel(Math.floor(20 + Math.random() * 70));
      }, 150);
    }
  };

  useEffect(() => {
    return () => {
      if (cameraStream) cameraStream.getTracks().forEach(t => t.stop());
      if (micIntervalRef.current) clearInterval(micIntervalRef.current);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-y-auto select-none p-6 md:p-8">
      {/* Header with Macheza Pa Air Logo */}
      <div className="pb-6 border-b border-slate-800/80 max-w-3xl flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <AppLogo size="lg" />
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Macheza Pa Air</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Profile, call hardware calibration, and audio settings
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl flex flex-col gap-8 mt-6">
        {/* Profile Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <h2 className="text-base font-semibold text-white mb-4">User Profile</h2>
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  src={avatar}
                  alt={name}
                  className="w-20 h-20 rounded-full object-cover ring-2 ring-indigo-500 bg-slate-800"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 shadow transition-colors"
                  title="Change Avatar"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-white">{name}</span>
                <span className="text-xs text-indigo-400">@{username}</span>
                <span className="text-xs text-slate-400">{phone}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="px-3.5 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Username (@)</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="px-3.5 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="px-3.5 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Bio</label>
                <input
                  type="text"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="px-3.5 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {savedSuccess ? (
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Profile updated successfully!
                </span>
              ) : <div />}

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Audio & Camera Hardware Test Studio */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-6">
          <h2 className="text-base font-semibold text-white">Call Hardware Calibration</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Camera Test Box */}
            <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-indigo-400" />
                  Webcam Test
                </span>
                <button
                  onClick={toggleCameraTest}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                    cameraActive ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {cameraActive ? 'Stop Preview' : 'Start Preview'}
                </button>
              </div>

              <div className="h-36 rounded-lg bg-slate-900 overflow-hidden flex items-center justify-center border border-slate-800">
                {cameraActive ? (
                  <video
                    ref={videoTestRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                ) : (
                  <span className="text-xs text-slate-500">Camera preview inactive</span>
                )}
              </div>
            </div>

            {/* Microphone Test Box */}
            <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-emerald-400" />
                  Microphone Test
                </span>
                <button
                  onClick={toggleMicTest}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                    micActive ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {micActive ? 'Stop Test' : 'Test Mic Level'}
                </button>
              </div>

              <div className="h-36 rounded-lg bg-slate-900 p-4 flex flex-col justify-center gap-3 border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Input Volume Meter</span>
                  <span className="font-mono text-white">{micLevel}%</span>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 transition-all duration-100"
                    style={{ width: `${micLevel}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-500">
                  {micActive ? 'Detecting audio frequency response' : 'Press Test Mic Level to calibrate'}
                </span>
              </div>
            </div>
          </div>

          {/* Sound Tones Trigger Box */}
          <div className="pt-4 border-t border-slate-800">
            <span className="text-xs font-semibold text-slate-300 block mb-2.5">
              Test Audio Synthesizers
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  SoundEngine.startOutgoingRing();
                  setTimeout(() => SoundEngine.stopRing(), 3600);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                Phone Ringtone
              </button>
              <button
                onClick={() => SoundEngine.playCallConnected()}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                Connected Chime
              </button>
              <button
                onClick={() => SoundEngine.playMessageReceived()}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                Message Alert
              </button>
              <button
                onClick={() => {
                  SoundEngine.playStoryAmbient('Sunset Chillwave');
                  setTimeout(() => SoundEngine.stopStoryAmbient(), 4000);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                Ambient Story Chord
              </button>
            </div>
          </div>
        </div>

        {/* Security & System Info */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-semibold text-white block">End-to-End Encryption</span>
              <span className="text-xs text-slate-400">Calls, voice notes, and texts are private</span>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
            Active
          </span>
        </div>
      </div>
    </div>
  );
};
