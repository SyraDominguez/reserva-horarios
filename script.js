const diasDisponibles = {
  'Jueves 27 de febrero': createTimeSlots(8, 12).concat(createTimeSlots(13, 16)),
  'Viernes 28 de febrero': createTimeSlots(8, 15),
  'Lunes 3 de marzo': createTimeSlots(8, 16)
};

const reservas = JSON.parse(localStorage.getItem('reservas')) || [];

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

function renderForm() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  for (const [dia, tramos] of Object.entries(diasDisponibles)) {
    const container = document.createElement('div');
    container.innerHTML = `<h2 onclick="toggleDisplay('${dia}')">${dia}</h2>`;

    const form = document.createElement('form');
    form.className = 'hidden';
    form.id = dia;

    tramos.forEach(({ start, end }) => {
      const reservaExistente = reservas.find(res => res.dia === dia && res.horario === start);
      const p = document.createElement('p');

      if (reservaExistente) {
        p.innerHTML = `${start} - ${end}: Reservado por ${reservaExistente.nombre}`;
      } else {
        p.innerHTML = `<input type="radio" name="horario" value="${start}">${start} - ${end}`;
      }
      form.appendChild(p);
    });

    const inputNombre = document.createElement('input');
    inputNombre.type = 'text';
    inputNombre.name = 'nombre';
    inputNombre.placeholder = 'Nombre';
    inputNombre.required = true;

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Reservar';

    form.appendChild(inputNombre);
    form.appendChild(submitButton);

    form.onsubmit = function (event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const dia = event.target.id;
      const horario = formData.get('horario');
      const nombre = formData.get('nombre');

      if (!horario) {
        alert('Selecciona un horario.');
        return;
      }

      reservas.push({ dia, horario, nombre });
      localStorage.setItem('reservas', JSON.stringify(reservas));
      alert('Reserva realizada con éxito.');
      renderForm();
    };

    container.appendChild(form);
    app.appendChild(container);
  }
  renderReservas();
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
