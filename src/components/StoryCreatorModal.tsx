import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Sparkles, Music, Upload, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SoundEngine } from '../utils/soundEffects';

const PHOTO_PRESETS = [
  {
    id: 'sunset',
    name: 'Sunset Coast',
    url: '/src/assets/images/story_sunset_beach_1792083983866.jpg'
  },
  {
    id: 'coffee',
    name: 'Workspace Café',
    url: '/src/assets/images/story_coffee_workspace_1792083979912.jpg'
  },
  {
    id: 'artisan',
    name: 'Studio Craft',
    url: '/src/assets/images/hero_artisan_craftsman_1792082227715.jpg'
  }
];

const GRADIENT_PRESETS = [
  { id: 'indigo-purple', name: 'Cosmic Violet', value: 'from-violet-900 via-indigo-900 to-slate-950' },
  { id: 'sunset-amber', name: 'Sunset Amber', value: 'from-amber-600 via-rose-600 to-purple-900' },
  { id: 'emerald-dark', name: 'Emerald Deep', value: 'from-emerald-900 via-teal-900 to-slate-950' },
  { id: 'ocean-blue', name: 'Midnight Ocean', value: 'from-cyan-900 via-blue-900 to-slate-950' }
];

const MOOD_TAGS = [
  '📍 Golden Hour',
  '☕ Morning Sprint',
  '🎧 On Repeat',
  '🚀 Shipping Features',
  '✨ Dream Big',
  '🌴 Weekend Escape'
];

const MUSIC_TRACKS = [
  'Sunset Chillwave · 120 bpm',
  'Lofi Focus Beats',
  'Midnight Synth · Aura',
  'Deep Ambient Waves'
];

export const StoryCreatorModal: React.FC = () => {
  const { isStoryCreatorOpen, setIsStoryCreatorOpen, createStory } = useApp();

  const [mode, setMode] = useState<'image' | 'gradient'>('image');
  const [selectedPhoto, setSelectedPhoto] = useState<string>(PHOTO_PRESETS[0].url);
  const [selectedGradient, setSelectedGradient] = useState<string>(GRADIENT_PRESETS[0].value);
  const [caption, setCaption] = useState<string>('Sharing a great moment with everyone ✨');
  const [tag, setTag] = useState<string>(MOOD_TAGS[0]);
  const [musicTrack, setMusicTrack] = useState<string>(MUSIC_TRACKS[0]);
  const [fontStyle, setFontStyle] = useState<'sans' | 'serif' | 'mono' | 'neon'>('sans');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isStoryCreatorOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedPhoto(reader.result as string);
        setMode('image');
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = () => {
    SoundEngine.playMessageSent();
    createStory({
      mediaType: mode,
      mediaUrl: mode === 'image' ? selectedPhoto : '',
      gradient: mode === 'gradient' ? selectedGradient : undefined,
      caption: caption.trim() || undefined,
      tag: tag || undefined,
      musicTrack: musicTrack || undefined,
      fontStyle
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto select-none">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={() => setIsStoryCreatorOpen(false)}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Live Phone Preview Canvas */}
        <div className="md:w-1/2 p-6 flex flex-col items-center justify-center bg-slate-950/60 border-b md:border-b-0 md:border-r border-slate-800/80">
          <span className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
            Live Story Preview
          </span>

          <div className="relative w-[280px] h-[480px] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 flex flex-col justify-between">
            {/* Background Media */}
            <div className="absolute inset-0">
              {mode === 'image' ? (
                <img
                  src={selectedPhoto}
                  alt="Story preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${selectedGradient}`} />
              )}
              {/* Scrims */}
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/85 to-transparent pointer-events-none" />
            </div>

            {/* Top Bar Preview */}
            <div className="relative z-10 p-3 pt-3 flex flex-col gap-2">
              <div className="h-1 w-full bg-white/40 rounded-full overflow-hidden">
                <div className="h-full bg-white w-2/5" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white text-xs font-semibold drop-shadow">You · Just now</span>
                {musicTrack && (
                  <span className="text-[10px] text-white/90 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Music className="w-2.5 h-2.5 text-indigo-400" />
                    {musicTrack.split('·')[0]}
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Caption & Tag Preview */}
            <div className="relative z-10 p-4 pb-5 flex flex-col gap-1.5">
              {tag && (
                <span className="self-start text-[11px] font-semibold text-indigo-300 drop-shadow">
                  {tag}
                </span>
              )}
              <p
                className={`text-white text-sm font-semibold leading-snug drop-shadow ${
                  fontStyle === 'mono' ? 'font-mono' : fontStyle === 'serif' ? 'font-serif' : fontStyle === 'neon' ? 'drop-shadow-[0_0_8px_rgba(168,85,247,0.9)] text-indigo-100' : 'font-sans'
                }`}
              >
                {caption}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Story Controls & Customization */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto gap-6">
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Create a Story</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Share photos, thoughts, and soundtracks with your contacts for 24 hours.
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center gap-2 p-1 bg-slate-800/80 rounded-xl">
              <button
                onClick={() => setMode('image')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  mode === 'image' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                Photo Story
              </button>
              <button
                onClick={() => setMode('gradient')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  mode === 'gradient' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Color Backdrop
              </button>
            </div>

            {/* Photo Selection / Upload */}
            {mode === 'image' ? (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Choose Photo or Upload</span>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload File
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {PHOTO_PRESETS.map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedPhoto(preset.url)}
                      className={`relative h-20 rounded-xl overflow-hidden border-2 transition-transform active:scale-95 ${
                        selectedPhoto === preset.url ? 'border-indigo-500 scale-[1.02]' : 'border-slate-800 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      <span className="absolute inset-x-0 bottom-0 bg-black/60 text-[10px] text-white py-0.5 text-center truncate">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-semibold text-slate-300">Select Color Gradient</span>
                <div className="grid grid-cols-4 gap-2">
                  {GRADIENT_PRESETS.map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedGradient(preset.value)}
                      className={`relative h-14 rounded-xl bg-gradient-to-br ${preset.value} border-2 transition-transform active:scale-95 flex items-center justify-center ${
                        selectedGradient === preset.value ? 'border-white scale-105 shadow-lg' : 'border-slate-800'
                      }`}
                    >
                      {selectedGradient === preset.value && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Caption Text Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Story Caption</label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={2}
                maxLength={140}
                placeholder="What's on your mind?"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              />
              <span className="text-[10px] text-slate-500 self-end">
                {caption.length}/140
              </span>
            </div>

            {/* Font Style */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300 mr-1">Style:</span>
              {(['sans', 'serif', 'mono', 'neon'] as const).map(style => (
                <button
                  key={style}
                  onClick={() => setFontStyle(style)}
                  className={`px-2.5 py-1 text-xs rounded-lg capitalize border transition-all ${
                    fontStyle === style
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 font-medium'
                      : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>

            {/* Mood Tags */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-slate-300">Mood Tag</span>
              <div className="flex flex-wrap gap-1.5">
                {MOOD_TAGS.map(t => (
                  <button
                    key={t}
                    onClick={() => setTag(t)}
                    className={`px-2.5 py-1 text-xs rounded-lg transition-all ${
                      tag === t
                        ? 'bg-indigo-600 text-white font-medium shadow'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Music Track */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-slate-300">Background Soundtrack</span>
              <select
                value={musicTrack}
                onChange={(e) => setMusicTrack(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              >
                {MUSIC_TRACKS.map(track => (
                  <option key={track} value={track}>
                    🎵 {track}
                  </option>
                ))}
                <option value="">No soundtrack</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={() => setIsStoryCreatorOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePublish}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
            >
              Share to Story (24h)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
