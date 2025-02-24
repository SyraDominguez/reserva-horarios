let reservas = [];

async function cargarReservas() {
  const response = await fetch('/api/reservas');
  const data = await response.json();
  reservas = data;
}

async function guardarReserva(nuevaReserva) {
  await fetch('/api/reservas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevaReserva),
  });
}

const diasDisponibles = {
  'Jueves 27 de febrero': createTimeSlots(8, 12).concat(createTimeSlots(13, 16)),
  'Viernes 28 de febrero': createTimeSlots(8, 15),
  'Lunes 3 de marzo': createTimeSlots(8, 16),
};

function createTimeSlots(startHour, endHour) {
  const slots = [];
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += 15) {
      const endMinute = (m + 15) % 60;
      const endHour = endMinute === 0 ? h + 1 : h;
      slots.push({ start: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`, end: `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}` });
    }
  }
  return slots;
}

async function renderForm() {
  await cargarReservas();
  const app = document.getElementById('app');
  app.innerHTML = '';

  for (const [dia, tramos] of Object.entries(diasDisponibles)) {
    const container = document.createElement('div');
    container.className = 'day-container';
    container.innerHTML = `<h2>${dia}</h2>`;

    const form = document.createElement('form');
    form.className = 'calendar';
    form.id = dia;

    tramos.forEach(({ start, end }) => {
      const reservaExistente = reservas.find(res => res.dia === dia && res.horario === start);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'time-slot';
      button.dataset.horario = start;

      if (reservaExistente) {
        button.textContent = `${start} - ${end}: Reservado`;
        button.disabled = true;
      } else {
        button.textContent = `${start} - ${end}`;
        button.onclick = () => elegirHorario(dia, start);
      }

      form.appendChild(button);
    });

    const inputNombre = document.createElement('input');
    inputNombre.type = 'text';
    inputNombre.name = 'nombre';
    inputNombre.placeholder = 'Nombre';
    inputNombre.required = true;
    inputNombre.className = 'input-nombre';

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Confirmar Reserva';
    submitButton.className = 'submit-button';

    form.appendChild(inputNombre);
    form.appendChild(submitButton);

    form.onsubmit = async function (event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const nombre = formData.get('nombre');
      const horario = form.dataset.horarioSeleccionado;

      if (!horario) {
        alert('Selecciona un horario.');
        return;
      }

      const nuevaReserva = { dia, horario, nombre };
      reservas.push(nuevaReserva);
      await guardarReserva(nuevaReserva);
      alert('Reserva realizada con éxito.');
      renderForm();
    };

    container.appendChild(form);
    app.appendChild(container);
  }
  renderReservas();
}

function elegirHorario(dia, horario) {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => form.dataset.horarioSeleccionado = '');
  const form = document.getElementById(dia);
  form.dataset.horarioSeleccionado = horario;
  const botones = form.querySelectorAll('.time-slot');
  botones.forEach(btn => btn.classList.remove('selected'));
  const botonSeleccionado = form.querySelector(`button[data-horario="${horario}"]`);
  botonSeleccionado.classList.add('selected');
}

function renderReservas() {
  const list = document.getElementById('reservas-list');
  list.innerHTML = '';
  reservas.forEach(reserva => {
    const li = document.createElement('li');
    li.textContent = `${reserva.dia} ${reserva.horario}: ${reserva.nombre}`;
    list.appendChild(li);
  });
}

function toggleDisplay(id) {
  const element = document.getElementById(id);
  if (element.className === 'hidden') {
    element.className = '';
  } else {
    element.className = 'hidden';
  }
}

renderForm();

/* CSS */
const style = document.createElement('style');
style.innerHTML = `...`;
document.head.appendChild(style);
