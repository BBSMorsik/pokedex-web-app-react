import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './types.scss'
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage'

const Types = () => {
	const [types, setTypes] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)

	useEffect(() => {
		fetch('https://pokeapi.co/api/v2/type')
			.then(res => {
				if (!res.ok) throw new Error('Failed to fetch types')
				return res.json()
			})
			.then(data => {
				const mainTypes = data.results.filter(
					type => !['shadow', 'unknown'].includes(type.name),
				)
				setTypes(mainTypes.slice(0, 18))
				setLoading(false)
			})
			.catch(() => {
				setError(true)
				setLoading(false)
			})
	}, [])

	const typeColors = {
		normal: '#A8A878',
		fire: '#F08030',
		water: '#6890F0',
		grass: '#78C850',
		electric: '#F8D030',
		ice: '#98D8D8',
		fighting: '#C03028',
		poison: '#A040A0',
		ground: '#E0C068',
		flying: '#A890F0',
		psychic: '#F85888',
		bug: '#A8B820',
		rock: '#B8A038',
		ghost: '#705898',
		dark: '#705848',
		dragon: '#7038F8',
		steel: '#B8B8D0',
		fairy: '#EE99AC',
	}

	const typeIcons = {
		normal: '⚪',
		fire: '🔥',
		water: '💧',
		grass: '🌿',
		electric: '⚡',
		ice: '❄️',
		fighting: '🥊',
		poison: '☠️',
		ground: '⛰️',
		flying: '🕊️',
		psychic: '🔮',
		bug: '🐛',
		rock: '🪨',
		ghost: '👻',
		dark: '🌑',
		dragon: '🐉',
		steel: '⚙️',
		fairy: '✨',
	}

	if (loading) return <Spinner />
	if (error) return <ErrorMessage />

	return (
		<div className='types-page'>
			<h1 className='types-title'>Pokémon Types</h1>
			<p className='types-subtitle'>
				Click on a type to see all Pokémon of that type
			</p>

			<div className='types-grid'>
				{types.map((type, index) => (
					<Link
						key={type.name}
						to={`/type/${type.name}`}
						className='type-card'
						style={{
							backgroundColor: typeColors[type.name] || '#777',
							animationDelay: `${index * 0.05}s`,
						}}
					>
						<div className='type-icon'>{typeIcons[type.name] || '❓'}</div>
						<h3 className='type-name'>{type.name.toUpperCase()}</h3>
						<div className='type-arrow'>→</div>
					</Link>
				))}
			</div>

			<div className='types-info'>
				<p>There are 18 Pokémon types, each with strengths and weaknesses.</p>
				<p>Choose a type to explore its Pokémon!</p>
			</div>
		</div>
	)
}

export default Types
