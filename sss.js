document.getElementById('findHotel').addEventListener('click', encontrarHotelMasBarato);

function encontrarHotelMasBarato() {
    const tipoCliente = document.getElementById('customerType').value;
    const fechas = document.getElementById('dates').value.split(',').map(fecha => fecha.trim());

    const hoteles = [
        {
            nombre: 'Lakewood',
            calificacion: 3,
            entreSemana: { Regular: 110, Recompensas: 80 },
            finDeSemana: { Regular: 90, Recompensas: 80 }
        },
        {
            nombre: 'Bridgewood',
            calificacion: 4,
            entreSemana: { Regular: 160, Recompensas: 110 },
            finDeSemana: { Regular: 60, Recompensas: 50 }
        },
        {
            nombre: 'Ridgewood',
            calificacion: 5,
            entreSemana: { Regular: 220, Recompensas: 100 },
            finDeSemana: { Regular: 150, Recompensas: 40 }
        }
    ];

    let hotelMasBarato = null;
    let costoMinimo = Infinity;
    let mostrarPrecioEntreSemana = false;
    let mostrarPrecioFinDeSemana = false;

    hoteles.forEach(hotel => {
        let costoTotal = 0;
        let mostrarPrecioActualEntreSemana = false;
        let mostrarPrecioActualFinDeSemana = false;

        fechas.forEach(fecha => {
            const diaDeLaSemana = new Date(fecha.slice(0, 11)).getDay();
            const esFinDeSemana = (diaDeLaSemana === 6 || diaDeLaSemana === 0);
            costoTotal += esFinDeSemana ? hotel.finDeSemana[tipoCliente] : hotel.entreSemana[tipoCliente];
            if (esFinDeSemana) {
                mostrarPrecioActualFinDeSemana = true;
            } else {
                mostrarPrecioActualEntreSemana = true;
            }
        });

        if (costoTotal < costoMinimo || (costoTotal === costoMinimo && hotel.calificacion > (hotelMasBarato ? hotelMasBarato.calificacion : 0))) {
            costoMinimo = costoTotal;
            hotelMasBarato = hotel;
            mostrarPrecioEntreSemana = mostrarPrecioActualEntreSemana;
            mostrarPrecioFinDeSemana = mostrarPrecioActualFinDeSemana;
        }
    });

    document.querySelectorAll('.hotel-card').forEach(tarjeta => {
        tarjeta.classList.remove('show');
        tarjeta.querySelector('p:last-child').textContent = '';
    });

    const resultadoDiv = document.getElementById('result');
    if (hotelMasBarato) {
        const estrellas = '⭐'.repeat(hotelMasBarato.calificacion);
        let resultadoHTML = `<h3>Tu mejor opción: ${hotelMasBarato.nombre} (${estrellas})</h3>`;
        
        if (mostrarPrecioEntreSemana) {
            resultadoHTML += `<p>Precio entre semana: $${hotelMasBarato.entreSemana[tipoCliente]}</p>`;
        }
        if (mostrarPrecioFinDeSemana) {
            resultadoHTML += `<p>Precio fin de semana: $${hotelMasBarato.finDeSemana[tipoCliente]}</p>`;
        }
        
        resultadoDiv.innerHTML = resultadoHTML;
        const tarjetaSeleccionada = document.getElementById(hotelMasBarato.nombre);
        let textoPrecio = '';

        if (mostrarPrecioEntreSemana) {
            textoPrecio += `Precio entre semana: $${hotelMasBarato.entreSemana[tipoCliente]}\n`;
        }
        if (mostrarPrecioFinDeSemana) {
            textoPrecio += `Precio fin de semana: $${hotelMasBarato.finDeSemana[tipoCliente]}\n`;
        }

        tarjetaSeleccionada.querySelector('p:last-child').textContent = textoPrecio.trim();
        tarjetaSeleccionada.classList.add('show');
    } else {
        resultadoDiv.innerHTML = 'No hay hotel disponible para las fechas y tipo de cliente seleccionados.';
    }
}
