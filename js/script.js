const API_URL = 'https://tortoiseshell-funky-jumper.glitch.me';

const swiperThumb = new Swiper('.gift__swiper_thumb', {
  spaceBetween: 16,
  slidesPerView: 'auto',
  freeMode: true,
  breakpoints: {
    320: {
      spaceBetween: 8,
    },
    1141: {
      spaceBetween: 12,
    },
    1439: {
      spaceBetween: 16,
    }
  }
});

const swiperMain = new Swiper('.gift__swiper_card', {
  spaceBetween: 16,
  thumbs: {
    swiper: swiperThumb,
  }
});

const form = document.querySelector('.form');
const phoneInputs = form.querySelectorAll('.form__field_phone');
const submitBtn  = form.querySelector('.form__btn');
const cardInput  = form.querySelector('.form__card');

const updateCardInput = () => {
  const activeSlide = document.querySelector('.gift__swiper_card .swiper-slide-active');
  const cardData = activeSlide.querySelector('.gift__card-img').dataset.card;
  cardInput.value = cardData;
};

updateCardInput();

swiperMain.on('slideChangeTransitionEnd', updateCardInput);

phoneInputs.forEach(input => {
  IMask(input, {
    mask: '+{7}(000)000-00-00'
  });
});

// проверка формы на заполненность всех полей
// и если хотя бы одно поле не заполнено, то кнопка отправки блокируется
const updateSubmitBtn = () => {
  let isFormFilled = true;

  for (const field of form.elements) {
    if (field.classList.contains('form__field')) {
      if (!field.value.trim()) {
        isFormFilled = false;
        break;
      }
    }
  }

  submitBtn.disabled = !isFormFilled;
};

form.addEventListener('input', updateSubmitBtn);

const phoneValidateOption = {
  format: {
    pattern: "\\+7\\(\\d{3}\\)\\d{3}-\\d{2}-\\d{2}",
    message: 'Номер телефона должен быть в формате: +7(XXX)XXX-XX-XX',
  }
}

form.addEventListener('submit', async e => {
  e.preventDefault();

  const errors = validate(form, {
    sender_phone: phoneValidateOption,
    reciever_phone: phoneValidateOption,
  });

  if (errors) {
    for (const key in errors) {
      const errorText = errors[key];
      alert(errorText);
    }
    return;
  }

  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  try {
    const response = await fetch(`${API_URL}/api/gift`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      prompt('Открытка успешно сохранена. Доступно по адресу: ',
        `${location.origin}/card.html?id=${result.id}`);
      form.reset();
    } else {
      alert(`Ошибка при отправке: ${result.message}`)
    }
  } catch (error) {
    console.error(`Произошла ошибка при отправке: ${error}`);
    alert(`Произошла ошибка при отправке? попробуйте снова`);
  }

});
