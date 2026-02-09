// import { useEffect, useRef, useState } from "react"
// import { io } from 'socket.io-client';

// export const useSocket = () => {
//     const socketref = useRef();
//     const [currentSlide, setcurrentSlide] = useState(0);

//     useEffect(()=>{
//         socketref.current = io("https://syncdeck.onrender.com/");

//         socketref.current.on('slide-updated',(index)=>{
//             console.log(12,'viewer receive update:',index);
//             setcurrentSlide(index);
//         });
//         return () => socketref.current.disconnect();
//     },[]);

//     const emitslidechange = (index) =>{
//         socketref.current.emit('change-slide',index);
//     };

//     return {
//         currentSlide, setcurrentSlide, emitslidechange
//     };

// };

import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export const useSocket = () => {
  const socketRef = useRef();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [pointer, setPointer] = useState({ x: 0, y: 0, active: false });

  useEffect(() => {
    socketRef.current = io('http://localhost:3000');

    socketRef.current.on('init-state', (data) => {
      setSlides(data.slides);
      setCurrentSlide(data.currentSlideIndex);
    });

    socketRef.current.on('slide-updated', (index) => setCurrentSlide(index));
    socketRef.current.on('content-synced', (newSlides) => setSlides(newSlides));
    socketRef.current.on('pointer-updated', (coords) => setPointer(coords));

    socketRef.current.on('deck-reordered', (newSlides) => {
    setSlides(newSlides);

    
});

    return () => socketRef.current.disconnect();
  }, []);

  const sendPointer = (coords) => socketRef.current.emit('pointer-move', coords);
  const sendContent = (newSlides) => socketRef.current.emit('update-slide-content', newSlides);
  const sendSlideChange = (index) => socketRef.current.emit('change-slide', index);
  const sendNewOrder = (newSlides) => {
    socketRef.current.emit('update-deck-order', newSlides);
  };
  const AddSlide = () => {
    if (socketRef.current) {
      console.log("Emitting add-slide event...");
      socketRef.current.emit('add-slide');
    }
  };
  const triggerDeleteSlide = (slideId) => {
    if (socketRef.current) {
      socketRef.current.emit('delete-slide', slideId);
    }
  };

  return { currentSlide, setCurrentSlide, slides, setSlides, pointer, sendPointer,
     sendContent, sendSlideChange, sendNewOrder, AddSlide, triggerDeleteSlide};

};
