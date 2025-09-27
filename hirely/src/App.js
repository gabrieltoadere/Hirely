import './App.css';
import CVBuilder from './CVBuilder';
import logo from './logos/mainLogo.png';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img className='header-logo' src={logo} alt=''></img>
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