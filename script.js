document.getElementById('findHotel').addEventListener('click', findCheapestHotel);

// Función  para encontrar el hotel más barato
function findCheapestHotel() {
    const customerType = document.getElementById('customerType').value; // Obtener el tipo de cliente
    const dates = document.getElementById('dates').value.split(',').map(date => date.trim()); // Obtener y limpiar las fechas

    const hotels = [
        // Datos de los hoteles
        {
            name: 'Lakewood',
            rating: 3,
            weekday: { Regular: 110, Rewards: 80 },
            weekend: { Regular: 90, Rewards: 80 }
        },
        {
            name: 'Bridgewood',
            rating: 4,
            weekday: { Regular: 160, Rewards: 110 },
            weekend: { Regular: 60, Rewards: 50 }
        },
        {
            name: 'Ridgewood',
            rating: 5,
            weekday: { Regular: 220, Rewards: 100 },
            weekend: { Regular: 150, Rewards: 40 }
        }
    ];

    let cheapestHotel = null;
    let minCost = Infinity;
    let showWeekdayPrice = false;
    let showWeekendPrice = false;

    // Iterar sobre cada hotel para calcular el costo total según las fechas
    hotels.forEach(hotel => {
        let totalCost = 0;
        let currentShowWeekdayPrice = false;
        let currentShowWeekendPrice = false;

        dates.forEach(date => {
            const dayOfWeek = new Date(date.slice(0, 11)).getDay();
            const isWeekend = (dayOfWeek === 6 || dayOfWeek === 0);
            totalCost += isWeekend ? hotel.weekend[customerType] : hotel.weekday[customerType];
            if (isWeekend) {
                currentShowWeekendPrice = true;
            } else {
                currentShowWeekdayPrice = true;
            }
        });

        // Comparar costos y calificaciones para determinar el hotel mas barato.
        if (totalCost < minCost || (totalCost === minCost && hotel.rating > (cheapestHotel ? cheapestHotel.rating : 0))) {
            minCost = totalCost;
            cheapestHotel = hotel;
            showWeekdayPrice = currentShowWeekdayPrice;
            showWeekendPrice = currentShowWeekendPrice;
        }
    });

    // Limpiar resultados anteriores
    document.querySelectorAll('.hotel-card').forEach(card => {
        card.classList.remove('show');
        card.querySelector('p:last-child').innerHTML = ''; // Limpia el contenido de texto anterior
        card.querySelector('h2').innerHTML = card.querySelector('h2').textContent.split(' (')[0]; // Limpia estrellas anteriores
    });

    // Mostramos el hotel más barato
    if (cheapestHotel) {
        const selectedCard = document.getElementById(cheapestHotel.name);
        let priceText = '';

        if (showWeekdayPrice) {
            priceText += `<div>Precio entre semana: $${cheapestHotel.weekday[customerType]}</div>`;
        }
        if (showWeekendPrice) {
            priceText += `<div>Precio fin de semana: $${cheapestHotel.weekend[customerType]}</div>`;
        }

        selectedCard.querySelector('p:last-child').innerHTML = priceText.trim();
        selectedCard.querySelector('h2').innerHTML += ` (${generateStars(cheapestHotel.rating)})`;
        selectedCard.classList.add('show');
    } else {
        alert('No hay hotel disponible para las fechas y tipo de cliente seleccionados.');
    }
}

// Función para generar estrellas de calificacion..
function generateStars(rating) {
    return '⭐'.repeat(rating);
}
