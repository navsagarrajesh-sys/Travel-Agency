// ===================== FLATPICKR INITIALIZATION =====================
document.addEventListener('DOMContentLoaded', () => {
  // Pick Date input initialization
  flatpickr(".datetimepicker", {
    dateFormat: "Y-m-d",
    minDate: "today"
  });

  // Pick Time input initialization
  flatpickr(".timepicker", {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    time_24hr: true
  });
});

// ===================== SLIDING PAGES LOGIC =====================
const pages = document.querySelectorAll(".page");
const nextButtons = document.querySelectorAll(".next-btn");
nextButtons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    if (index < pages.length - 1) {
      pages[index].classList.remove("active");
      pages[index].classList.add("slide-up");
      pages[index + 1].classList.add("active");
      pages[index + 1].style.zIndex = 1000;
    } else {
      pages[index].classList.remove("active");
      pages[index].classList.add("slide-up");
      pages.forEach(p => p.classList.remove("slide-up"));
      pages[0].classList.add("active");
    }
  });
});

// ===================== STATIC DATA =====================
const recentSearches = [
  "Bangalore, Karnataka",
  "Mumbai, Maharashtra",
  "Pune, Maharashtra"
];
const popularCities = [
  "Bangalore, Karnataka",
  "New Delhi, Delhi",
  "Mumbai, Maharashtra",
  "Chennai, Tamil Nadu",
  "Pune, Maharashtra"
];
const cars = [
  { id: 'hyundai', name: 'Hyundai Santro', capacity: 4, price: 500 },
  { id: 'tata_tigor', name: 'Tata Tigor', capacity: 4, price: 650 },
  { id: 'swift', name: 'Maruti Swift Dzire', capacity: 4, price: 750 },
  { id: 'ertiga', name: 'Maruti Ertiga', capacity: 6, price: 1100 },
  { id: 'innova', name: 'Toyota Innova Crysta', capacity: 7, price: 1500 },
  { id: 'tempo', name: 'Tempo Traveller 13 Seater', capacity: 13, price: 3000 },
  { id: 'bus', name: 'Luxury Bus 45+ Seater', capacity: 45, price: 8000 }
];

const fromInput = document.getElementById('fromLocation');
const fromDropdown = document.getElementById('fromDropdown');
const toInput = document.getElementById('toLocation');
const toDropdown = document.getElementById('toDropdown');
const tripTabs = document.querySelectorAll('.tab');
const returnDateGroup = document.getElementById('returnDateGroup');
const carSelection = document.getElementById('carSelection');
const carList = document.getElementById('carList');
const selectedCarInfo = document.getElementById('selectedCarInfo');
const swapBtn = document.querySelector('.swap-btn');
const bookingForm = document.getElementById('bookingForm');

// ===================== LOCATION DROPDOWNS (STATIC) =====================
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
}

function debounce(fn, wait = 180) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  };
}

function renderDropdown(title, items, dropdown, inputId) {
  if (!items.length) return false;
  let html = `<div class="location-dropdown-title">${escapeHtml(title)}</div><ul class="location-dropdown-list">`;
  for (const city of items) {
    html += `<li data-city="${escapeHtml(city)}">${escapeHtml(city)}</li>`;
  }
  html += `</ul>`;
  dropdown.innerHTML = html;
  dropdown.classList.add('show');
  dropdown.setAttribute('aria-hidden', 'false');

  dropdown.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', () => selectLocation(li.dataset.city, inputId));
  });

  return true;
}

function showLocationDropdown(value, dropdown, inputId) {
  const query = (value || '').toLowerCase().trim();
  dropdown.innerHTML = '';
  dropdown.classList.remove('show');
  dropdown.setAttribute('aria-hidden', 'true');
  if (!query) return;

  function filterList(list) {
    return list.filter(city => city.toLowerCase().includes(query));
  }

  let hasDropdown = false;
  const filteredRecent = filterList(recentSearches);
  if (filteredRecent.length) {
    hasDropdown = renderDropdown('RECENT SEARCHES', filteredRecent, dropdown, inputId) || hasDropdown;
  }
  const filteredPopular = filterList(popularCities);
  if (filteredPopular.length) {
    hasDropdown = renderDropdown('POPULAR CITIES', filteredPopular, dropdown, inputId) || hasDropdown;
  }

  if (!hasDropdown) {
    dropdown.innerHTML = '';
    dropdown.classList.remove('show');
    dropdown.setAttribute('aria-hidden', 'true');
  }
}

const debouncedFrom = debounce(value => showLocationDropdown(value, fromDropdown, 'fromLocation'), 120);
const debouncedTo = debounce(value => showLocationDropdown(value, toDropdown, 'toLocation'), 120);

if (fromInput) {
  fromInput.addEventListener('input', e => debouncedFrom(e.target.value));
  fromInput.addEventListener('focus', e => showLocationDropdown(e.target.value, fromDropdown, 'fromLocation'));
  fromInput.addEventListener('blur', () => setTimeout(() => {
    fromDropdown.classList.remove('show');
    fromDropdown.setAttribute('aria-hidden', 'true');
  }, 200));
}

