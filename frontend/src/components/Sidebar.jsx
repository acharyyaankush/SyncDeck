import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Trash2 } from 'lucide-react';

const Sidebar = ({ slides, currentSlide, onSelect, onReorder, onAddSlide, onDeleteSlide, isPresenter }) => {

  // Handles the logic when a slide is dropped in a new position
  const handleOnDragEnd = (result) => {
    if (!result.destination || !isPresenter) return;

    const items = Array.from(slides);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorder(items);
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 border-r border-slate-200 min-w-[260px]">
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Slides</h2>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="sidebar-slides">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {slides.map((slide, index) => (
                  <Draggable key={slide.id} draggableId={slide.id.toString()} index={index} isDragDisabled={!isPresenter}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`group relative p-3 rounded-xl border-2 transition-all cursor-pointer ${
                          index === currentSlide ? 'border-indigo-600 bg-white shadow-md' : 'border-transparent bg-slate-200 hover:bg-slate-300'
                        }`}
                        onClick={() => onSelect(index)}
                      >
                        <p className="text-xs font-bold truncate pr-6 text-slate-800">
                          {slide.title || "New Slide"}
                        </p>

                        {/* DELETE BUTTON: Presenter Only */}
                        {isPresenter && slides.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent selecting the slide when clicking delete
                              onDeleteSlide(slide.id);
                            }}
                            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Add Slide Button Section */}
      {isPresenter && (
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onAddSlide}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
          >
            + Add Slide
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;