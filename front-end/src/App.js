import logo from './logo.svg';
import './App.css';
import SseComponent from './components/SseComponent';
import FileUpload from './components/FileUploadComponent';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <>
        <FileUpload/>
        <SseComponent/>
      </>
      </header>
    </div>
  );
}

export default App;
