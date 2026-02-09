import { useEffect, useState } from 'react'
import usePokemonService from '../../services/PokemonService'
import './charList.scss'
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage'

const CharList = props => {
	const [chars, setChars] = useState([])
	const [offset, setOffset] = useState(0)
	const [newItemLoading, setNewItemLoading] = useState(false)
	const [charEnded, setCharEnded] = useState(false)

	const { loading, error, getAllPokemons } = usePokemonService()

	useEffect(() => {
		onRequest(offset, true)
	}, [])

	const onRequest = (offset, initial) => {
		initial ? setNewItemLoading(false) : setNewItemLoading(true)
		getAllPokemons(9, offset).then(onCharsLoaded)
	}

	const onCharsLoaded = newChars => {
		let ended = false
		if (newChars.length < 9) {
			ended = true
		}

		setChars(prev => [...prev, ...newChars])
		setNewItemLoading(false)
		setOffset(prev => prev + 9)
		setCharEnded(ended)
	}

	const renderItems = chars => {
		return (
			<ul className='char__grid'>
				{chars.map(char => (
					<li
						className='char__item'
						key={char.id}
						onClick={() => props.onCharSelected(char.id)}
					>
						<img src={char.images} alt={char.name} />
						<div className='char__name'>{char.name}</div>
					</li>
				))}
			</ul>
		)
	}

	const errorMessage = error ? <ErrorMessage /> : null
	const spinner = loading && !newItemLoading ? <Spinner /> : null

	return (
		<div className='char__list'>
			{errorMessage}
			{spinner}
			{renderItems(chars)}
			<button
				className='button button__main button__long'
				disabled={newItemLoading}
				style={{ display: charEnded ? 'none' : 'block' }}
				onClick={() => onRequest(offset)}
			>
				<div className='inner'>
					{newItemLoading ? 'Loading...' : 'Load more'}
				</div>
			</button>
		</div>
	)
}

export default CharList
