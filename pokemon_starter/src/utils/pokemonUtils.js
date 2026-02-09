export const getPokemonId = url => {
	if (!url) return ''
	const parts = url.split('/').filter(part => part !== '')
	return parts[parts.length - 1] || ''
}

export const formatPokemonName = name => {
	if (!name) return ''
	return name.charAt(0).toUpperCase() + name.slice(1)
}

export const getTypeColor = typeName => {
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
	return typeColors[typeName] || '#777777'
}

export const getPokemonImage = (id, variant = 'default') => {
	const baseUrl =
		'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'

	const variants = {
		default: `${baseUrl}/${id}.png`,
		shiny: `${baseUrl}/shiny/${id}.png`,
		artwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
	}

	return variants[variant] || variants.default
}
