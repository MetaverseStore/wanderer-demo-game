import Controls from "./components/Controls";
import Canva from "./Canva";
import { useState, useEffect } from "react";
import ControlsImage from "./images/controls.png";
import { IoLogoGameControllerB } from 'react-icons/io'


function App() {

  const [characterModal, setCharacterModal] = useState("./3dModels/character/default.glb");
  const [attributes, setAttributes] = useState(null);
  const [characterLoaded, setCharacterLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showControlsModal, setShowControlsModal] = useState(false)

  const handleMetastoreCharacter = () => {
    setShowModal(true);
  }

  const handleDefaultCharacter = () => {
    setCharacterModal("./3dModels/character/default.glb");
    setAttributes(null);
    setCharacterLoaded(true);
  }

  useEffect(() => {
    const handler = (event: any) => {
      const data = JSON.parse(event.data)
      console.log(data);
      if (data.source === "metastore") {
        setAttributes(JSON.parse(data.attributes));
        setCharacterModal(data.itemUrl);
        setCharacterLoaded(true);
        setShowModal(false);
      }
    }

    window.addEventListener("message", handler)

    // clean up
    return () => window.removeEventListener("message", handler)
  }, []);


  return (
    <div className="w-full h-screen bg-fuchsia-100 relative">
      {!characterLoaded && (
        <div className="flex flex-col h-screen items-center bg-no-repeat bg-cover	 justify-center bg-[url('./images/bg_image.jpeg')]">
          <h2 className="text-6xl font-bold font-[Bungee] bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-lime-500">Wanderer</h2>
          <div className="flex items-center mt-6">
            <button
              onClick={() => handleDefaultCharacter()}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
            >
              Load default character
            </button>
            <button
              onClick={() => handleMetastoreCharacter()}
              className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white font-bold py-2 px-4 rounded m-2"
            >
              Load Metastore character
            </button>
          </div>
          {showModal && (
            <>
              <div className="absolute z-50 overflow-hidden top-1/2 rounded-2xl left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-gray-900 flex items-center justify-center">
                <iframe src="https://meta-store.in/widget" title="Metastore" className="w-[90vw] h-[80vh]"></iframe>
              </div>
              <div className="fixed inset-0 bg-black bg-opacity-25" />
              <div
                className="absolute bg-black bg-opacity-80 top-10 right-10  z-50 px-4 py-2 rounded-lg cursor-pointer"
                onClick={() => setShowModal(false)}
              >
                <p className="text-white">Close</p>
              </div>
            </>
          )}

          {showControlsModal && (
            <>
              <div className="absolute z-50 p-0 sm:p-10 xl:p-20 overflow-hidden top-1/2 rounded-2xl left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-[#111827DE] flex items-center justify-center">
                <img
                  src={ControlsImage}
                  alt="game controls"
                />
              </div>
              <div className="fixed inset-0 bg-black bg-opacity-25" />
              <div
                className="absolute bg-black bg-opacity-80 top-10 right-10  z-50 px-4 py-2 rounded-lg cursor-pointer"
                onClick={() => setShowControlsModal(false)}
              >
                <p className="text-white">Close</p>
              </div>
            </>
          )}

          {!showModal && (
            <button
              onClick={() => setShowControlsModal(true)}
              className="text-white font-bold py-2 px-4 rounded m-2 absolute bottom-10 right-10 bg-black flex items-center"
            >
              <IoLogoGameControllerB className="text-lg mr-2" />
              Controls
            </button>
          )}
        </div>
      )}

      {characterLoaded && (
        <>
          <Controls setCharacterLoaded={setCharacterLoaded} attributes={attributes} />
          <Canva
            characterModal={characterModal}
          />
        </>
      )}

    </div>
  );
}

export default App;
