import React, { useRef, useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import { Rnd } from 'react-rnd';
import 'react-quill-new/dist/quill.snow.css';
import { Trash2, Palette, ImageIcon, Plus, Type, Image as ImageIcon2 } from 'lucide-react';

const Slide = ({ slide, isPresenter, onUpdate, triggerAddSlide, handleNext, handlePrev }) => {
  const fileInputRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const GRID_SIZE = [20, 20];

  // Visibility defaults
  const showText = slide.showText !== false;
  const showImage = slide.showImage !== false;

  useEffect(() => {
    if (!isPresenter) return;
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.classList.contains('ql-editor')) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresenter, handleNext, handlePrev]);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => onUpdate({ ...slide, image: event.target.result, showImage: true });
      reader.readAsDataURL(file);
    }
  };

  if (!slide) return <div className="p-10 text-center font-bold">Syncing...</div>;

  return (
    <div 
      className="relative w-full aspect-[16/9] shadow-2xl overflow-hidden border border-slate-200"
      style={{ backgroundColor: slide.bgColor || '#ffffff' }}
    >
      {/* 1. TOP CONTROL BAR */}
      <div className="absolute top-6 w-full flex flex-col items-center z-50 pointer-events-none">
        <input
          type="text"
          readOnly={!isPresenter}
          value={slide.title || ""}
          onChange={(e) => onUpdate({ ...slide, title: e.target.value })}
          className="text-5xl font-black text-slate-800 outline-none w-full bg-transparent border-none text-center tracking-tight pointer-events-auto"
          placeholder="Slide Title..."
        />

        {isPresenter && (
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3 pointer-events-auto">
            {/* TRANSPARENT PLUS DROPDOWN */}
            <div className="relative">
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-full hover:bg-black/5 transition-colors text-slate-400 hover:text-slate-600"
              >
                <Plus size={24} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden py-1 z-[100]">
                  <button 
                    onClick={() => { onUpdate({ ...slide, showText: true }); setMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-slate-700 text-sm font-semibold"
                  >
                    <Type size={16} /> Add Text Box
                  </button>
                  <button 
                    onClick={() => { onUpdate({ ...slide, showImage: true }); setMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-slate-700 text-sm font-semibold"
                  >
                    <ImageIcon2 size={16} /> Add Image Slot
                  </button>
                </div>
              )}
            </div>

            {/* COLOR PICKER */}
            <div className="flex items-center gap-2 bg-white/40 backdrop-blur-md p-1.5 rounded-lg border border-slate-200 shadow-sm">
              <Palette size={14} className="text-slate-500" />
              <input 
                type="color" 
                value={slide.bgColor || "#ffffff"} 
                onChange={(e) => onUpdate({ ...slide, bgColor: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. DRAGGABLE TEXT */}
      {showText && (
        <Rnd
          size={{ width: slide.textPos?.width || '45%', height: slide.textPos?.height || '50%' }}
          position={{ x: slide.textPos?.x || 40, y: slide.textPos?.y || 140 }}
          disableDragging={!isPresenter}
          enableResizing={isPresenter}
          dragGrid={GRID_SIZE}
          resizeGrid={GRID_SIZE}
          onDragStop={(e, d) => onUpdate({ ...slide, textPos: { ...slide.textPos, x: d.x, y: d.y } })}
          onResizeStop={(e, dir, ref, delta, pos) => onUpdate({ ...slide, textPos: { width: ref.style.width, height: ref.style.height, ...pos } })}
          bounds="parent"
          className={`z-20 group/text ${isPresenter ? 'hover:outline hover:outline-1 hover:outline-indigo-400' : ''}`}
        >
          {isPresenter && (
            <button 
              onClick={() => onUpdate({ ...slide, showText: false })}
              className="absolute -top-3 -right-3 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover/text:opacity-100 transition-all z-50 shadow-lg"
            >
              <Trash2 size={14} />
            </button>
          )}
          <div className="w-full h-full bg-white/5 rounded-lg">
            <ReactQuill 
              theme="snow"
              value={slide.content || ""}
              onChange={(content) => onUpdate({ ...slide, content })}
              readOnly={!isPresenter}
              modules={{ toolbar: isPresenter ? [['bold', 'italic', { 'list': 'bullet' }]] : false }}
              className={`h-full flex flex-col text-xl ${!isPresenter ? 'hide-toolbar' : ''}`}
            />
          </div>
        </Rnd>
      )}

      {/* 3. DRAGGABLE IMAGE (Correction applied to Trash Icon) */}
      {showImage && (
        <Rnd
          size={{ width: slide.imgPos?.width || '35%', height: slide.imgPos?.height || '50%' }}
          position={{ x: slide.imgPos?.x || 550, y: slide.imgPos?.y || 140 }}
          disableDragging={!isPresenter}
          enableResizing={isPresenter}
          dragGrid={GRID_SIZE}
          resizeGrid={GRID_SIZE}
          onDragStop={(e, d) => onUpdate({ ...slide, imgPos: { ...slide.imgPos, x: d.x, y: d.y } })}
          onResizeStop={(e, dir, ref, delta, pos) => onUpdate({ ...slide, imgPos: { width: ref.style.width, height: ref.style.height, ...pos } })}
          bounds="parent"
          className={`z-20 group/img ${isPresenter ? 'hover:outline hover:outline-1 hover:outline-indigo-400' : ''}`}
        >
          {isPresenter && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onUpdate({ ...slide, showImage: false });
              }}
              className="absolute -top-3 -right-3 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover/img:opacity-100 transition-all z-50 shadow-lg"
            >
              <Trash2 size={14} />
            </button>
          )}
          <div 
            onClick={() => isPresenter && fileInputRef.current.click()}
            className={`w-full h-full flex items-center justify-center overflow-hidden relative rounded-xl border border-slate-200/50 cursor-pointer ${!slide.image ? 'bg-slate-100/50' : 'bg-white shadow-xl'}`}
          >
            {slide.image ? (
              <img src={slide.image} alt="Slide Content" className="w-full h-full object-cover pointer-events-none" />
            ) : (
              <div className="text-center opacity-20 flex flex-col items-center pointer-events-none">
                <ImageIcon size={48} />
                <p className="text-[10px] font-bold uppercase mt-2">Click to Upload</p>
              </div>
            )}
          </div>
        </Rnd>
      )}

      <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" accept="image/*" />
    </div>
  );
};

export default Slide;