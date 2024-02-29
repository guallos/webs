import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { ThreeDots } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [pdfLinks, setPdfLinks] = useState([]);
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingLinks, setLoadingLinks] = useState(false); // Nuevo estado para manejar la carga de los enlaces
  const [downloadedFiles, setDownloadedFiles] = useState('[...]'); // Nuevo estado para llevar la cuenta de los archivos descargados
  const [foundLinks, setFoundLinks] = useState('[...]'); // Nuevo estado para llevar la cuenta de los enlaces encontrados

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoadingLinks(true); // Activar el spinner de carga de los enlaces
    setFoundLinks('...'); // Inicializar los enlaces encontrados a '...'
    setDownloadedFiles('...'); // Inicializar los archivos descargados a '...'
    try {
      const response = await axios.get(`https://webs-6cfa388a2259.herokuapp.com/api/scrape?url=${urlInput}`);
      
      // Asegúrate de que la respuesta de la API contiene los datos esperados
      if (response && response.data && Array.isArray(response.data.pdfLinks)) {
        setPdfLinks(response.data.pdfLinks); // Actualizar el estado con los enlaces encontrados
        setFoundLinks(response.data.pdfLinks.length); // Actualizar el estado con la cantidad de enlaces encontrados
      } else {
        console.error('Error: Los datos de la respuesta no son los esperados');
      }

      setLoadingLinks(false); // Desactivar el spinner de carga de los enlaces

      toast.info('Descargando los archivos', { autoClose: false }); // Mostrar el toast de descarga de archivos
      const zipFile = await axios.get('https://webs-6cfa388a2259.herokuapp.com/api/download', {
        params: { urls: response.data.pdfLinks },
        responseType: 'blob',
      });

      saveAs(zipFile.data, 'pdfs.zip');
      setDownloadedFiles(response.data.pdfLinks.length); // Actualizar el estado con la cantidad de archivos descargados
      toast.dismiss(); // Cerrar todos los toasts
      toast.success('Descarga de archivos completa');
      setUrlInput('');
    } catch (error) {
      console.error('Error al obtener datos:', error);
      toast.error('Error al obtener datos. Ingresa una url válida.');
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Web Scraper App by Sergio Bernal Castro</h1>
      </header>
      <main>
        <section className="form-section">
          <h2>Ingresa una url válida</h2>
          <h3>Esta aplicación ingresa a una url objetivo, realiza una búsqueda de links que contengan archivos .pdf y los muestra en una lista. Así mismo, descarga los archivos en una carpeta .zip.</h3>
          <form onSubmit={handleUrlSubmit}>
            <input
              type="text"
              placeholder="Ingresa la URL a raspar"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? <ThreeDots color="#00BFFF" height={20} width={20} /> : 'Raspar'}
            </button>
          </form>
          <h4>Nota: Es posible que esta aplicación no funcione con páginas web que generen sus links dinámicamente, ni con políticas rígidas de CORS.</h4>
        </section>
        <section className="stats-section">
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <h3 style={{ marginRight: '10px' }}>Urls encontradas: </h3>
    {loadingLinks ? <ThreeDots color="#00BFFF" height={20} width={20} /> : <span>{foundLinks}</span>}
  </div>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <h3 style={{ marginRight: '10px' }}>Archivos descargados: </h3>
    {loading ? <ThreeDots color="#00BFFF" height={20} width={20} /> : <span>{downloadedFiles}</span>}
  </div>
</section>
        <section className="links-section">
        <h3>Enlaces PDF encontrados {loadingLinks && <ThreeDots color="#00BFFF" height={40} width={40} />}</h3>
          <ul>
  {pdfLinks.map((link, index) => (
    <li key={index}>
      <div style={{ display: 'flex' }}>
        <span>{index + 1}. </span>
        <a href={link} download target="_blank" rel="noopener noreferrer">
          {link}
        </a>
      </div>
    </li>
  ))}
</ul>

        </section>
      </main>
      <footer>
        <p>© 2024 Web Scraper App by Sergio Bernal Castro</p>
      </footer>
      <ToastContainer />
    </div>
  );
}

export default App;
