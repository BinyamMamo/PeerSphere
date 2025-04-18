
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { FiVideo, FiVideoOff, FiMic, FiMicOff, FiMessageSquare, FiX, FiSend, FiUsers, FiClock, FiBook, FiMaximize, FiMinimize } from 'react-icons/fi';

const SessionRoom = () => {
  const { tutorId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { formData } = location.state || { formData: {} };

  // State for session controls
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [sessionTime, setSessionTime] = useState(0); // in seconds
  const [isSessionActive, setIsSessionActive] = useState(true);

  // Mock tutor data - in a real app, you'd fetch this from your API
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch tutor data
  useEffect(() => {
    const fetchTutor = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock tutor data
        setTutor({
          id: parseInt(tutorId),
          name: "Jane Doe",
          subject: formData.subject || "Mathematics",
          avatar: "/api/placeholder/100/100", // placeholder image
        });
      } catch (error) {
        console.error('Error fetching tutor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutor();
  }, [tutorId, formData.subject]);

  // Session timer
  useEffect(() => {
    let interval = null;

    if (isSessionActive) {
      interval = setInterval(() => {
        setSessionTime(prevTime => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSessionActive]);

  // Format session time
  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'You',
        text: message.trim(),
        timestamp: new Date()
      };

      setMessages([...messages, newMessage]);
      setMessage('');

      // Simulate tutor response after a delay
      setTimeout(() => {
        const tutorResponse = {
          id: messages.length + 2,
          sender: tutor?.name || 'Tutor',
          text: 'I understand your question. Let me explain this concept...',
          timestamp: new Date()
        };
        setMessages(prevMessages => [...prevMessages, tutorResponse]);
      }, 3000);
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle end session
  const handleEndSession = () => {
    if (window.confirm('Are you sure you want to end this session?')) {
      setIsSessionActive(false);

      // Navigate to post-session feedback
      navigate('/session-feedback', {
        state: {
          tutorId,
          sessionDuration: sessionTime,
          subject: formData.subject
        }
      });
    }
  };

  // Toggle fullscreen
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <svg className="animate-spin h-10 w-10 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-xl font-medium">Connecting to session...</p>
        </div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center p-6">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-xl font-medium">Session Not Found</h3>
          <p className="mt-1 text-gray-300">
            We couldn't connect to your tutoring session.
          </p>
          <button
            onClick={() => navigate('/book-session')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-900 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Return to Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col">
      {/* Session Info Bar */}
      <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <FiBook className="mr-2" />
            <span className="font-medium">{formData.subject || 'Tutoring Session'}</span>
          </div>
          <div className="flex items-center">
            <FiUsers className="mr-2" />
            <span>With: {tutor.name}</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <FiClock className="mr-2" />
            <span>{formatTime(sessionTime)}</span>
          </div>
          <button
            onClick={toggleFullScreen}
            className="p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {isFullScreen ? <FiMinimize /> : <FiMaximize />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex">
        {/* Video Area */}
        <div className={`relative flex-grow bg-black ${isChatOpen ? 'hidden md:block md:flex-grow' : 'flex-grow'}`}>
          {/* Tutor Video */}
          <div className="h-full w-full flex items-center justify-center">
            {isVideoOn ? (
              <img
                src="/api/placeholder/800/600"
                alt="Tutor video placeholder"
                className="max-h-full max-w-full"
              />
            ) : (
              <div className="text-white text-center">
                <svg className="mx-auto h-20 w-20 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-2">Video is turned off</p>
              </div>
            )}
          </div>

          {/* Student Video (Small overlay) */}
          <div className="absolute bottom-4 right-4 w-1/4 h-1/4 bg-gray-800 border-2 border-gray-700 rounded-lg overflow-hidden">
            {isVideoOn ? (
              <img
                src="/api/placeholder/200/150"
                alt="Your video"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                <svg className="h-10 w-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Chat Panel */}
        {isChatOpen && (
          <div className="w-full md:w-80 bg-white flex flex-col h-full border-l border-gray-300">
            <div className="p-3 bg-gray-100 border-b border-gray-300 flex justify-between items-center">
              <h3 className="font-medium">Session Chat</h3>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none p-1"
              >
                <FiX />
              </button>
            </div>

            <div className="flex-grow p-3 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-6">
                  <p>No messages yet</p>
                  <p className="text-sm">Send a message to begin the conversation</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-2 rounded-lg max-w-xs ${msg.sender === 'You'
                          ? 'ml-auto bg-primary-100 text-primary-900'
                          : 'bg-gray-100 text-gray-900'
                        }`}
                    >
                      <p className="text-xs font-medium">{msg.sender}</p>
                      <p>{msg.text}</p>
                      <p className="text-xs text-gray-500 text-right">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-gray-300">
              <div className="flex">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-primary-500 focus:border-primary-500 resize-none"
                  rows="2"
                ></textarea>
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="px-3 bg-primary-600 text-white rounded-r-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <FiSend />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={() => setIsMicOn(!isMicOn)}
            className={`p-3 rounded-full ${isMicOn ? 'bg-primary-600 hover:bg-primary-700' : 'bg-red-600 hover:bg-red-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
          >
            {isMicOn ? <FiMic /> : <FiMicOff />}
          </button>
          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-3 rounded-full ${isVideoOn ? 'bg-primary-600 hover:bg-primary-700' : 'bg-red-600 hover:bg-red-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
          >
            {isVideoOn ? <FiVideo /> : <FiVideoOff />}
          </button>
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`p-3 rounded-full ${isChatOpen ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-700 hover:bg-gray-600'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
          >
            <FiMessageSquare />
          </button>
        </div>

        <button
          onClick={handleEndSession}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          End Session
        </button>
      </div>
    </div>
  );
};

export default SessionRoom;
