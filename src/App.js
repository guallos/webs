import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import './App.css';

function App() {
  const [pdfLinks, setPdfLinks] = useState([]);
  const [urlInput, setUrlInput] = useState('');

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`https://webs-6cfa388a2259.herokuapp.com/api/scrape?url=${urlInput}`);
      setPdfLinks(response.data.pdfLinks);

      const zipFile = await axios.get('https://webs-6cfa388a2259.herokuapp.com/api/download', {
        params: { urls: response.data.pdfLinks },
        responseType: 'blob',
      });

      saveAs(zipFile.data, 'pdfs.zip');
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };


  return (
    <div className="app-container">
      <header>
        <h1>Web Scraper by Sergio</h1>
      </header>
      <main>
        <section className="form-section">
          <h2>Raspa una URL</h2>
          <form onSubmit={handleUrlSubmit}>
            <input
              type="text"
              placeholder="Ingresa la URL a raspar"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
            <button type="submit">Raspar</button>
          </form>
        </section>
        <section className="links-section">
          <h2>Enlaces PDF encontrados</h2>
          <ul>
            {pdfLinks.map((link, index) => (
              <li key={index}>
                <a href={link} download>
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <footer>
        <p>© 2024 Web Scraper App</p>
      </footer>
    </div>
  );
}

export default App;
