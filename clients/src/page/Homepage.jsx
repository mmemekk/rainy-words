
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Homepage.css';
import {socket} from "../utils/socket.jsx";
import Input from "../components/Input";
import Button from "../components/Button";


export let userName ='';
const Home = () =>{
    const [name, setName] = useState('');
    const [isVisible, setIsVisible] = useState(true);
    const [errorMessage, setErrorMessage] = useState(false);
    const [noInputMessage, setNoInputMessage] = useState(false);
    const navigate = useNavigate();

    function handleInput(event){
      let { value } = event.target;
      setName(value);
    }

    function handleNextButtonClick () {
        if(name === ''){
            setNoInputMessage(true);
        }else{
        socket.emit('addUser',name);
        userName=name;
        setName('');
        }
    };

    function addUser(){
      socket.on("success_addUser", () =>{
        setIsVisible(true);
        navigate('/welcome');
      })
    }

    function errorUser(){
        socket.on("fail_addUser", () =>{
            setErrorMessage(true);
        })
    }

    function closeErrorMessage(){
        setErrorMessage(false);
    }

    function closeNoInputMessage(){
        setNoInputMessage(false);
    }


    useEffect(() => {

      addUser();
      errorUser();

    }, []);

    return (
        <>
        <div className='homebg'>
          <div className="landdiv">
            {isVisible && (
              <>
                <Input
                  type="text"
                  className="inputName"
                  placeHolder="Enter your name"
                  handleInput={handleInput}
                  value={name}
                />
                <Button
                  className='btnNext'
                  placeHolder='Next'
                  onClick={handleNextButtonClick}
                />
              </>
            )}
          </div>

          {errorMessage && (
            <>
            <div className="errormessage">
              <h>this name already exists.<br/>Try again</h>
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
