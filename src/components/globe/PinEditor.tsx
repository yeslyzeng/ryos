import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, MapPin, Image, Link, FileText } from 'lucide-react';
import { useGlobeStore } from '@/stores/useGlobeStore';
import type { GlobePin, PinContent, PinLink, PinImage } from '@/types/globe';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

interface PinEditorProps {
  isOpen: boolean;
  onClose: () => void;
  editingPin?: GlobePin | null;
}

export function PinEditor({ isOpen, onClose, editingPin }: PinEditorProps) {
  const { topics, addPin, updatePin } = useGlobeStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [topicId, setTopicId] = useState(topics[0]?.id || '');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [contentType, setContentType] = useState<PinContent['type']>('article');
  const [text, setText] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [images, setImages] = useState<PinImage[]>([]);
  const [links, setLinks] = useState<PinLink[]>([]);
  const [embedUrl, setEmbedUrl] = useState('');

  // Load editing pin data
  useEffect(() => {
    if (editingPin) {
      setTitle(editingPin.title);
      setDescription(editingPin.description || '');
      setTopicId(editingPin.topicId);
      setLat(editingPin.location.lat.toString());
      setLng(editingPin.location.lng.toString());
      setContentType(editingPin.content.type);
      setText(editingPin.content.text || '');
      setCoverImage(editingPin.content.coverImage || '');
      setImages(editingPin.content.images || []);
      setLinks(editingPin.content.links || []);
      setEmbedUrl(editingPin.content.embedUrl || '');
    } else {
      resetForm();
    }
  }, [editingPin]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setTopicId(topics[0]?.id || '');
    setLat('');
    setLng('');
    setContentType('article');
    setText('');
    setCoverImage('');
    setImages([]);
    setLinks([]);
    setEmbedUrl('');
  };

  const handleSubmit = () => {
    if (!title || !lat || !lng || !topicId) return;

    const content: PinContent = {
      type: contentType,
      text: text || undefined,
      coverImage: coverImage || undefined,
      images: images.length > 0 ? images : undefined,
      links: links.length > 0 ? links : undefined,
      embedUrl: embedUrl || undefined,
    };

    const pinData: GlobePin = {
      id: editingPin?.id || `pin-${uuidv4()}`,
      topicId,
      title,
      description: description || undefined,
      location: {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      },
      content,
      createdAt: editingPin?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingPin) {
      updatePin(editingPin.id, pinData);
    } else {
      addPin(pinData);
    }

    resetForm();
    onClose();
  };

  const addImage = () => {
    setImages([...images, { url: '', caption: '', alt: '' }]);
  };

  const updateImage = (index: number, field: keyof PinImage, value: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], [field]: value };
    setImages(newImages);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addLink = () => {
    setLinks([...links, { url: '', title: '', description: '' }]);
  };

  const updateLink = (index: number, field: keyof PinLink, value: string) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setLinks(newLinks);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />

          {/* Editor Panel */}
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-[480px] z-50 overflow-hidden"
          >
            <div className="h-full backdrop-blur-xl bg-white/90 border-l border-white/40 shadow-2xl flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingPin ? 'Edit Pin' : 'Add New Pin'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Form */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#8B9A7B] focus:ring-1 focus:ring-[#8B9A7B] outline-none transition-colors"
                      placeholder="Enter pin title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#8B9A7B] focus:ring-1 focus:ring-[#8B9A7B] outline-none transition-colors"
                      placeholder="Brief description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Topic *
                    </label>
                    <select
                      value={topicId}
                      onChange={(e) => setTopicId(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#8B9A7B] focus:ring-1 focus:ring-[#8B9A7B] outline-none transition-colors"
                    >
                      {topics.map((topic) => (
                        <option key={topic.id} value={topic.id}>
                          {topic.icon} {topic.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <MapPin className="w-4 h-4" />
                    Location *
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#8B9A7B] focus:ring-1 focus:ring-[#8B9A7B] outline-none transition-colors"
                        placeholder="-90 to 90"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#8B9A7B] focus:ring-1 focus:ring-[#8B9A7B] outline-none transition-colors"
                        placeholder="-180 to 180"
                      />
                    </div>
                  </div>
                </div>

                {/* Content Type */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Content Type
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { type: 'article', icon: FileText, label: 'Article' },
                      { type: 'gallery', icon: Image, label: 'Gallery' },
                      { type: 'link', icon: Link, label: 'Links' },
                      { type: 'interactive', icon: MapPin, label: 'Embed' },
                    ].map(({ type, icon: Icon, label }) => (
                      <button
                        key={type}
                        onClick={() => setContentType(type as PinContent['type'])}
                        className={cn(
                          "flex flex-col items-center gap-1 p-3 rounded-xl border transition-colors",
                          contentType === type
                            ? "border-[#8B9A7B] bg-[#8B9A7B]/10 text-[#8B9A7B]"
                            : "border-gray-200 text-gray-500 hover:border-gray-300"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content Fields */}
                <div className="space-y-4">
                  {/* Cover Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cover Image URL
                    </label>
                    <input
                      type="url"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#8B9A7B] focus:ring-1 focus:ring-[#8B9A7B] outline-none transition-colors"
                      placeholder="https://..."
                    />
                  </div>

                  {/* Article Text */}
                  {(contentType === 'article' || contentType === 'gallery') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Text Content
                      </label>
                      <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#8B9A7B] focus:ring-1 focus:ring-[#8B9A7B] outline-none transition-colors resize-none"
                        placeholder="Write your content here..."
                      />
                    </div>
                  )}

                  {/* Gallery Images */}
                  {contentType === 'gallery' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">
                          Gallery Images
                        </label>
                        <button
                          onClick={addImage}
                          className="flex items-center gap-1 text-sm text-[#8B9A7B] hover:text-[#7A8A6A] transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add Image
                        </button>
                      </div>
                      {images.map((img, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-gray-50 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Image {idx + 1}</span>
                            <button
                              onClick={() => removeImage(idx)}
                              className="text-red-400 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <input
                            type="url"
                            value={img.url}
                            onChange={(e) => updateImage(idx, 'url', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm"
                            placeholder="Image URL"
                          />
                          <input
                            type="text"
                            value={img.caption || ''}
                            onChange={(e) => updateImage(idx, 'caption', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm"
                            placeholder="Caption (optional)"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Links */}
                  {contentType === 'link' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">
                          Links
                        </label>
                        <button
                          onClick={addLink}
                          className="flex items-center gap-1 text-sm text-[#8B9A7B] hover:text-[#7A8A6A] transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add Link
                        </button>
                      </div>
                      {links.map((link, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-gray-50 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Link {idx + 1}</span>
                            <button
                              onClick={() => removeLink(idx)}
                              className="text-red-400 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <input
                            type="url"
                            value={link.url}
                            onChange={(e) => updateLink(idx, 'url', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm"
                            placeholder="URL"
                          />
                          <input
                            type="text"
                            value={link.title}
                            onChange={(e) => updateLink(idx, 'title', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm"
                            placeholder="Title"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Embed URL */}
                  {contentType === 'interactive' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Embed URL
                      </label>
                      <input
                        type="url"
                        value={embedUrl}
                        onChange={(e) => setEmbedUrl(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#8B9A7B] focus:ring-1 focus:ring-[#8B9A7B] outline-none transition-colors"
                        placeholder="https://..."
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-100 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!title || !lat || !lng || !topicId}
                  className={cn(
                    "flex-1 px-4 py-2 rounded-xl text-white transition-colors",
                    title && lat && lng && topicId
                      ? "bg-[#8B9A7B] hover:bg-[#7A8A6A]"
                      : "bg-gray-300 cursor-not-allowed"
                  )}
                >
                  {editingPin ? 'Save Changes' : 'Add Pin'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
