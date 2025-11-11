import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:5001');

function App() {
  const [editorContent, setEditorContent] = useState('');

  useEffect(() => {
    // Initialize document content
    socket.on('init-document', (content) => {
      setEditorContent(content);
    });

    // Listen for updates from other users
    socket.on('text-update', (newContent) => {
      setEditorContent(newContent);
    });

    return () => {
      socket.off('init-document');
      socket.off('text-update');
    };
  }, []);

  const handleEditorChange = (value) => {
    setEditorContent(value);
    socket.emit('text-change', value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Collaborative Editor</h1>
      </header>
      <main style={{ height: 'calc(100vh - 100px)' }}>
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={editorContent}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 16,
          }}
        />
      </main>
    </div>
  );
}

export default App;
