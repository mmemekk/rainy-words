
function Button({className,placeHolder,onClick}){
	return <button type="button" className={className} onClick={onClick}>{placeHolder}</button>
}

export default Button;
