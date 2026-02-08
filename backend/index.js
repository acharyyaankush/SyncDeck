const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173"
    }
});

// Global State
let slides = [
  { 
    id: Date.now().toString(), 
    title: "Professional Slide", 
    content: "Edit me...", 
    image: "",
    bgColor: "#ffffff" // Default white
  }
];
let currentSlideIndex = 0;

io.on('connection', (socket) => {
    console.log('user connected:', socket.id);

    // Initial Sync: Send the current state to the user who just joined
    socket.emit('init-state', { slides, currentSlideIndex });

    // 1. LASER POINTER
    socket.on('pointer-move', (coords) => {
        socket.broadcast.emit('pointer-updated', coords);
    });

    // 2. EDITING CONTENT
    socket.on('update-slide-content', (updatedSlides) => {
        slides = updatedSlides;
        // Use broadcast so the presenter doesn't get their own update back
        socket.broadcast.emit('content-synced', slides);
    });

    // 3. NAVIGATION
    socket.on('change-slide', (index) => {
        currentSlideIndex = index;
        socket.broadcast.emit('slide-updated', index);
    });

    // 4. REORDERING
    socket.on('update-deck-order', (newSlides) => {
        slides = newSlides;
        socket.broadcast.emit('deck-reordered', newSlides);
        console.log("Deck reordered");
    });

    // 5. ADD SLIDE (The Fix)
    socket.on('add-slide', () => {
        const newSlide = {
            id: Date.now().toString(),
            title: "New Slide",
            content: "Write here...",
            image: "",
            bgColor: "#ffffff",
            // Default professional positioning
            textPos: { x: 40, y: 120, width: '400px', height: '300px' },
            imgPos: { x: 500, y: 120, width: '300px', height: '300px' }
        };
        slides.push(newSlide);
        
        // Use io.emit so EVERYONE (Presenter and Viewers) gets the new slide immediately
        io.emit('content-synced', slides); 
    });

    // 6. DELETE SLIDE
    socket.on('delete-slide', (slideId) => {
        slides = slides.filter(s => s.id !== slideId);
        
        if (slides.length === 0) {
            slides.push({ id: Date.now().toString(), title: "New Slide", content: "Edit me...", image: "" });
        }

        // Use io.emit to update everyone's sidebar
        io.emit('content-synced', slides);
    });

    socket.on('disconnect', () => console.log('User disconnected'));
});

server.listen(3000, () => console.log('server running on port 3000'));