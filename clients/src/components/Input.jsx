
function Input({type,className,placeHolder,handleInput,value}){
	return <input type={type} className={className} placeholder={placeHolder} onChange={handleInput} value={value}></input>;
}

export default Input;
