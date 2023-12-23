import { Link } from 'react-router-dom';

export default function NotFound() {
	return (
		<main>
			<h1>An error occurred!</h1>
			<p>Could not find this page!</p>
			<Link to='..' relative='route'>
				Back to the lobby
			</Link>
		</main>
	);
}
