import './App.css';
import CVBuilder from './CVBuilder';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>CV Builder</h1>
        <p>Create your professional resume in minutes</p>
      </header>
      
      <main>
        <CVBuilder />
      </main>
      
      <footer>
        <p>&copy; 2024 CV Builder. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;