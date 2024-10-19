import React, { useEffect, useState } from 'react';
import './style.css'; // Import the CSS file for styling

const EventModal = ({ evento, onClose, onDelete, onUpdate, barbeiros, servicos}) => {
  const [editedEvent, setEditedEvent] = useState({ ...evento });
  const [collapsed, setCollapsed] = useState(true);
  const [barbeiroSelecionado, setBarbeiroSelecionado] = useState(evento.id_funcionario || ''); // Inicializa com o barbeiro do evento
  const [servicoSelecionado, setservicoSelecionado] = useState(evento.id_servico || ''); // Inicializa com o barbeiro do evento


  console.log('Barbeiros:', barbeiros);
  console.log('Evento:', evento);
  console.log('editado:', editedEvent);
  console.log('receba', barbeiroSelecionado);
  

  useEffect(() => {
    setEditedEvent((prevState) => ({
      ...prevState,
      id_funcionario: barbeiroSelecionado, // Atualiza id_funcionario no evento editado
    }));
  }, [barbeiroSelecionado]); // Executa o efeito quando barbeiroSelecionado mudar

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent({ ...editedEvent, [name]: value });
  };

  const handleColorChange = (e) => {
    setEditedEvent({ ...editedEvent, color: e.target.value });
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
      id_servico: servicoSelecionado,// Adiciona o barbeiro selecionado ao evento
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
              <input type='text' name='title' value={editedEvent.title} onChange={handleInputChange} />
            </div>
            <div className='form-group'>
              <label>Descrição</label>
              <textarea name='desc' rows={3} value={editedEvent.desc} onChange={handleInputChange}></textarea>
            </div>
             <div className='form-group'>
              <label>Barbeiro:</label>
              <select
                value={barbeiroSelecionado}
                onChange={(e) => setBarbeiroSelecionado(e.target.value)}
                required
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
              <label>Serviço:</label>
              <select
                value={servicoSelecionado}
                onChange={(e) => setservicoSelecionado(e.target.value)}
                required
              >
                <option value="">Selecione um serviço</option>
                {servicos.map((servico) => (
                  <option key={servico.id_servico} value={servico.id_servico}>
                    {servico.nome}
                  </option>
                ))}
              </select>
            </div>
            {!collapsed && (
              <div>
                <div className='form-group'>
                  <label>Início</label>
                  <input type='datetime-local' name='start' value={adjustDate(editedEvent.start)} onChange={handleStartDateChange} />
                </div>
                <div className='form-group'>
                  <label>Fim</label>
                  <input type='datetime-local' name='end' value={adjustDate(editedEvent.end)} onChange={handleEndDateChange} />
                </div>
                <div className='form-group'>
                  <label>Cor</label>
                  <input type='color' name='color' value={editedEvent.color} onChange={handleColorChange} />
                </div>
              </div>
            )}
          </form>
        </div>
        <div className='modal-footer'>
          <button className='toggle-btn' onClick={() => setCollapsed(!collapsed)}>
            {!collapsed ? 'Ocultar Detalhes' : 'Mostrar Detalhes'}
          </button>
          <button className='delete-btn' onClick={handleDelete}>Apagar</button>
          <button className='save-btn' onClick={handleUpdate}>Salvar Alterações</button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
