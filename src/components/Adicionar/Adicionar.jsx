import React, { useState } from 'react';
import './style.css'; // Importando o arquivo CSS

function Adicionar({ onAdicionar }) {
    const [novoEvento, setNovoEvento] = useState({
        title: '',
        start: '',
        end: '',
        desc: '',
        color: '',
        tipo: '',
    });
    const [expanded, setExpanded] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNovoEvento({ ...novoEvento, [name]: value });
    };

    const handleToggleExpanded = (e) => {
        e.stopPropagation();
        setExpanded(!expanded);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (novoEvento.title && novoEvento.start && novoEvento.end) {
            const startDate = new Date(novoEvento.start);
            const endDate = new Date(novoEvento.end);

            if (startDate >= endDate) {
                alert('A data início deve ser anterior à data de término');
                return;
            }
            onAdicionar(novoEvento);
            setNovoEvento({
                title: '', 
                start: '',
                end: '',
                desc: '',
                color: '',
                tipo: '',
            });
        }
    };

    return (
        <div className="adicionar">
            <h3>Adicionar Evento</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Título do Evento</label>
                    <input
                        type="text"
                        placeholder="Digite o Título"
                        name="title"
                        value={novoEvento.title}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label>Início</label>
                            <input
                                type="datetime-local"
                                name="start"
                                value={novoEvento.start}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label>Término</label>
                            <input
                                type="datetime-local"
                                name="end"
                                value={novoEvento.end}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                    </div>
                </div>
                {expanded && (
                    <div>
                        <div className="form-group">
                            <label>Descrição</label>
                            <input
                                type="text"
                                placeholder="Digite a Descrição"
                                name="desc"
                                value={novoEvento.desc}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                        <div className="row">
                            <div className="col-3">
                                <div className="form-group">
                                    <label>Cor</label>
                                    <input
                                        type="color"
                                        name="color"
                                        value={novoEvento.color}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="col-9">
                                <div className="form-group">
                                    <label>Tipo</label>
                                    <input
                                        type="text"
                                        placeholder="Digite o Tipo"
                                        name="tipo"
                                        value={novoEvento.tipo}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <button
                    type="button"
                    onClick={handleToggleExpanded}
                    className="expand-btn"
                >
                    {expanded ? '▲' : '▼'}
                </button>
                <button
                    type="submit"
                    className="save-btn"
                    disabled={!novoEvento.title || !novoEvento.start || !novoEvento.end}
                >
                    Salvar
                </button>
            </form>
        </div>
    );
}

export default Adicionar;
