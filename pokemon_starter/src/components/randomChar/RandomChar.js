import { useEffect, useState } from 'react'
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage'
import usePokemonService from '../../services/PokemonService'

import './randomChar.scss'
import pokeball from '../../resources/img/pokeball.png'

const RandomChar = () => {
	const [char, setChar] = useState(null)
	const { loading, error, getPokemon, clearError } = usePokemonService()

	useEffect(() => {
		updateChar()
	}, [])

	const onCharLoaded = char => {
		setChar(char)
	}

	const updateChar = () => {
		clearError()
		const id = Math.floor(Math.random() * 1025) + 1
		getPokemon(id).then(onCharLoaded)
	}

	const View = ({ char }) => {
		if (!char || !char.name) return null
		const { name, description, images } = char
		return (
			<div className='randomchar__block'>
				<img src={images} alt='Random character' className='randomchar__img' />
				<div className='randomchar__info'>
					<p className='randomchar__name'>{name}</p>
					<p className='randomchar__descr'>{description}</p>
					<div className='randomchar__btns'>
						<a
							href={`https://www.pokemon.com/us/pokedex/${name}`}
							target='_blank'
							className='button button__main'
							rel='noreferrer noopener'
						>
							<div className='inner'>Pokédex</div>
						</a>
						<a
							href={`https://en.wikipedia.org/wiki/${name}`}
							target='_blank'
							className='button button__secondary'
							rel='noreferrer noopener'
						>
							<div className='inner'>Wiki</div>
						</a>
					</div>
				</div>
			</div>
		)
	}

	const errorMessage = error ? <ErrorMessage /> : null
	const spinner = loading ? <Spinner /> : null
	const content = !(loading || error) ? <View char={char} /> : null

	return (
		<div className='randomchar'>
			{errorMessage}
			{spinner}
			{content}
			<div className='randomchar__static'>
				<p className='randomchar__title'>
					Random pokemon for today!
					<br />
					Do you want to get to know him better?
				</p>
				<p className='randomchar__title'>Or choose another one</p>
				<button className='button button__main' onClick={updateChar}>
					<div className='inner'>try it</div>
				</button>
				<img src={pokeball} alt='pokeball' className='randomchar__decoration' />
			</div>
		</div>
	)
}

export default RandomChar