if (toInput) {
  toInput.addEventListener('input', e => debouncedTo(e.target.value));
  toInput.addEventListener('focus', e => showLocationDropdown(e.target.value, toDropdown, 'toLocation'));
  toInput.addEventListener('blur', () => setTimeout(() => {
    toDropdown.classList.remove('show');
    toDropdown.setAttribute('aria-hidden', 'true');
  }, 200));
}

function selectLocation(city, inputId) {
  const el = document.getElementById(inputId);
  if (el) el.value = city;
  if (inputId === 'fromLocation') {
    fromDropdown.classList.remove('show');
    fromDropdown.setAttribute('aria-hidden', 'true');
  } else {
    toDropdown.classList.remove('show');
    toDropdown.setAttribute('aria-hidden', 'true');
  }
  resetCarSelection();
}
window.selectLocation = selectLocation;

// ===================== TRIP TABS =====================
tripTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tripTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    if (tab.dataset.trip === 'roundtrip') {
      returnDateGroup.style.display = 'block';
    } else {
      returnDateGroup.style.display = 'none';
      const ret = document.getElementById('returnDate');
      if (ret) ret.value = '';
    }
    resetCarSelection();
  });
});

function resetCarSelection() {
  if (carSelection) carSelection.style.display = 'none';
  if (selectedCarInfo) selectedCarInfo.textContent = '';
  if (carList) {
    carList.innerHTML = '<option value="">Select a car</option>';
    carList.value = '';
  }
}

// ===================== PREFILL FROM URL =====================
window.addEventListener('load', () => {
  const params = new URLSearchParams(window.location.search);
  const pickup = params.get('pickup');
  const drop = params.get('drop');
  if (pickup && fromInput) fromInput.value = pickup;
  if (drop && toInput) toInput.value = drop;
  resetCarSelection();
});

swapBtn?.addEventListener('click', () => {
  if (!fromInput || !toInput) return;
  [fromInput.value, toInput.value] = [toInput.value.trim(), fromInput.value.trim()];
  resetCarSelection();
});

// ===================== CAR LIST LOGIC =====================
if (bookingForm) {
  bookingForm.addEventListener('change', () => {
    const fromVal = fromInput?.value.trim() || '';
    const toVal = toInput?.value.trim() || '';
    const pickupDate = document.getElementById('pickupDate')?.value || '';
    const pickupTime = document.getElementById('pickupTime')?.value || '';

    if (fromVal && toVal && pickupDate && pickupTime) {
      carList.innerHTML = '<option value="">Select a car</option>';
      cars.forEach(car => {
        const option = document.createElement('option');
        option.value = car.id;
        option.textContent = `${car.name} - Rs. ${car.price}/day - Seats: ${car.capacity}`;
        carList.appendChild(option);
      });
      carSelection.style.display = 'block';
    } else {
      resetCarSelection();
    }
  });
}

carList?.addEventListener('change', () => {
  const selectedCar = cars.find(car => car.id === carList.value);
  if (selectedCar) {
    selectedCarInfo.textContent = `You selected: ${selectedCar.name} | Seats: ${selectedCar.capacity} | Price: Rs. ${selectedCar.price}/day`;
  } else {
    selectedCarInfo.textContent = '';
  }
});

bookingForm?.addEventListener('submit', e => {
  e.preventDefault();

  const fromVal = fromInput?.value.trim() || '';
  const toVal = toInput?.value.trim() || '';
  const pickupDate = document.getElementById('pickupDate')?.value || '';
  const pickupTime = document.getElementById('pickupTime')?.value || '';
  const selectedCar = cars.find(car => car.id === carList?.value);

  if (!fromVal || !toVal) {
    alert('Please enter both pickup and drop locations.');
    return;
  }
  if (!pickupDate || !pickupTime) {
    alert('Please select pickup date and time.');
    return;
  }
  if (!selectedCar) {
    alert('Please select a vehicle.');
    return;
  }

  alert(`Booking confirmed for ${selectedCar.name} from ${fromVal} to ${toVal} on ${pickupDate} at ${pickupTime}.`);
});

// ===================== GOOGLE PLACES AUTOCOMPLETE =====================
function initAutocomplete() {
  if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
    console.error("Google Maps Places API not loaded");
    return;
  }

  const fromAutocomplete = new google.maps.places.Autocomplete(fromInput, {
    types: ['geocode'],
    componentRestrictions: { country: "in" }
  });
  const toAutocomplete = new google.maps.places.Autocomplete(toInput, {
    types: ['geocode'],
    componentRestrictions: { country: "in" }
  });

  fromAutocomplete.addListener('place_changed', () => {
    const place = fromAutocomplete.getPlace();
    if (place.formatted_address) fromInput.value = place.formatted_address;
    resetCarSelection();
  });

  toAutocomplete.addListener('place_changed', () => {
    const place = toAutocomplete.getPlace();
    if (place.formatted_address) toInput.value = place.formatted_address;
    resetCarSelection();
  });
}

window.initAutocomplete = initAutocomplete;
