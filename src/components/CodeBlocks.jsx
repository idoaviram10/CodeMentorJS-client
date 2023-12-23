import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CodeBlocks() {
	const [codes, setCodes] = useState([]);

	useEffect(() => {
		const getCodes = async () => {
			try {
				const response = await fetch('https://codementorjs-72116aa88715.herokuapp.com/getCodes');
				if (!response.ok) {
					return;
				}

				const data = await response.json();
				setCodes(data);
			} catch (error) {
				console.error('Fetch error:', error);
			}
		};
		getCodes();
	}, []);

	return (
		<ul className='code-blocks'>
			{codes.map((code) => (
				<li className='code-block' key={code.id}>
					<Link to={`editor/${code.id}`}>{code.title}</Link>
				</li>
			))}
		</ul>
	);
}
