
function Input({type,className,placeHolder,handleInput}){
	return <input type={type} className={className} placeholder={placeHolder} onChange={handleInput}></input>;
}

export default Input;
