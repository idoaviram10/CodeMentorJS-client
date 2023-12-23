import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Root from './components/Root.jsx';
import Lobby from './components/Lobby.jsx';
import CodeBlockEditor from './components/CodeBlockEditor.jsx';
import NotFound from './components/NotFound.jsx';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Root />,
		errorElement: <NotFound />,
		children: [
			{ path: '', element: <Lobby /> },
			{ path: 'editor/:codeBlockId', element: <CodeBlockEditor /> },
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
