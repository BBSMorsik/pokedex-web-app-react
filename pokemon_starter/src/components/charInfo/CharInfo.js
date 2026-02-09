import { useState, useEffect } from 'react'
import './charInfo.scss'
import usePokemonService from '../../services/PokemonService'
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage'
import Skeleton from '../skeleton/Skeleton'

const CharInfo = ({ charId }) => {
	const [char, setChar] = useState(null)

	const { loading, error, getPokemon, clearError } = usePokemonService()

	useEffect(() => {
		if (charId) {
			updateChar()
		}
	}, [charId])

	const updateChar = () => {
		if (!charId) {
			return
		}
		clearError()
		getPokemon(charId).then(onCharsLoaded)
	}

	const onCharsLoaded = char => {
		setChar(char)
	}

	const View = ({ char }) => {
		const { name, description, images, stats = [], types = [] } = char

		return (
			<>
				<div className='char__basics'>
					<img src={images} alt={name} />
					<div>
						<div className='char__info-name'>{name}</div>
						<div className='char__btns'>
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
				<div className='char__descr'>{description}</div>

				<div className='char__comics'>Stats:</div>
				<ul className='char__comics-list'>
					{stats.map((stat, i) => (
						<li key={i} className='char__comics-item'>
							<span className='stat-name'>{stat.name.toUpperCase()}:</span>
							<span className='stat-value'> {stat.value}</span>
						</li>
					))}
				</ul>

				<div className='char__comics'>Types:</div>
				<ul className='char__comics-list'>
					{types.map((type, i) => (
						<li key={i} className='char__comics-item'>
							{type.toUpperCase()}
						</li>
					))}
				</ul>
			</>
		)
	}

	const skeleton = char || loading || error ? null : <Skeleton />
	const errorMessage = error ? <ErrorMessage /> : null
	const spinner = loading ? <Spinner /> : null
	const content = !(loading || error || !char) ? <View char={char} /> : null

	return (
		<div className='char__info'>
			{skeleton}
			{errorMessage}
			{spinner}
			{content}
		</div>
	)
}

export default CharInfo
