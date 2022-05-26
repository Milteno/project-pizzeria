import {select, settings, templates, classNames} from '../settings.js';
import AmountWidget from './AmountWidget.js';
import HourPicker from './HourPicker.js';
import DatePicker from './DatePicker.js';
import utils from '../utils.js';

class Booking {
  constructor(element) {
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.tableSelected;
  }
  getData() {
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const EndDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      booking: [
        startDateParam,
        EndDateParam,
      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        EndDateParam,
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        EndDateParam,
      ],
    };
    const urls = {
      bookings: settings.db.url+'/'+ settings.db.bookings+'?'+params.booking.join('&'),
      eventsCurrent: settings.db.url+'/'+ settings.db.events+'?'+params.eventsCurrent.join('&'),
      eventsRepeat: settings.db.url+'/'+ settings.db.events+'?'+params.eventsRepeat.join('&'),
    };
    Promise.all([
      fetch(urls.bookings),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ]).then(function(allResponses){
      const bookingsResponse = allResponses[0];
      const eventsCurrentResponse = allResponses[1];
      const eventsRepeatResponse = allResponses[2];
      return Promise.all([
        bookingsResponse.json(),
        eventsCurrentResponse.json(),
        eventsRepeatResponse.json(),
      ]);
    }).then(function([bookings, eventsCurrent, eventsRepeat]){
      thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
    });
  }
  parseData(bookings, eventsCurrent, eventsRepeat){
    const thisBooking = this;

    thisBooking.booked = {};
    for(let item of bookings){
      thisBooking.makeBooked(item.date,item.hour,item.duration,item.table);
    }
    for(let item of eventsCurrent){
      thisBooking.makeBooked(item.date,item.hour,item.duration,item.table);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for(let item of eventsRepeat){
      if(item.repeat == 'daily'){
        for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)){
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.date,item.hour,item.duration,item.table);
        }
      }
    }
    thisBooking.updateDOM();
  }
  makeBooked(date, hour, duration, table){
    const thisBooking = this;

    if(typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date]={};
    }

    const startHour = utils.hourToNumber(hour);
    for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock +=0.5){

      if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
        thisBooking.booked[date][hourBlock]=[];
      }

      thisBooking.booked[date][hourBlock].push(table);
    }
  }
  updateDOM() {
    const thisBooking = this;
    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);
    let allAvailable = false;

    if (typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ) {
      allAvailable = true;
    }
    for (let table of thisBooking.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if (!isNaN(tableId)) {
        tableId = parseInt(tableId);
      }
      if (!allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ) {
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
  }

  render(element) {
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);

    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);

    thisBooking.dom.datePicker = document.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = document.querySelector(select.widgets.hourPicker.wrapper);

    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);

    thisBooking.dom.floorPlan = document.querySelector(select.booking.floorPlan);

    thisBooking.dom.form = document.querySelector(select.booking.form);

    thisBooking.dom.orderConfirmation = document.querySelector(select.booking.orderConfirmation);
    thisBooking.dom.phone = thisBooking.dom.orderConfirmation.querySelector(select.booking.phone);
    thisBooking.dom.address = thisBooking.dom.orderConfirmation.querySelector(select.booking.address);
    thisBooking.dom.starters = document.querySelectorAll(select.booking.checkbox);
  }
  initTables(event){
    const thisBooking = this;
    const table = event.target.getAttribute('data-table');
    if(table != null) {
      if(event.target.classList.contains('booked')) {
        alert('Stolik zajęty');
      }
      else if(event.target.classList.contains('selected')) {
        event.target.classList.remove('selected');
      }
      else {
        thisBooking.resetTable();
        event.target.classList.add('selected');
        thisBooking.tableSelected = table;
      }
    }
  }
  resetTable() {
    const thisBooking = this;
    for(let table of thisBooking.dom.tables) {
      if(table.classList.contains('selected')){
        table.classList.remove('selected');
      }
    }
  }
  sendBooking() {
    const thisBooking = this;
    const url = settings.db.url + '/' + settings.db.bookings;
    console.log(thisBooking.datePicker.value);
    console.log(thisBooking.hourPicker.value);
    console.log(thisBooking.tableSelected);
    console.log(thisBooking.peopleAmountWidget.value);
    console.log(thisBooking.hoursAmountWidget.value);
    console.log(thisBooking.dom.phone.value);
    console.log(thisBooking.dom.address.value);

    thisBooking.payload = {
      date: thisBooking.datePicker.value,
      hour: thisBooking.hourPicker.value,
      table: thisBooking.tableSelected,
      duration: parseInt(thisBooking.hoursAmountWidget.value),
      ppl: parseInt(thisBooking.peopleAmountWidget.value),
      starters: [],
      phone: thisBooking.dom.phone.value,
      address: thisBooking.dom.address.value,

    };

    for (let starter of thisBooking.dom.starters) {
      if (starter.checked == true) {
        thisBooking.payload.starters.push(starter.value);
      }
    }
    console.log(thisBooking.payload);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(thisBooking.payload),
    };
    fetch(url, options)
      .then(function (response) {
        return response.json();
      }).then(function (parsedResponse) {
        thisBooking.makeBooked(thisBooking.payload.date, thisBooking.payload.hour, thisBooking.payload.duration, thisBooking.payload.table);
        console.log('parsedResponse', parsedResponse);
      });
  }
  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmountWidget = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmountWidget = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);


    thisBooking.dom.peopleAmount.addEventListener('updated', function(event){
      event.preventDefault();
    });

    thisBooking.dom.hoursAmount.addEventListener('updated', function(event){
      event.preventDefault();
    });
    thisBooking.dom.wrapper.addEventListener('updated', function(){
      thisBooking.updateDOM();
    });
    thisBooking.dom.floorPlan.addEventListener('click', function(event){
      thisBooking.initTables(event);
    });
    thisBooking.dom.datePicker.addEventListener('updated', function(event){
      event.preventDefault();
      thisBooking.resetTable();
    });
    thisBooking.dom.hourPicker.addEventListener('updated', function(event){
      event.preventDefault();
      thisBooking.resetTable();
    });
    thisBooking.dom.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisBooking.sendBooking();
    });

  }
}



export default Booking;