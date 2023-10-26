import React, { useState, useEffect } from 'react';
import {IMPORT_EVENTS} from './constants'

const SseComponent = () => {
  const [sseData, setSSEData] = useState([]);
  const [sseEventSource, setSSEEventSource] = useState(null);

  useEffect(() => {
    return () => {
      // Cleanup SSE connection when the component unmounts
      if (sseEventSource) {
        sseEventSource.close();
      }
    };
  }, [sseEventSource]);

  const startSSE = () => {
    const eventSource = new EventSource(IMPORT_EVENTS); // Replace with your SSE endpoint
    eventSource.onmessage = (event) => {
      setSSEData(event.data);
    };
    setSSEEventSource(eventSource);
  };

  const stopSSE = () => {
    if (sseEventSource) {
      sseEventSource.close();
      setSSEEventSource(null);
    }
  };

  return (
    <div>
      <div>
        <button onClick={startSSE}>Start SSE</button>
        <button onClick={stopSSE}>Stop SSE</button>
      </div>
      {sseData && <div>SSE Data: {sseData}</div>}
    </div>
  );
};

export default SseComponent;
