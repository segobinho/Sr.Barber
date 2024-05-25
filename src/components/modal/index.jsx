// Modal.js
import React from "react";

function Modal({ show, onClose, onSubmit, newService, handleInputChange }) {
    if (!show) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Novo Serviço</h2>
                <form onSubmit={onSubmit}>
                    <div>
                        <label>Nome:</label>
                        <input 
                            type="text" 
                            name="nome" 
                            value={newService.nome} 
                            onChange={handleInputChange} 
                        />
                    </div>
                    <div>
                        <label>Duração:</label>
                        <input 
                            type="text" 
                            name="duracao" 
                            value={newService.duracao} 
                            onChange={handleInputChange} 
                        />
                    </div>
                    <div>
                        <label>Preço:</label>
                        <input 
                            type="text" 
                            name="preco" 
                            value={newService.preco} 
                            onChange={handleInputChange} 
                        />
                    </div>
                    <button type="submit">Criar Serviço</button>
                </form>
            </div>
        </div>
    );
}

export default Modal;
