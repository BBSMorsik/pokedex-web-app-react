import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
	getPokemonId,
	getTypeColor,
	formatPokemonName,
} from '../../utils/pokemonUtils'
import './pokemonsByType.scss'
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage'

const PokemonsByType = () => {
	const { typeName } = useParams()
	const [pokemons, setPokemons] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)
	const [typeInfo, setTypeInfo] = useState(null)

	useEffect(() => {
		const fetchTypeData = async () => {
			try {
				setLoading(true)
				const response = await fetch(
					`https://pokeapi.co/api/v2/type/${typeName}`,
				)

				if (!response.ok) {
					throw new Error('Type not found')
				}

				const data = await response.json()

				setTypeInfo({
					name: data.name,
					damageRelations: data.damage_relations,
				})

				const pokemonList = data.pokemon.slice(0, 30).map(item => ({
					...item.pokemon,
					id: getPokemonId(item.pokemon.url),
				}))

				setPokemons(pokemonList)
				setLoading(false)
			} catch (err) {
				console.error('Error fetching type data:', err)
				setError(true)
				setLoading(false)
			}
		}

		fetchTypeData()
	}, [typeName])

	if (loading) return <Spinner />
	if (error) return <ErrorMessage />

	const typeColor = getTypeColor(typeName)

	return (
		<div className='pokemons-by-type'>
			<div className='type-header' style={{ backgroundColor: typeColor }}>
				<h1 className='type-title'>{formatPokemonName(typeName)} Type</h1>
				<p className='type-count'>{pokemons.length} Pokémon</p>
			</div>

			{typeInfo && (
				<div className='type-info'>
					<h3>Type Effectiveness</h3>
					<div className='damage-relations'>
						<div className='relation'>
							<h4>Strong Against:</h4>
							<div className='type-tags'>
								{typeInfo.damageRelations.double_damage_to?.map(type => (
									<span
										key={type.name}
										className='type-tag'
										style={{ backgroundColor: getTypeColor(type.name) }}
									>
										{type.name}
									</span>
								)) || <span>None</span>}
							</div>
						</div>
						<div className='relation'>
							<h4>Weak Against:</h4>
							<div className='type-tags'>
								{typeInfo.damageRelations.double_damage_from?.map(type => (
									<span
										key={type.name}
										className='type-tag'
										style={{ backgroundColor: getTypeColor(type.name) }}
									>
										{type.name}
									</span>
								)) || <span>None</span>}
							</div>
						</div>
					</div>
				</div>
			)}

			<div className='pokemon-grid'>
				{pokemons.map(pokemon => (
					<a
						key={pokemon.id}
						href={`https://www.pokemon.com/us/pokedex/${pokemon.name}`}
						target='_blank'
						rel='noopener noreferrer'
						className='pokemon-card'
					>
						<div className='pokemon-image'>
							<img
								src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
								alt={pokemon.name}
								loading='lazy'
							/>
						</div>
						<div className='pokemon-info'>
							<span className='pokemon-id'>#{pokemon.id}</span>
							<h3 className='pokemon-name'>
								{formatPokemonName(pokemon.name)}
							</h3>
						</div>
					</a>
				))}
			</div>

			<div className='navigation'>
				<Link to='/types' className='back-button'>
					← Back to All Types
				</Link>
				<a
					href={`https://pokemondb.net/type/${typeName}`}
					target='_blank'
					rel='noopener noreferrer'
					className='external-link'
				>
					More info about {typeName} type →
				</a>
			</div>
		</div>
	)
}

export default PokemonsByType
