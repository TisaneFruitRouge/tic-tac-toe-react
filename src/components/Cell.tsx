import Circle from '../assets/circle.svg'
import Cross from '../assets/cross.svg'

const Cell = (props) => {

	return (
		<div 
			className={`w-1/3 h-32 border-l-2 border-t-2 
						${props.row==2 ? 'border-b-2' : 'border-b-0' } 
						${props.col==2 ? 'border-r-2' : 'border-r-0' } 
						border-solid border-black hover:bg-teal-800 duration-300`}
		 	onClick={()=>{props.add_mark(props.row, props.col)}} 
		>
			<img className="w-11/12 ml-1 mt-1" src={props.mark == 1 ? Cross : (props.mark == 2 ? Circle : '')} alt="" />	
		</div>
	)
}


export default Cell