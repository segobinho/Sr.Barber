import React, { useState, useEffect,} from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import axios from 'axios';
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'; // Importar os estilos para o Drag and Drop
import 'moment/locale/pt-br'; // Importa o idioma português
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import './style.css';
import EventoPsadrao from './Eventos';
import EventModal from '../../components/EventModal';
import CustomToolbar from './CustomToolbar';
import Adicionar from '../../components/Adicionar/Adicionar';
import AdicionarEventoModal from '../../components/AdicionarEventoModal/AdicionarEventoModal';
import useGetData from '../../hooks/Alldata/Getdata';
import Header from '../../components/header';

moment.locale('pt-br'); // Define o idioma como português

const DragAndDropCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);
const messages = {
  next: "Próximo",
  previous: "Anterior",
  today: "Hoje",
  month: "Mês",
  week: "Semana",
  day: "Dia",
  agenda: "Agenda",
  date: "Data",
  time: "Hora",
  event: "Evento",
  allDay: "Dia todo",
  noEventsInRange: "Nenhum evento neste período.",
  showMore: total => `+ Ver mais (${total})`,
};

function Agenda() {
  
  const [eventos, setEventos] = useState([]);


  const [eventosSelected, setevetosSelected] = useState(null)
  const [resources, setResources] = useState([]); // Estado para armazenar barbeiros
  const [showAddEventModal, setShowAddEventModal] = useState(false); // Estado para controlar o modal
  const [selectedBarber, setSelectedBarber] = useState(null); // Estado para armazenar o barbeiro selecionado
  const [user, setUser] = useState([]);
  const [services, Setservices] =useState([])
  console.log("Estado resources atualizado:", resources);

  




  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
  
    
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8800/agendamentos');
        // tirar dps 
        console.log(response.data)  
        const data = response.data;

        const formattedEvents = data.map((event) => ({
          ...event,
          id: event.id_agendamento, // Mapeia 'id_agendamento' para 'id'
          start: moment(event.start, 'YYYY-MM-DD HH:mm:ss').toDate(),
          end: moment(event.end, 'YYYY-MM-DD HH:mm:ss').toDate(),
          resourceId: event.id_funcionario,
          
        }));

        setEventos(formattedEvents);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
   
  }, []); // Usa userRef.current como dependência
  


  const moverEventos = async (data) => {
    const { start, end } = data;
    const updatedEvents = eventos.map((event) => {
      if (event.id === data.event.id) {
        return {
          ...event,
          start: new Date(start), 
          end: new Date(end),
        };
      }
      return event;
    });
  
    // Atualiza o estado local
    setEventos(updatedEvents);
  
    // Atualiza o evento no banco de dados
    try {
      await axios.put(`http://localhost:8800/mover/${data.event.id}`, {
        start: moment(start).format('YYYY-MM-DD HH:mm:ss'),
        end: moment(end).format('YYYY-MM-DD HH:mm:ss'),

      });
      console.log(data.event.id);
      console.log(start);
      console.log(end);
    } catch (error) {
      console.error('Erro ao atualizar o evento no banco de dados:', error);
    }
  };
  

  const handleEventClick = (evento) => {
    setevetosSelected(evento);
    
  }

  const handleEventClose = () => {
    setevetosSelected(null)
  }

  const handleEventUpdate = async (updatedEvent) => {
    try {
      // Fazendo a requisição para atualizar o evento no banco de dados
      await axios.put(`http://localhost:8800/agendamentos/${updatedEvent.id}`, {
        title: updatedEvent.title,
        start: moment(updatedEvent.start).format('YYYY-MM-DD HH:mm:ss'),
        end: moment(updatedEvent.end).format('YYYY-MM-DD HH:mm:ss'),
        id_funcionario: updatedEvent.id_funcionario, // Atualizando o barbeiro selecionado
        id_cliente: updatedEvent.id_cliente,
        id_servico: updatedEvent.id_servico,
      });

      console.log('Erro ao receberr :', updatedEvent)
  
      // Atualizando o estado local com o evento modificado
      const updatedEvents = eventos.map((event) => {
        if (event.id === updatedEvent.id) {
          return updatedEvent; // Substitui o evento atualizado
        }
        return event;
      });
      setEventos(updatedEvents); // Atualiza o estado com os eventos modificados
      setevetosSelected(null);   // Fecha o modal após salvar as alterações
      toast.success('Evento editado com sucesso!');

    } catch (error) {
      console.error('Erro ao atualizar o evento no banco de dados:', error);
    }
  };
  
