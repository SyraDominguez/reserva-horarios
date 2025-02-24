let reservas = [];

async function cargarReservas() {
  const response = await fetch('/api/reservas');
  const data = await response.json();
  console.log('Reservas obtenidas:', data);
  reservas = Array.isArray(data) ? data : [];
}

async function guardarReserva(nuevaReserva) {
  await fetch('/api/saveReserva', {
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

    const title = document.createElement('h2');
    title.textContent = dia;
    title.onclick = () => toggleDisplay(dia);
    container.appendChild(title);

    const form = document.createElement('form');
    form.className = 'calendar hidden';
    form.id = dia;

    const tramosContainer = document.createElement('div');
    tramosContainer.className = 'tramos-container';

    tramos.forEach(({ start, end }) => {
      const reservaExistente = Array.isArray(reservas) ? reservas.find(res => res.dia === dia && res.horario === start) : null;
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

      tramosContainer.appendChild(button);
    });

    form.appendChild(tramosContainer);

    const inputContainer = document.createElement('div');
    inputContainer.className = 'input-container';

    const inputNombre = document.createElement('input');
    inputNombre.type = 'text';
    inputNombre.name = 'nombre';
    inputNombre.placeholder = 'Nombre y Apellido';
    inputNombre.required = true;
    inputNombre.className = 'input-nombre';

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Confirmar Reserva';
    submitButton.className = 'submit-button';

    inputContainer.appendChild(inputNombre);
    inputContainer.appendChild(submitButton);

    form.appendChild(inputContainer);

    form.onsubmit = async function (event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const nombre = formData.get('nombre');
      const horario = form.dataset.horarioSeleccionado;

      if (!horario) {
        mostrarPopup('Selecciona un horario.');
        return;
      }

      const nuevaReserva = { dia, horario, nombre };
      reservas.push(nuevaReserva);
      await guardarReserva(nuevaReserva);
      mostrarPopup('Reserva realizada con éxito.');
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

  const reservasPorDia = {};
  reservas.forEach(reserva => {
    if (!reservasPorDia[reserva.dia]) {
      reservasPorDia[reserva.dia] = [];
    }
    reservasPorDia[reserva.dia].push(reserva);
  });

  Object.keys(diasDisponibles).forEach(dia => {
    if (reservasPorDia[dia]) {
      const reservasDia = reservasPorDia[dia];
      reservasDia.sort((a, b) => a.horario.localeCompare(b.horario));

      const diaContainer = document.createElement('div');
      diaContainer.className = 'reservas-dia-container';

      const diaTitle = document.createElement('h3');
      diaTitle.textContent = dia;
      diaContainer.appendChild(diaTitle);

      const ul = document.createElement('ul');
      reservasDia.forEach(reserva => {
        const li = document.createElement('li');
        li.textContent = `${reserva.horario}: ${reserva.nombre}`;
        ul.appendChild(li);
      });

      diaContainer.appendChild(ul);
      list.appendChild(diaContainer);
    }
  });
}

function toggleDisplay(id) {
  const allForms = document.querySelectorAll('.calendar');
  allForms.forEach(form => {
    if (form.id === id) {
      form.classList.toggle('active');
    } else {
      form.classList.remove('active');
    }
  });
}

function mostrarPopup(mensaje) {
  const overlay = document.getElementById('popup-overlay');
  const message = document.getElementById('popup-message');
  message.textContent = mensaje;
  overlay.classList.add('active');
}

function cerrarPopup() {
  const overlay = document.getElementById('popup-overlay');
  overlay.classList.remove('active');
}

renderForm();
