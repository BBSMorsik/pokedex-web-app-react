import { useState, useCallback } from 'react'
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik'
import * as Yup from 'yup'
import debounce from 'lodash.debounce'

import './charSearchForm.scss'

const CharSearchForm = () => {
	const [pokemonName, setPokemonName] = useState('')
	const [loading, setLoading] = useState(false)
	const [pokemonExists, setPokemonExists] = useState(null)
	const [searchError, setSearchError] = useState('')

	const checkPokemonDebounced = useCallback(
		debounce(async name => {
			if (!name || name.length < 2) return

			const cleanName = name.trim().toLowerCase()
			setLoading(true)
			setSearchError('')

			try {
				const response = await fetch(
					`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(cleanName)}`,
				)

				if (response.ok) {
					setPokemonExists(true)
					setPokemonName(cleanName)
				} else if (response.status === 404) {
					setPokemonExists(false)
					setPokemonName(cleanName)
				} else {
					setSearchError(`API error: ${response.status}`)
					setPokemonExists(null)
				}
			} catch (error) {
				setSearchError('Network error. Please try again.')
				setPokemonExists(null)
				console.error('Error:', error)
			} finally {
				setLoading(false)
			}
		}, 500),
		[],
	)

	const handleSubmit = values => {
		checkPokemonDebounced(values.charName)
	}

	const handleInputChange = e => {
		const value = e.target.value
		if (value) {
			checkPokemonDebounced(value)
		} else {
			setPokemonExists(null)
			setPokemonName('')
			setSearchError('')
		}
	}

	const results = pokemonName && pokemonExists !== null && (
		<div className='char__search-wrapper'>
			{searchError ? (
				<div className='char__search-error'>{searchError}</div>
			) : pokemonExists ? (
				<>
					<div className='char__search-success'>
						✓ Pokemon "{pokemonName}" found!
					</div>
					<a
						href={`https://www.pokemon.com/us/pokedex/${pokemonName}`}
						target='_blank'
						rel='noopener noreferrer'
						className='button button__secondary'
					>
						<div className='inner'>Open in Pokedex</div>
					</a>
				</>
			) : (
				<div className='char__search-error'>
					✗ Pokemon "{pokemonName}" not found
				</div>
			)}
		</div>
	)

	return (
		<div className='char__search-form'>
			<Formik
				initialValues={{
					charName: '',
				}}
				validationSchema={Yup.object({
					charName: Yup.string()
						.required('Enter pokemon name')
						.matches(
							/^[a-zA-Z0-9\-\s]*$/,
							'Only Latin letters, numbers and hyphens',
						)
						.min(2, 'Minimum 2 characters'),
				})}
				onSubmit={handleSubmit}
			>
				{({ values, handleChange }) => (
					<Form>
						<label className='char__search-label' htmlFor='charName'>
							Search Pokemon:
						</label>
						<div className='char__search-wrapper'>
							<Field
								id='charName'
								name='charName'
								type='text'
								placeholder='Enter pokemon name (pikachu etc.)'
								disabled={loading}
								onChange={e => {
									handleChange(e)
									handleInputChange(e)
								}}
							/>
							<button
								type='submit'
								className='button button__main'
								disabled={loading || !values.charName.trim()}
							>
								<div className='inner'>{loading ? '...' : 'Search'}</div>
							</button>
						</div>
						<FormikErrorMessage
							component='div'
							className='char__search-error'
							name='charName'
						/>
					</Form>
				)}
			</Formik>
			{results}

			{loading && (
				<div className='char__search-loading'>Checking pokemon...</div>
			)}
		</div>
	)
}

export default CharSearchForm
