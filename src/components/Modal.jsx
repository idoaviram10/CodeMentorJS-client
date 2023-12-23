import React from 'react';

export default function Modal({ isOpen, onClose, children }) {
	if (!isOpen) return null;

	return (
		<div className='modal-overlay'>
			<div className='modal-content'>
				{children}
				<button className='close-button' onClick={onClose}>
					Close
				</button>
			</div>
		</div>
	);
}
