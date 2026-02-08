import React, { useState } from 'react';
import { useSocket } from './hooks/useSocket';
import Slide from './components/Slide';
import Sidebar from './components/Sidebar';
import RoleBadge from './components/RoleBadge';
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react'; // Added icons

function App() {
  const [role, setRole] = useState('viewer');
  const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar toggle state

  const { 
    currentSlide, 
    setCurrentSlide, 
    AddSlide,
    triggerDeleteSlide,
    slides, 
    setSlides, 
    pointer, 
    sendPointer, 
    sendContent, 
    sendSlideChange,
    sendNewOrder 
  } = useSocket();

   const handleSlideChange = (newIndex) => {
    console.log(12,newIndex);

    if (role !== 'presenter') return;

    setcurrentSlide(newIndex);
    emitslidechange(newIndex);
  };

  // Previous Slide Logic
  const handlePrev = () => {
    if (role !== 'presenter' || currentSlide === 0) return;
    const prevIndex = currentSlide - 1;
    setCurrentSlide(prevIndex);
    sendSlideChange(prevIndex);
  };

  // Next Slide Logic
  const handleNext = () => {
    if (role !== 'presenter' || currentSlide === slides.length - 1) return;
    const nextIndex = currentSlide + 1;
    setCurrentSlide(nextIndex);
    sendSlideChange(nextIndex);
  };

  const handleUpdateSlide = (updatedSlide) => {
    if (role !== 'presenter') return;
    const updatedSlides = slides.map((s) => s.id === updatedSlide.id ? updatedSlide : s);
    setSlides(updatedSlides);
    sendContent(updatedSlides);
  };

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden relative">
      {/* Sidebar with dynamic width/visibility */}
      <div className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
        <Sidebar 
          slides={slides}
          currentSlide={currentSlide}
          onAddSlide={AddSlide}
          onDeleteSlide={triggerDeleteSlide}
          onSelect={(index) => {
            if (role === 'presenter') {
              <Controls 
                current={currentSlide} 
                total={Slide.length}
                onNext={() => handleSlideChange(currentSlide + 1)}
                onPrev={() => handleSlideChange(currentSlide - 1)}
              />
              setCurrentSlide(index);
              sendSlideChange(index);
            }
          }}
          onReorder={(newOrder) => {
            if (role === 'presenter') {
              setSlides(newOrder);
              sendNewOrder(newOrder);
            }
          }}
          isPresenter={role === 'presenter'}
        />
      </div>

      

      <main 
        className="flex-1 relative flex flex-col items-center justify-center p-12 overflow-hidden"
        onMouseMove={(e) => {
          if (role !== 'presenter') return;
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          sendPointer({ x, y, active: true });
        }}
        onMouseLeave={() => role === 'presenter' && sendPointer({ active: false })}
      >
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 pointer-events-none">
        {/* Sidebar Toggle - pointer-events-auto makes it clickable */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2.5 bg-white rounded-xl shadow-md hover:bg-slate-50 transition-colors text-slate-600 border border-slate-100 pointer-events-auto"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Role Badge - pointer-events-auto makes it clickable */}
        <div className="pointer-events-auto">
          <RoleBadge role={role} setRole={setRole} />
        </div>
      </div>
        
        <div className="relative w-full max-w-5xl mt-16 flex flex-col items-center">
          {slides.length > 0 ? (
            <>
              <Slide 
                slide={slides[currentSlide]} 
                isPresenter={role === 'presenter'} 
                onUpdate={handleUpdateSlide} 
              />

              {/* Laser Pointer */}
              {pointer.active && (
                <div 
                  className="laser-pointer absolute w-4 h-4 bg-red-600 rounded-full shadow-[0_0_15px_red]"
                  style={{ 
                    left: `${pointer.x}%`, 
                    top: `${pointer.y}%`,
                    transition: 'left 0.1s ease-out, top 0.1s ease-out',
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              )}

              {/* Bottom Navigation Controls (Presenter Only) */}
              {role === 'presenter' && (
                <div className="mt-8 flex items-center gap-4 bg-white px-6 py-3 rounded-full shadow-lg border border-slate-200">
                  <button 
                    onClick={handlePrev} 
                    disabled={currentSlide === 0}
                    className="p-2 hover:bg-slate-100 rounded-full disabled:opacity-30"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <span className="text-sm font-bold text-slate-500">
                    {currentSlide + 1} / {slides.length}
                  </span>
                  <button 
                    onClick={handleNext} 
                    disabled={currentSlide === slides.length - 1}
                    className="p-2 hover:bg-slate-100 rounded-full disabled:opacity-30"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="animate-pulse text-slate-400">Connecting to live deck...</div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;