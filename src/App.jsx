import debounce from "just-debounce-it";
import { useCallback, useRef, useState } from "react";
import "./App.css";
import { Movies } from "./components/Movies";
import { useMovies } from "./hooks/useMovies";
import { useSearch } from "./hooks/useSearch";

function App() {
	const [sort, setSort] = useState(false);
	const { query, setQuery, error } = useSearch();
	const { movies, getMovies, loading } = useMovies({ query, sort });
	const inputRef = useRef();

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debounceGetMovies = useCallback(
		debounce((query) => {
			getMovies({ query });
		}, 300),
		[getMovies]
	);

	const handleSubmit = (e) => {
		e.preventDefault();
		getMovies({ query });
	};
	const handleChange = (event) => {
		const newSearch = event.target.value;
		setQuery(newSearch);
		debounceGetMovies(newSearch);
	};

	const handleSort = () => {
		setSort(!sort);
	};

	return (
		<div className="page">
			<header>
				<h1>Movie Searcher</h1>
				<form className="form" onSubmit={handleSubmit}>
					<input
						name="query"
						ref={inputRef}
						value={query}
						onChange={handleChange}
						placeholder="Avengers, Star Wars, The Matrix..."
					/>
					<input type="checkbox" onChange={handleSort} checked={sort} />
					<button type="submit">Search</button>
				</form>
				{error && <p style={{ color: "red" }}>{error}</p>}
			</header>
			<main>{loading ? <p>Cargando...</p> : <Movies movies={movies} />}</main>
		</div>
	);
}

export default App;
