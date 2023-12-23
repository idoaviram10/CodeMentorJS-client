import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AceEditor from 'react-ace';
import io from 'socket.io-client';

import Modal from './Modal.jsx'; // Import your modal component

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/theme-clouds_midnight';

const socket = io.connect('https://codementorjs-72116aa88715.herokuapp.com/');

export default function CodeBlockEditor() {
	const { codeBlockId } = useParams();
	const [code, setCode] = useState('');
	const [title, setTitle] = useState('');
	const [solution, setSolution] = useState('');
	const [isCorrect, setIsCorrect] = useState(false);
	const [userRole, setUserRole] = useState('Student');
	const [isSolutionModalOpen, setSolutionModalOpen] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchCode = async () => {
			try {
				const response = await fetch(`https://codementorjs-72116aa88715.herokuapp.com/getCode/${codeBlockId}`);
				if (!response.ok) {
					navigate('/not-found', { replace: true });
					return;
				}

				const data = await response.json();
				setCode(data.code);
				setTitle(data.title);
				setSolution(data.solution);
			} catch (error) {
				console.error('Fetch error:', error);
				navigate('/not-found', { replace: true });
			}
		};
		fetchCode();

		const handleCodeUpdate = (updatedCode) => setCode(updatedCode);
		const handleAssignRole = (role) => setUserRole(role);

		socket.emit('joinRoom', codeBlockId);
		socket.on('codeUpdated', handleCodeUpdate);
		socket.on('assignRole', handleAssignRole);

		return () => {
			socket.off('codeUpdated', handleCodeUpdate);
			socket.off('assignRole', handleAssignRole);
			socket.emit('leaveRoom', codeBlockId);
		};
	}, [codeBlockId, navigate]);

	const handleCodeChange = (newCode) => {
		if (userRole !== 'Mentor') {
			setCode(newCode);
			socket.emit('updateCode', { room: codeBlockId, code: newCode });
			setIsCorrect(newCode.trim() === solution.trim());
		}
	};

	const openSolutionModal = () => {
		setSolutionModalOpen(true);
	};

	if (!code) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<h1>{title}</h1>
			<h4>Logged in as a {userRole}</h4>
			<p>
				<Link to='..' relative='route'>
					Back to the lobby
				</Link>
			</p>
			{<p>{userRole === 'Mentor' && <button onClick={openSolutionModal}>See solution</button>}</p>}
			{isCorrect && (
				<div className='smiley-face'>
					<h1>😊</h1>
					<h2>Congratulations!</h2>
				</div>
			)}
			{!isCorrect && (
				<div className='editor-container'>
					<AceEditor
						mode='javascript'
						theme='dracula'
						value={code}
						readOnly={userRole === 'Mentor'}
						setOptions={{
							useWorker: false,
						}}
						onChange={handleCodeChange}
						name='UNIQUE_ID_OF_DIV'
						editorProps={{ $blockScrolling: true }}
						height='25rem'
						width='40rem'
						fontSize={14}
					/>
					<Modal isOpen={isSolutionModalOpen} onClose={() => setSolutionModalOpen(false)}>
						<AceEditor
							mode='javascript'
							theme='dracula'
							value={solution}
							readOnly={true}
							setOptions={{ useWorker: false }}
							name='solution-editor'
							editorProps={{ $blockScrolling: true }}
							height='15rem'
							fontSize={12}
						/>
					</Modal>
				</div>
			)}
		</>
	);
}
