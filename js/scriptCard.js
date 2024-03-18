const API_URL = 'https://tortoiseshell-funky-jumper.glitch.me';
const card = document.querySelector('.card');
const cardTitile = document.querySelector('.card__title');
const cardContacts = document.querySelector('.card__contacts');
const cardImg = document.querySelector('.card__img');
const cardFrom = document.querySelector('.card__from');
const cardTo = document.querySelector('.card__to');
const cardMessage = document.querySelector('.card__message');

const rearrangeElement = () => {
  const screenWidth = window.innerWidth;

  if (screenWidth <= 580) {
    card.after(cardContacts);
  } else {
    cardTitile.after(cardContacts);
  }
}

const getIdFromUrl = () => {
  const params = new URLSearchParams(location.search);
  return params.get('id');
};

const getGiftData = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/gift/${id}`);

    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Открытка не найдена');
    }
  } catch (error) {
    console.error(error);
  }
}

const init = async () => {
  rearrangeElement();
  window.addEventListener('resize', rearrangeElement);

  const id = getIdFromUrl();

  if (id) {
    const data = await getGiftData(id);

    if (data) {
      cardImg.src = `img/${data.card}.jpg`;
      cardFrom.textContent = data.sender_name;
      cardTo.textContent = data.reciever_name;
      const formaterMessage = data.message.replaceAll('\n', '<br>');
      // через регулярку
      // const formaterMessage = data.message.replace(/\n/g, '<br>'); 
      cardMessage.innerHTML = formaterMessage;
    } else {
      cardImg.src  = 'img/noimage.jpg';
      cardFrom.textContent = ''
      cardTo.textContent = ''
      cardMessage.textContent = 'Открытка не была найдена, проверьте ссылку';
    }
  }
};

init();