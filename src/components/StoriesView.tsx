import React from 'react';
import { Plus, Camera, Heart, Music2, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StoriesView: React.FC = () => {
  const {
    stories,
    currentUser,
    openStoryViewer,
    setIsStoryCreatorOpen
  } = useApp();

  const myStory = stories.find(s => s.userId === 'me');
  const friendStories = stories.filter(s => s.userId !== 'me');

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-y-auto select-none p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Stories & Moments</h1>
          <p className="text-xs text-slate-400 mt-1">
            Visual updates and soundtracks that disappear after 24 hours
          </p>
        </div>

        <button
          onClick={() => setIsStoryCreatorOpen(true)}
          className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/25 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create New Story
        </button>
      </div>

      {/* Grid of Stories */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
          Recent Stories
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Your Story Card */}
          <div
            onClick={() => {
              if (myStory && myStory.items.length > 0) {
                openStoryViewer('story-me');
              } else {
                setIsStoryCreatorOpen(true);
              }
            }}
            className="group relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer shadow-lg border-2 border-dashed border-slate-700 hover:border-indigo-500 transition-all bg-slate-900 flex flex-col justify-between p-3.5"
          >
            {myStory && myStory.items[0]?.mediaUrl ? (
              <img
                src={myStory.items[0].mediaUrl}
                alt="My story"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            ) : myStory && myStory.items[0]?.gradient ? (
              <div className={`absolute inset-0 bg-gradient-to-br ${myStory.items[0].gradient}`} />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col items-center justify-center p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-white">Post to Story</span>
                <span className="text-[10px] text-slate-400 mt-1">Share photos, tags & music</span>
              </div>
            )}

            {/* Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/50 pointer-events-none" />

            {/* Top Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="w-8 h-8 rounded-full p-0.5 bg-indigo-500">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-[10px] font-semibold bg-black/50 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
                {myStory ? 'Active' : '+ Add'}
              </span>
            </div>

            {/* Bottom Info */}
            <div className="relative z-10">
              <span className="text-xs font-bold text-white block truncate">Your Story</span>
              <span className="text-[10px] text-slate-300">
                {myStory ? myStory.updatedAt : 'Tap to create'}
              </span>
            </div>
          </div>

          {/* Friend Story Cards */}
          {friendStories.map(story => {
            const firstItem = story.items[0];
            return (
              <div
                key={story.id}
                onClick={() => openStoryViewer(story.id)}
                className="group relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer shadow-xl border border-slate-800 hover:border-slate-600 transition-all bg-slate-900 flex flex-col justify-between p-3.5"
              >
                {/* Media Image or Gradient */}
                {firstItem?.mediaType === 'image' && firstItem.mediaUrl ? (
                  <img
                    src={firstItem.mediaUrl}
                    alt={story.userName}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${firstItem?.gradient || 'from-indigo-900 to-slate-950'} flex items-center justify-center p-3 text-center`}>
                    <p className="text-xs font-bold text-white/90 line-clamp-3">
                      {firstItem?.caption}
                    </p>
                  </div>
                )}

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/60 pointer-events-none" />

                {/* Top Author Details */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-full p-[2px] ${
                    story.hasUnseen
                      ? 'bg-gradient-to-tr from-amber-400 via-rose-500 to-violet-600 shadow-md shadow-rose-500/20'
                      : 'bg-slate-700'
                  }`}>
                    <img
                      src={story.userAvatar}
                      alt={story.userName}
                      className="w-full h-full rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {firstItem?.musicTrack && (
                    <div className="w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm text-indigo-300 flex items-center justify-center">
                      <Music2 className="w-3 h-3 animate-pulse" />
                    </div>
                  )}
                </div>

                {/* Bottom Details */}
                <div className="relative z-10 flex flex-col gap-1">
                  {firstItem?.tag && (
                    <span className="text-[10px] font-semibold text-indigo-300 truncate">
                      {firstItem.tag}
                    </span>
                  )}
                  <span className="text-xs font-bold text-white truncate drop-shadow">
                    {story.userName}
                  </span>
                  <div className="flex items-center justify-between text-[10px] text-slate-300">
                    <span>{story.updatedAt}</span>
                    <span className="flex items-center gap-1 font-semibold text-rose-300">
                      <Heart className="w-2.5 h-2.5 fill-rose-400 text-rose-400" />
                      {firstItem?.likesCount || 0}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
