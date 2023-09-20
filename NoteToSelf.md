# Using MERN, MySQL, Express, React, Node.js
    # MySQL for any persistent storage, 
        # Redis (redis.io, redis-stack) for caching and session management + visualization
        # sessionStorage for client-side caching
    # Express framework for node
    # React for frontend
    # Node.js for backend
# Supplemented with Docker in WSL2 for containerization and deployment
# Vite for build and development
# React-Bootstrap + CSS for theming


# Redis #
redis => 
    room =>
        {roomCode} =>
            {players}
            aiScore
            humanScore
    player => 
        {uuid} =>
            roomCode
            playerName
            playerScore
    active_rooms =>
        {roomCode}
# Using socket.id as uuid for now