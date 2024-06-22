import React from "react";
import "./style.css";

const Modal = ({ show, onClose, onSubmit, formData, onInputChange, barbearias, hideBarbeariaField }) => {
    if (!show) {
        return null;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>
                    &times;
                </span>
                <h2>Adicionar Serviço</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nome:</label>
                        <input
                            type="text"
                            name="nome"
                            value={formData.nome}
                            onChange={onInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Duração:</label>
                        <input
                            type="text"
                            name="duracao"
                            value={formData.duracao}
                            onChange={onInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Preço:</label>
                        <input
                            type="text"
                            name="preco"
                            value={formData.preco}
                            onChange={onInputChange}
                            required
                        />
                    </div>
                    {!hideBarbeariaField && (
                        <div className="form-group">
                            <label>Barbearia:</label>
                            <select
                                name="id_barbearia"
                                value={formData.id_barbearia}
                                onChange={onInputChange}
                                required
                            >
                                <option value="">Selecione uma barbearia</option>
                                {barbearias.map((barbearia) => (
                                    <option key={barbearia.id_barbearia} value={barbearia.id_barbearia}>
                                        {barbearia.nome}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <button type="submit">Adicionar</button>
                </form>
            </div>
        </div>
    );
};

export default Modal;
