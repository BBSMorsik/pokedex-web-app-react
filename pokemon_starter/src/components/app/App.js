import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import AppHeader from '../appHeader/AppHeader'
import ErrorBoundary from '../errorBoundary/ErrorBoundary'
import Spinner from '../spinner/Spinner'

const HomePage = lazy(() => import('../pages/HomePage'))
const Types = lazy(() => import('../pokemonTypes/Types'))
const PokemonsByType = lazy(() => import('../pokemonsByType/PokemonsByType'))

const App = () => {
	return (
		<Router>
			<div className='app'>
				<AppHeader />
				<main>
					<Suspense fallback={<Spinner />}>
						<Routes>
							<Route
								path='/'
								element={
									<ErrorBoundary>
										<HomePage />
									</ErrorBoundary>
								}
							/>

							<Route
								path='/types'
								element={
									<ErrorBoundary>
										<Types />
									</ErrorBoundary>
								}
							/>

							<Route
								path='/type/:typeName'
								element={
									<ErrorBoundary>
										<PokemonsByType />
									</ErrorBoundary>
								}
							/>

							<Route
								path='*'
								element={
									<div style={{ textAlign: 'center', padding: '50px' }}>
										<h1 style={{ marginTop: '80px' }}>404 - Page Not Found</h1>
										<p>The page you are looking for doesn't exist.</p>
									</div>
								}
							/>
						</Routes>
					</Suspense>
				</main>
			</div>
		</Router>
	)
}

export default App
