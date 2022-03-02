const dataSource = {}; // eslint-disable-line no-unused-vars

dataSource.products = {
  cake: {
    class: 'small',
    name: 'Zio Stefano\'s Doughnut',
    price: 9,
    description: 'Treat yourself with this soft, freshly baked cookie. The recipe has been handed down from generation to generation in our family and it has won us several first place prizes in local competitions.',
    images: [
      '<img class="active" src="images/doughnut.svg">',
    ],
  },
  breakfast: {
    class: 'small',
    name: 'Zia Giulia\'s Breakfast',
    price: 9,
    description: 'There\'s no better way to start your day than indulging yourself with a cup of fresh Italian coffee and crispy waffels. Made just for you on the spot, this breakfast combo has been our guests\' favorite for over 50 years.',
    images: [
      '<img class="active" src="images/breakfast.svg">',
    ],
    params: {
      coffee: {
        label: 'Coffee type',
        type: 'radios',
        options: {
          latte: {label: 'Latte', price: 1, default: true},
          cappuccino: {label: 'Cappuccino', price: 1},
          espresso: {label: 'Espresso', price: 1},
          macchiato : {label: 'Macchiato ', price: 1},
        },
      },
    },
  },
  pizza: {
    name: 'Nonna Alba\'s Pizza',
    price: 20,
    description: 'The true taste of Italy &ndash; homemade pizza as prepared by our grandmothers in old-fashoned brick ovens. Choose your favorite topping and enjoy your comfort food! All ingredients come straight from eco-friendly, trusted farms in the Italian countryside.',
    images: [
      '<img class="active" src="images/pizza/crust.svg">',
      '<img class="active sauce-tomato" src="images/pizza/tomato-sauce.svg">',
      '<img class="active sauce-cream" src="images/pizza/sour-cream.svg">',
      '<img class="active toppings-salami" src="images/pizza/salami.svg">',
      '<img class="active toppings-olives" src="images/pizza/olives.svg">',
      '<img class="active toppings-redPeppers" src="images/pizza/red-peppers.svg">',
      '<img class="active toppings-greenPeppers" src="images/pizza/green-peppers.svg">',
      '<img class="active toppings-mushrooms" src="images/pizza/mushrooms.svg">',
      '<img class="active toppings-basil" src="images/pizza/basil.svg">',
    ],
    params: {
      sauce: {
        label: 'Sauce',
        type: 'radios',
        options: {
          tomato: {label: 'Tomato', price: 0, default: true},
          cream: {label: 'Sour cream', price: 2},
        },
      },
      toppings: {
        label: 'Toppings',
        type: 'checkboxes',
        options: {
          olives: {label: 'Olives', price: 2, default: true},
          redPeppers: {label: 'Red peppers', price: 2, default: true},
          greenPeppers: {label: 'Green peppers', price: 2, default: true},
          mushrooms: {label: 'Mushrooms', price: 2, default: true},
          basil: {label: 'Fresh basil', price: 2, default: true},
          salami: {label: 'Salami', price: 3},
        },
      },
      crust: {
        label: 'pizza crust',
        type: 'select',
        options: {
          standard: {label: 'standard', price: 0, default: true},
          thin: {label: 'thin', price: 2},
          thick: {label: 'thick', price: 2},
          cheese: {label: 'cheese in edges', price: 5},
          wholewheat: {label: 'wholewheat', price: 3},
          gluten: {label: 'with extra gluten', price: 0},
        },
      },
    },
  },
  salad: {
    name: 'Nonno Alberto\'s Salad',
    price: 9,
    description: 'A delicious salad made of fresh, home-grown products on a crispy lettuce base.',
    images: [
      '<img class="active" src="images/salad/plate.svg">',
      '<img class="active ingredients-cucumber" src="images/salad/cucumber.svg" style="z-index: 1;">',
      '<img class="active ingredients-tomatoes" src="images/salad/tomatoes.svg" style="z-index: 2;">',
      '<img class="active ingredients-olives" src="images/salad/salad-olives.svg" style="z-index: 3;">',
      '<img class="active ingredients-feta" src="images/salad/feta.svg" style="z-index: 4;">',
      '<img class="active ingredients-herbs" src="images/salad/herbs.svg" style="z-index: 5;">',
      '<img class="active ingredients-cheese" src="images/salad/cheese.svg" style="z-index: 6;">',
      '<img class="active ingredients-pepper" src="images/salad/black-pepper.svg" style="z-index: 7;">',
    ],
    params: {
      ingredients: {
        label: 'Ingredients',
        type: 'checkboxes',
        options: {
          cucumber: {label: 'Cucumber', price: 1, default: true},
          tomatoes: {label: 'Tomatoes', price: 1, default: true},
          olives: {label: 'Olives', price: 1, default: true},
          feta: {label: 'Feta cheese', price: 1},
          cheese: {label: 'Cheese', price: 1},
          herbs: {label: 'Fresh herbs', price: 1, default: true},
          pepper: {label: 'Black pepper', price: 1},
        },
      },
    },
  },

};
