import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SidebarNav } from './components/SidebarNav';
import { ChatList } from './components/ChatList';
import { ChatConversation } from './components/ChatConversation';
import { StoriesView } from './components/StoriesView';
import { CallsHistoryView } from './components/CallsHistoryView';
import { ContactsView } from './components/ContactsView';
import { ChikondiHubView } from './components/ChikondiHubView';
import { SettingsModal } from './components/SettingsModal';
import { StoryViewerModal } from './components/StoryViewerModal';
import { StoryCreatorModal } from './components/StoryCreatorModal';
import { VoiceCallModal } from './components/VoiceCallModal';
import { VideoCallModal } from './components/VideoCallModal';
import { FloatingCallPiP } from './components/FloatingCallPiP';
import { IncomingCallBanner } from './components/IncomingCallBanner';
import { ArrowLeft } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, activeContactId } = useApp();
  const [mobileShowChatDetail, setMobileShowChatDetail] = useState(false);

  // Automatically switch to chat detail on mobile when a contact is selected
  React.useEffect(() => {
    if (activeContactId) {
      setMobileShowChatDetail(true);
    }
  }, [activeContactId]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Navigation Bar: Sidebar on desktop, Bottom Bar on mobile */}
      <SidebarNav />

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative pb-16 md:pb-0">
        {activeTab === 'chats' && (
          <div className="flex-1 flex h-full w-full overflow-hidden">
            {/* On mobile: toggle between list and conversation */}
            <div
              className={`h-full w-full md:w-80 lg:w-96 md:flex shrink-0 ${
                mobileShowChatDetail ? 'hidden md:flex' : 'flex'
              }`}
              onClick={() => setMobileShowChatDetail(true)}
            >
              <ChatList />
            </div>

            <div
              className={`flex-1 h-full flex flex-col ${
                !mobileShowChatDetail ? 'hidden md:flex' : 'flex'
              }`}
            >
              {/* Mobile back to chat list button */}
              <div className="md:hidden flex items-center px-4 py-2 bg-slate-900 border-b border-slate-800 text-slate-400">
                <button
                  onClick={() => setMobileShowChatDetail(false)}
                  className="flex items-center gap-1.5 text-xs font-medium hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Messages
                </button>
              </div>
              <ChatConversation />
            </div>
          </div>
        )}

        {activeTab === 'chikondi' && <ChikondiHubView />}
        {activeTab === 'stories' && <StoriesView />}
        {activeTab === 'calls' && <CallsHistoryView />}
        {activeTab === 'contacts' && <ContactsView />}
        {activeTab === 'settings' && <SettingsModal />}
      </main>

      {/* Global Interactive Overlays */}
      <StoryViewerModal />
      <StoryCreatorModal />
      <VoiceCallModal />
      <VideoCallModal />
      <FloatingCallPiP />
      <IncomingCallBanner />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
