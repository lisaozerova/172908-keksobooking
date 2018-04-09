'use strict';

// constants

var MAP_CARD_AVATARS = [
  'img/avatars/user01.png',
  'img/avatars/user02.png',
  'img/avatars/user03.png',
  'img/avatars/user04.png',
  'img/avatars/user05.png',
  'img/avatars/user06.png',
  'img/avatars/user07.png',
  'img/avatars/user08.png'
];
var MAP_CARD_TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var MAP_CARD_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var MAP_CARD_CHECK_HOURS = ['12:00', '13:00', '14:00'];
var MAP_CARD_FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];
var MAP_CARD_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var PIN_SIZE = 40;
var MAP_CARD_LIMIT = 8;

// functions

var generateRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var createRandomUniqueArr = function (originalArr, size) {
  var copyArr = originalArr.slice();
  var counter = originalArr.length < size ? originalArr.length : size;
  var resultArr = [];
  var randomIndex;
  var randomElement;

  while (counter !== 0) {
    randomIndex = generateRandomInt(0, copyArr.length - 1);
    randomElement = copyArr[randomIndex];
    resultArr.push(randomElement);

    copyArr.splice(randomIndex, 1);
    counter--;
  }

  return resultArr;
};


var getRandomArrElement = function (arr) {
  return arr[generateRandomInt(0, arr.length - 1)];
};

var createMapCardData = function (id) {
  var x = generateRandomInt(300, 900);
  var y = generateRandomInt(150, 500);

  return {
    author: {
      avatar: shuffledAvatars[id]
    },
    offer: {
      title: shuffledTitles[id],
      address: x + ', ' + y,
      price: generateRandomInt(1000, 1000000),
      type: getRandomArrElement(MAP_CARD_TYPES),
      rooms: generateRandomInt(1, 5),
      guests: generateRandomInt(1, 6),
      checkin: getRandomArrElement(MAP_CARD_CHECK_HOURS),
      checkout: getRandomArrElement(MAP_CARD_CHECK_HOURS),
      features: createRandomUniqueArr(MAP_CARD_FEATURES, generateRandomInt(1, MAP_CARD_FEATURES.length)),
      description: '',
      photos: createRandomUniqueArr(MAP_CARD_PHOTOS, MAP_CARD_PHOTOS.length)
    },

    location: {
      x: x,
      y: y
    }
  };
};

var createMapCardsData = function () {
  var mapCardsData = [];
  for (var i = 0; i < MAP_CARD_LIMIT; i++) {
    mapCardsData.push(
        createMapCardData(i)
    );
  }

  return mapCardsData;
};

// @TODO: remove
var makeElement = function (tagName, className) {
  var element = document.createElement(tagName);

  if (className) {
    element.classList.add(className);
  }

  return element;
};


// Разметка меток на карте
var createPin = function (adsData) {
  var pinElement = makeElement('button', 'map__pin');
  pinElement.style.left = adsData.location.x + PIN_SIZE / 2 + 'px';
  pinElement.style.top = adsData.location.y + PIN_SIZE + 'px';

  var image = makeElement('img');
  image.src = adsData.author.avatar;
  image.alt = adsData.offer.title;
  image.style.width = PIN_SIZE + 'px';
  image.style.height = PIN_SIZE + 'px';
  pinElement.appendChild(image);

  return pinElement;
};

var tranformOfferType = function (offerType) {
  switch (offerType) {
    case 'palace':
      return 'Дворец';
    case 'flat':
      return 'Квартира';
    case 'house':
      return 'Дом';
    case 'bungalo':
      return 'Бунгало';
  }

  return offerType;
};

var renderMapCard = function (mapCard) {
  var mapCardElement = mapCardTemplate.cloneNode(true);
  var offer = mapCard.offer;

  mapCardElement.querySelector('.popup__title').textContent = offer.title;
  mapCardElement.querySelector('.popup__text--address').textContent = offer.address;
  mapCardElement.querySelector('.popup__text--price ').textContent = offer.price + '₽/ночь';
  mapCardElement.querySelector('.popup__type').textContent = tranformOfferType(offer.type);
  mapCardElement.querySelector('.popup__text--capacity').textContent = offer.rooms + ' комнат(ы) для ' + offer.guests + ' гостей(я) ';

  mapCardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + offer.checkin + ', выезд до ' + offer.checkout;
  mapCardElement.querySelector('.popup__features').textContent = offer.features.join(', ');
  mapCardElement.querySelector('.popup__description').textContent = offer.description;

  var img1 = mapCardElement.querySelector('.popup__photo').cloneNode();
  var img2 = mapCardElement.querySelector('.popup__photo').cloneNode();

  mapCardElement.querySelector('.popup__photos').appendChild(img1);
  mapCardElement.querySelector('.popup__photos').appendChild(img2);
  var imgList = mapCardElement.querySelectorAll('.popup__photo');

  for (var i = 0; i < imgList.length; i++) {
    imgList[i].src = offer.photos[i];
  }

  mapCardElement.querySelector('.popup__avatar').src = mapCard.author.avatar;

  return mapCardElement;
};

// main code

var shuffledTitles = createRandomUniqueArr(MAP_CARD_TITLES, MAP_CARD_TITLES.length);
var shuffledAvatars = createRandomUniqueArr(MAP_CARD_AVATARS, MAP_CARD_AVATARS.length);

var i;
var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
var fragment = document.createDocumentFragment();

var mapCardsData = createMapCardsData();

map.classList.remove('map--faded');

for (i = 0; i < mapCardsData.length; i++) {
  fragment.appendChild(
      createPin(mapCardsData[i])
  );
}

mapPins.appendChild(fragment);

fragment = document.createDocumentFragment();

for (i = 0; i < mapCardsData.length; i++) {
  fragment.appendChild(renderMapCard(mapCardsData[i]));
}

map.insertBefore(fragment, mapPins);