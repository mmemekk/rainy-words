
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Homepage.css';
import { socket } from "../utils/socket.jsx";
import Input from "../components/Input";
import Button from "../components/Button";


export let userName = '';
const Home = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [errorMessage, setErrorMessage] = useState(false);
  const [noInputMessage, setNoInputMessage] = useState(false);


  useEffect(() => {

    addUser();
    errorUser();

  }, []);

  function handleInput(event) {
    let { value } = event.target;
    setName(value);
  }

  function handleNextButtonClick(event) {
    event.preventDefault();

    if (name === '') {
      setNoInputMessage(true);
    } else {
      socket.emit('addUser', name);
      userName = name;
      setName('');
    }
  };

  function addUser() {
    socket.on("success_addUser", () => {
      setIsVisible(true);
      navigate('/welcome');
    })
  }

  function errorUser() {
    socket.on("fail_addUser", () => {
      setErrorMessage(true);
    })
  }

  function closeErrorMessage() {
    setErrorMessage(false);
  }

  function closeNoInputMessage() {
    setNoInputMessage(false);
  }

  return (
    <>
      <div className='homebg'>
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
            placeHolder="Enter your name"
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
      </div>
    </>

  );


}

export default Home;
