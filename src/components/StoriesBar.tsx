import React from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StoriesBar: React.FC = () => {
  const {
    stories,
    currentUser,
    openStoryViewer,
    setIsStoryCreatorOpen
  } = useApp();

  const myStory = stories.find(s => s.userId === 'me');
  const friendStories = stories.filter(s => s.userId !== 'me');

  return (
    <div className="w-full overflow-x-auto py-3 px-4 border-b border-slate-800/60 bg-slate-900/40 select-none">
      <div className="flex items-center gap-3.5 min-w-max">
        {/* User's Own Story Button */}
        <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
          <div className="relative">
            <button
              onClick={() => {
                if (myStory && myStory.items.length > 0) {
                  openStoryViewer('story-me');
                } else {
                  setIsStoryCreatorOpen(true);
                }
              }}
              className={`relative w-15 h-15 rounded-full p-0.5 transition-transform group-hover:scale-105 active:scale-95 ${
                myStory && myStory.items.length > 0
                  ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 p-[2.5px]'
                  : 'border-2 border-dashed border-slate-600'
              }`}
            >
              <img
                src={currentUser.avatar}
                alt="My story"
                className="w-full h-full rounded-full object-cover bg-slate-800"
                referrerPolicy="no-referrer"
              />
            </button>

            {/* Quick Add Story Action Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsStoryCreatorOpen(true);
              }}
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-md hover:bg-indigo-400 active:scale-90 transition-transform"
              title="Post new story"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
          <span className="text-[11px] font-medium text-slate-300 max-w-[64px] truncate text-center">
            Your Story
          </span>
        </div>

        {/* Separator Line */}
        <div className="w-[1px] h-10 bg-slate-800 self-center mx-1" />

        {/* Friend Stories List */}
        {friendStories.map((story) => (
          <button
            key={story.id}
            onClick={() => openStoryViewer(story.id)}
            className="flex flex-col items-center gap-1.5 group cursor-pointer"
          >
            <div
              className={`w-15 h-15 rounded-full p-[2.5px] transition-transform group-hover:scale-105 active:scale-95 ${
                story.hasUnseen
                  ? 'bg-gradient-to-tr from-amber-400 via-rose-500 to-violet-600 shadow-md shadow-rose-500/10'
                  : 'bg-slate-700'
              }`}
            >
              <div className="w-full h-full rounded-full p-[2px] bg-slate-900">
                <img
                  src={story.userAvatar}
                  alt={story.userName}
                  className="w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <span className="text-[11px] font-medium text-slate-300 max-w-[68px] truncate text-center group-hover:text-white transition-colors">
              {story.userName.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
