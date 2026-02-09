import { useHttp } from '../hooks/http.hook'

const usePokemonService = () => {
	const { loading, request, error, clearError } = useHttp()

	const _apiBase = 'https://pokeapi.co/api/v2/pokemon'

	const getAllPokemons = async (limit = 9, offset = 0) => {
		const allPokemons = await request(`${_apiBase}?limit=1025`)

		const shuffled = [...allPokemons.results].sort(() => Math.random() - 0.5)

		const selected = shuffled.slice(offset, offset + limit)

		return Promise.all(
			selected.map(async item => {
				const pokemon = await request(item.url)
				const species = await request(pokemon.species.url)

				const englishEntry = species.flavor_text_entries.find(
					e => e.language.name === 'en',
				)

				const description = englishEntry
					? englishEntry.flavor_text.replace(/\n/g, ' ').replace(/\f/g, ' ')
					: 'No description'

				return _transformCharacter(pokemon, description)
			}),
		)
	}

	const getPokemon = async id => {
		const pokemonData = await request(`${_apiBase}/${id}/`)
		const description = await getPokemonDescription(pokemonData.species.url)
		return _transformCharacter(pokemonData, description)
	}

	const getPokemonDescription = async speciesUrl => {
		const species = await request(speciesUrl)
		const englishEntry = species.flavor_text_entries.find(
			e => e.language.name === 'en',
		)

		return englishEntry
			? englishEntry.flavor_text.replace(/\n/g, ' ').replace(/\f/g, ' ')
			: 'No description'
	}

	const _transformCharacter = (res, description) => {
		const shortDescription =
			description.length > 200 ? description.slice(0, 197) + '...' : description
		return {
			id: res.id,
			name: res.name,
			description: shortDescription,
			images:
				res.sprites.other.dream_world.front_default ||
				res.sprites.other['official-artwork'].front_default ||
				res.sprites.front_default,
			stats: res.stats.map(stat => ({
				name: stat.stat.name.replace('-', ' '),
				value: stat.base_stat,
			})),
			types: res.types.map(t => t.type.name),
			homepage: null,
			wiki: null,
		}
	}

	return {
		loading,
		error,
		clearError,
		getPokemon,
		getAllPokemons,
	}
}

export default usePokemonService
