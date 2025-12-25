import { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Home, 
  Search,
  X,
  Plus,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  title: string;
  url: string;
}

export function BrowserApp() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: 'New Tab', url: '' }
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [inputUrl, setInputUrl] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const activeTab = tabs.find(t => t.id === activeTabId);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl) return;

    let url = inputUrl;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // Check if it looks like a URL
      if (url.includes('.') && !url.includes(' ')) {
        url = 'https://' + url;
      } else {
        // Treat as search
        url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
      }
    }

    setTabs(tabs.map(t => 
      t.id === activeTabId 
        ? { ...t, url, title: url.replace(/^https?:\/\//, '').split('/')[0] }
        : t
    ));
  };

  const addTab = () => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: 'New Tab',
      url: ''
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
    setInputUrl('');
  };

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) return;
    
    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);
    
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  const goHome = () => {
    setTabs(tabs.map(t => 
      t.id === activeTabId 
        ? { ...t, url: '', title: 'New Tab' }
        : t
    ));
    setInputUrl('');
  };

  const refresh = () => {
    if (iframeRef.current && activeTab?.url) {
      iframeRef.current.src = activeTab.url;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#f5f7f0]">
      {/* Tab Bar */}
      <div className="flex items-center gap-1 px-2 pt-2 bg-white/60 backdrop-blur-sm border-b border-gray-200/50">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => {
              setActiveTabId(tab.id);
              setInputUrl(tab.url);
            }}
            className={cn(
              "group flex items-center gap-2 px-3 py-2 rounded-t-lg cursor-pointer transition-colors max-w-[200px]",
              tab.id === activeTabId 
                ? "bg-white border-t border-l border-r border-gray-200/50" 
                : "hover:bg-white/50"
            )}
          >
            <Globe className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-700 truncate flex-1">
              {tab.title}
            </span>
            {tabs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-gray-200 transition-all"
              >
                <X className="w-3 h-3 text-gray-500" />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addTab}
          className="p-2 rounded-lg hover:bg-white/50 transition-colors"
        >
          <Plus className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-white border-b border-gray-200/50">
        {/* Navigation buttons */}
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
            <ArrowRight className="w-4 h-4" />
          </button>
          <button 
            onClick={refresh}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button 
            onClick={goHome}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* URL Bar */}
        <form onSubmit={handleNavigate} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Search or enter URL"
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 border border-transparent focus:border-[#8B9A7B] focus:bg-white outline-none transition-all text-sm"
            />
          </div>
        </form>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white">
        {activeTab?.url ? (
          <iframe
            ref={iframeRef}
            src={activeTab.url}
            className="w-full h-full border-0"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            title="Browser content"
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Globe className="w-16 h-16 mb-4 text-[#8B9A7B]/30" />
            <p className="text-lg font-medium text-gray-500">New Tab</p>
            <p className="text-sm mt-1">Enter a URL or search term above</p>
            
            {/* Quick links */}
            <div className="flex gap-4 mt-8">
              {[
                { name: 'Google', url: 'https://google.com', icon: '🔍' },
                { name: 'Wikipedia', url: 'https://wikipedia.org', icon: '📚' },
                { name: 'GitHub', url: 'https://github.com', icon: '💻' },
              ].map((site) => (
                <button
                  key={site.name}
                  onClick={() => {
                    setInputUrl(site.url);
                    setTabs(tabs.map(t => 
                      t.id === activeTabId 
                        ? { ...t, url: site.url, title: site.name }
                        : t
                    ));
                  }}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-gray-50 transition-colors"
                >
                  <span className="text-2xl">{site.icon}</span>
                  <span className="text-sm text-gray-600">{site.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BrowserApp;
