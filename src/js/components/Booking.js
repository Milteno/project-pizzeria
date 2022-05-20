import {select, settings, templates} from '../settings.js';
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
    console.log('Params',params);
    const urls = {
      bookings: settings.db.url+'/'+ settings.db.bookings+'?'+params.booking.join('&'),
      eventsCurrent: settings.db.url+'/'+ settings.db.events+'?'+params.eventsCurrent.join('&'),
      eventsRepeat: settings.db.url+'/'+ settings.db.events+'?'+params.eventsRepeat.join('&'),
    };
    Promise.all([
      fetch(urls.bookings),
    ]).then(function(allResponses){
      const bookingsResponse = allResponses[0];
      return Promise.all([
        bookingsResponse.json(),
      ]);
    }).then(function([bookings]){
      console.log('bookings', bookings);
    });
    console.log('Urls',urls);
    /*fetch(urls.bookings)
      .then(function(bookingsResponse){
        return bookingsResponse.json();
      })
      .then(function(bookings){
        console.log(bookings);
      }); */
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
  }
}



export default Booking;