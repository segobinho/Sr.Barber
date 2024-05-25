import React from "react";
import './style.css';

const Modal = ({ show, onClose, onSubmit, formData, onInputChange }) => {
    return (
        show && (
            <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={onClose}>&times;</span>
                    <h2>Adicionar Serviço</h2>
                    <input type="text" name="nome" placeholder="Nome" value={formData.nome} onChange={onInputChange} />
                    <input type="text" name="duracao" placeholder="Duração" value={formData.duracao} onChange={onInputChange} />
                    <input type="text" name="preco" placeholder="Preço" value={formData.preco} onChange={onInputChange} />
                    <button onClick={onSubmit}>Adicionar</button>
                </div>
            </div>
        )
    );
};

export default Modal;
