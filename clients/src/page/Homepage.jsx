
import { useEffect, useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Homepage.css';
import { socket } from "../utils/socket.jsx";

export let userName = '';

const Home = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState(false);
  const [noInputMessage, setNoInputMessage] = useState(false);


  useEffect(() => {

    socket.on("returnHome", () =>{
      navigate('/');
    })

    addUser();
    errorUser();

  }, []);

  function handleInput(event) {
    let { value } = event.target;
    setName(value);
  }

  function handleNextButtonClick(event) {
    event.preventDefault();

    const clickAudio = new Audio("/click.mp3");
    const messageAudio = new Audio("/message.mp3");
    clickAudio.play();

    setTimeout(() => { // just want messageAudio to play after Click Audio
      if (name === '') {
          messageAudio.play();
          setNoInputMessage(true);
      } else {
          socket.emit('addUser', name.trim());
          // userName = name;
          setName('');
      }
  }, 350);
  };

  function addUser() {
    socket.on("success_addUser", () => {
      navigate('/welcome');
    })
  }

  function errorUser() {
    socket.on("fail_addUser", () => {
      const messageAudio = new Audio("/message.mp3");
      messageAudio.play();
      setErrorMessage(true);
    })
  }

  function closeErrorMessage() {
    const clickAudio = new Audio("/click.mp3");
    clickAudio.play();
    setErrorMessage(false);
  }

  function closeNoInputMessage() {
    const clickAudio = new Audio("/click.mp3");
    clickAudio.play();
    setNoInputMessage(false);
  }

  // const [backgroundClass, setBackgroundClass] = useState('bg1');

  // const toggleBackground = () => {
  //   setBackgroundClass((prevClass) =>
  //     prevClass === 'bg1' ? 'bg2' : 'bg1'
  //   );
  // };

  const backgrounds = ['background1', 'background2', 'background3'];

  // State to keep track of the current background index
  // const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [backgroundIndex, setBackgroundIndex] = useState(() => {
    const savedIndex = localStorage.getItem('backgroundIndex');
    return savedIndex !== null ? parseInt(savedIndex, 10) : 0;
  });

  // Function to cycle through the backgrounds
  const cycleBackground = () => {
    const newIndex = (backgroundIndex + 1) % backgrounds.length;
    setBackgroundIndex(newIndex);
    localStorage.setItem('backgroundIndex', newIndex);
  };

  const themebutDis = ['☀️','⛅️','🌙']

  return (
    <>
      <div className={`App ${backgrounds[backgroundIndex]}`}>
        <svg viewBox="0 0 500 200">
          <path id="curve" className="path" d="M73.2,148.6c4-6.1,65.5-96.8,178.6-95.6c111.3,1.2,170.8,90.3,175.1,97" />
          <text width="500" className="curvedText">
            <textPath xlinkHref="#curve" startOffset="51%" textAnchor="middle">
              Rainy Word
            </textPath>
          </text>
        </svg>
        <form onSubmit={handleNextButtonClick} className="inputContainer">
          <input
            type="text"
            className="inputName"
            placeholder="Enter your name"
            onChange={handleInput}
            value={name}
          />
          <button
            type="button"
            className='btnNext'
            onClick={handleNextButtonClick}
          >
            Next
          </button>

        </form>

        {errorMessage && (
          <>
            <div className="errormessage">
              <h>this name already exists<br />Try again !</h>
            </div>

            <div >
              <button className="close-btn" onClick={closeErrorMessage}>X</button>
            </div>
          </>
        )}

        {noInputMessage && (
          <>
            <div className="errormessage">
              <h>Please Enter Your Name</h>
            </div>

            <div >
              <button className="close-btn" onClick={closeNoInputMessage}>X</button>
            </div>
          </>
        )}
        <button className='ThemeButt' onClick={cycleBackground}>{themebutDis[backgroundIndex]}</button>
      </div>
    </>
  );


}

export default Home;