const handleEventDelete = (eventId) => {
  
    axios.delete(`http://localhost:8800/agendamentos/${eventId}`);
    setevetosSelected(null);

};


  const eventStyle = (event) => ({
    style: {
      backgroundColor: event.color,
    },
  });

  const handleBarberClick = (barberId) => {
    setSelectedBarber(barberId); // Armazena o barbeiro selecionado
    setShowAddEventModal(true);  // Exibe o modal
  };

  useEffect(() => {
    // Função para buscar os barbeiros da API
    const fetchBarbers = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        const { cargo, id_barbearia } = userData; // Obtenha o cargo e o id_barbearia
        console.log(userData)
  
        const response = await axios.get('http://localhost:8800/funcionarios', {
          params: {
            cargo: cargo,            // Enviar o cargo como parâmetro
            id_barbearia: id_barbearia // Enviar o id_barbearia como parâmetro
          },
        });
  
        console.log(response.data);  
  
        const barbersData = response.data.map(barber => ({
          id: barber.id_funcionario,
          title: barber.nome,
          img: `http://localhost:8800/fotos/${barber.imagens}` // Supondo que a imagem esteja neste campo
        }));
        setResources(barbersData); // Atualiza o estado com os dados dos barbeiros
      } catch (error) {
        console.error('Erro ao buscar barbeiros:', error);
      }
    };
  
    fetchBarbers(); // Chama a função ao montar o componente
  }, []);
  

  useEffect(() => {
    // Função para buscar os barbeiros da API
    const fetchse = async () => {
      try {
        const response = await axios.get('http://localhost:8800/se'); // Substitua pela sua URL da API
        console.log(response.data)  
        Setservices(response.data); // Define o estado com os dados da API

      } catch (error) {
        console.error('Erro ao buscar barbeiros:', error);
      }
    };

    fetchse(); // Chama a função ao montar o componente
  }, []);



  return (

    <div className='tela'>
      
<Header/>
<ToastContainer />
      <div className='calendario'>
        <DragAndDropCalendar
          defaultDate={moment().toDate()}
          defaultView='month'
          views={['month', 'day', 'agenda']}
          events={eventos}
          localizer={localizer}
          resizable
          onEventDrop={moverEventos}
          onEventResize={moverEventos}
          onSelectEvent={handleEventClick}
          eventPropGetter={eventStyle}
          messages={messages} // Aplicar as traduções
          resources={resources}
          resourceIdAccessor="id" // Especifica que o id é usado para vincular eventos
          resourceTitleAccessor="title" // Define o campo que exibe o nome do barbeiro
          components={{
            resourceHeader: ({ resource }) => (
              <div className='barber-header'>
                <img
                  src={resource.img}
                  alt={resource.title}
                  className='barber-img'
                  onClick={() => handleBarberClick(resource.id)}
                />
                <span>{resource.title}</span>
              </div>
            ),
          }}
          className='Agenda'
        />
      </div>
      {eventosSelected && (
        <EventModal
          evento={eventosSelected}
          onClose={handleEventClose}
          onDelete={handleEventDelete}
          onUpdate={handleEventUpdate}
          barbeiros={resources}
          servicos={services}
        />
      )}
      {showAddEventModal && (
        <AdicionarEventoModal
          barberId={selectedBarber} // Passa o barbeiro selecionado para o modal
          onClose={() => setShowAddEventModal(false)}
          setEventos={setEventos} // Passa a função para atualizar eventos
          eventos={eventos} // Passa os eventos atuais
        />
      )}
    </div>
  );
}


export default Agenda