import React, { useState, useEffect } from 'react';

function SseComponent() {
  const [messages, setMessages] = useState([]);
  const [sse, setSSE] = useState(null);

  const connectSSE = () => {
    if (sse) {
      // Close the existing SSE connection if it exists.
      sse.close();
      setSSE(null);
    }

    const newSSE = new EventSource('http://localhost:58885/offline-map-status', { withCredentials: false });
    newSSE.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, JSON.parse(event.data)]);
    };
    setSSE(newSSE);
  };

  const closeSSE = () => {
    if (sse) {
      sse.close();
      setSSE(null);
    }
  };

  useEffect(() => {
    // Add an event listener for handling SSE errors (connection loss).
    if (sse) {
      sse.onerror = () => {
        console.log('Connection lost. Attempting to reconnect...');
        closeSSE();
        setTimeout(() => connectSSE(), 1000); // Reconnect after 1 second.
      };
    }

    return () => {
      closeSSE(); // Close SSE when the component unmounts.
    };
  }, [sse]);

  return (
    <div>
      <button onClick={connectSSE}>Start SSE</button>
      <button onClick={closeSSE}>Close SSE</button>
      <div>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
    </div>
  );
}

export default SseComponent;
// import React, { useState, useEffect } from 'react';

// const SseComponent = () => {
//   const [sseData, setSSEData] = useState({
//     event: null,
//     id: null,
//     data: {
//       message: null,
//       isLoading: false,
//     },
//   });

//   let eventSource;

//   useEffect(() => {
//     // Create an EventSource for the SSE endpoint
//     eventSource = new EventSource('http://localhost:58885//offline-map-status');

//     eventSource.onmessage = (event) => {
//       const eventData = JSON.parse(event.data);
//       setSSEData(eventData);
//     };

//     eventSource.onerror = (error) => {
//       console.error('SSE Error:', error);
//     };

//     // Clean up the EventSource when the component unmounts
//     return () => {
//       if (eventSource) {
//         eventSource.close();
//       }
//     };
//   }, []);

//   const retrieveSSEMessage = () => {
//     // You can perform additional actions like making an HTTP request here if needed
//     // Set isLoading to true while retrieving data
//     setSSEData((prevData) => ({
//       ...prevData,
//       data: {
//         ...prevData.data,
//         isImporting: false,
//       },
//     }));
//   };

//   return (
//     <div>
//       <h1>SSE Component</h1>
//       <button onClick={retrieveSSEMessage}>Retrieve SSE Message</button>
//       <button onClick={() => eventSource && eventSource.close()}>Close SSE Connection</button>
//       <div>
//         <p>Event: {sseData.event}</p>
//         <p>ID: {sseData.id}</p>
//         <p>
//           Message: {sseData.data.message}, Is Loading: {sseData.data.isImporting ? 'Yes' : 'No'}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SseComponent;
