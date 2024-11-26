import React, { useEffect, useState } from 'react';
import './style.css'; // Import the CSS file for styling

const EventModal = ({ evento, onClose, onDelete, onUpdate, barbeiros, servicos }) => {
  const [editedEvent, setEditedEvent] = useState({ ...evento });
  const [collapsed, setCollapsed] = useState(true);
  const [barbeiroSelecionado, setBarbeiroSelecionado] = useState(evento.id_funcionario || '');
  const [servicosSelecionados, setServicosSelecionados] = useState(
    evento.id_servicos ? evento.id_servicos.split(',') : []
  );
  const isReadOnly = evento.status === 'finalizado';

  useEffect(() => {
    setEditedEvent((prevState) => ({
      ...prevState,
      id_funcionario: barbeiroSelecionado,
      id_servicos: servicosSelecionados,
    }));
  }, [barbeiroSelecionado, servicosSelecionados]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent({ ...editedEvent, [name]: value });
  };

  const handleServicoChange = (e) => {
    const { value, checked } = e.target;
    setServicosSelecionados((prev) =>
      checked ? [...prev, value] : prev.filter((id) => id !== value)
    );
  };

  const handleStartDateChange = (e) => {
    const startDate = new Date(e.target.value);
    if (startDate <= editedEvent.end) {
      setEditedEvent({ ...editedEvent, start: startDate });
    }
  };

  const handleEndDateChange = (e) => {
    const endDate = new Date(e.target.value);
    if (endDate >= editedEvent.start) {
      setEditedEvent({ ...editedEvent, end: endDate });
    }
  };

  const handleDelete = () => {
    onDelete(evento.id);
  };

  const handleUpdate = () => {
    const updatedEvent = {
      ...editedEvent,
      id_funcionario: barbeiroSelecionado,
      id_servicos: servicosSelecionados.join(','), // Converting array back to string
    };
    onUpdate(updatedEvent);
    onClose();
  };

  const adjustDate = (date) => {
    const adjustedDate = new Date(date);
    adjustedDate.setHours(adjustedDate.getHours() - 3);
    return adjustedDate.toISOString().slice(0, -8);
  };

  return (
    <div className='modal'>
      <div className='modal-content'>
        <div className='modal-header'>
          <h2>{editedEvent.title}</h2>
          <button className='close-btn' onClick={onClose}>X</button>
        </div>
        <div className='modal-body'>
          <form>
            <div className='form-group'>
              <label>Título</label>
              <input type='text' name='title' value={editedEvent.title} onChange={handleInputChange} readOnly={isReadOnly} />
            </div>
            <div className='form-group'>
              <label>Barbeiro:</label>
              <select
                value={barbeiroSelecionado}
                onChange={(e) => setBarbeiroSelecionado(e.target.value)}
                required
                disabled={isReadOnly}
              >
                <option value="">Selecione um barbeiro</option>
                {barbeiros.map((barbeiro) => (
                  <option key={barbeiro.id} value={barbeiro.id}>
                    {barbeiro.title}
                  </option>
                ))}
              </select>
            </div>
            <div className='form-group'>
              <label>Serviços:</label>
              <div className='servicos-list' style={{ maxHeight: '150px', overflowY: 'auto', overflowX: 'hidden' }}>
                {servicos.map((servico) => (
                  <div key={servico.id_servico}>
                    <input
                      type="checkbox"
                      value={servico.id_servico}
                      onChange={handleServicoChange}
                      checked={servicosSelecionados.includes(servico.id_servico.toString())}
                      disabled={isReadOnly}
                    />
                    <label>{servico.nome}</label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className='form-group'>
                <label>Início</label>
                <input type='datetime-local' name='start' value={adjustDate(editedEvent.start)} onChange={handleStartDateChange} readOnly={isReadOnly} />
              </div>
              <div className='form-group'>
                <label>Fim</label>
                <input type='datetime-local' name='end' value={adjustDate(editedEvent.end)} onChange={handleEndDateChange} readOnly={isReadOnly} />
              </div>
            </div>
          </form>
        </div>
        {!isReadOnly && (
          <div className='modal-footer'>
            
            <button className='delete-btn' onClick={handleDelete}>Apagar</button>
            <button className='save-btn' onClick={handleUpdate}>Salvar Alterações</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventModal;
