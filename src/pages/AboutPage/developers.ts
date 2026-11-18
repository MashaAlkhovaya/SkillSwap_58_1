export type Developer = {
  name: string
  role: string
  about: string
  avatar: string
  github: string
}

const placeholderRole = 'Пока выбираю себе суперспособность'
const placeholderAbout = 'Скоро здесь будет история обо мне. Нужно только придумать, с чего начать.'

export const developers: Developer[] = [
  {
    name: 'Иван',
    role: placeholderRole,
    about: placeholderAbout,
    avatar: 'https://github.com/Pafer1.png',
    github: 'https://github.com/Pafer1',
  },
  {
    name: 'Соня',
    role: 'PM, помощник тимлида',
    about:
      'Бакалавр по направлению «Реклама и связи с общественностью». В проекте занималась настройкой Redux-хранилища и RTK Query, созданием некоторых UI-компонентов и виджетов, написанием тестов и историй для Storybook. В рамках своей роли также нарезала задачи на доску, организовывала и проведила командные созвоны.',
    avatar: 'https://github.com/so-nechaeva.png',
    github: 'https://github.com/so-nechaeva',
  },
  {
    name: 'Татьяна',
    role: 'Frontend‑разработчик',
    about:
      'В проекте Skill Swap я отвечала за реализацию компонентов интерфейса и интеграцию с API,  разбиралась в документации React DayPicker и  училась встраивать сторонние решения в существующую кодовую базу. Я прокачала навыки работы с системой контроля версий - от оформления коммитов до разрешения конфликтов при слиянии веток и получила ценный опыт командной разработки.',
    avatar: 'https://github.com/karasuta.png',
    github: 'https://github.com/karasuta',
  },
  {
    name: 'Мария',
    role: 'Frontend-разработчица, хранительница состояния «Обмен предложен»',
    about:
      'Занимаюсь frontend-разработкой на React и TypeScript. Интересно видеть, как из кода рисуется страница. В SkillSwap сделала заявки на обмен: кнопку «Предложить обмен», модальное окно, состояние «Обмен предложен» в карточках каталога и сохранение заявок через Redux Toolkit и localStorage. Писала тесты и истории для Storybook.',
    avatar: 'https://github.com/MashaAlkhovaya.png',
    github: 'https://github.com/MashaAlkhovaya',
  },
  {
    name: 'Валерий',
    role: placeholderRole,
    about: placeholderAbout,
    avatar: 'https://github.com/getmuver3.png',
    github: 'https://github.com/getmuver3',
  },
  {
    name: 'Андрей',
    role: placeholderRole,
    about: placeholderAbout,
    avatar: 'https://github.com/LaniusCollurio-SPb.png',
    github: 'https://github.com/LaniusCollurio-SPb',
  },
  {
    name: 'Юрий',
    role: 'Frontend-разработчик, укротитель CSS',
    about:
      'Занимаюсь frontend-разработкой на React и TypeScript. Люблю превращать макеты в удобные и красивые интерфейсы, разбираться в новых технологиях и писать понятный код. В SkillSwap разрабатываю UI-компоненты, работаю с адаптивной вёрсткой, Storybook и тестами. Иногда могу потратить больше времени на отступ в 2 пикселя, чем на весь компонент.',
    avatar: 'https://github.com/Yury0310.png',
    github: 'https://github.com/Yury0310',
  },
  {
    name: 'Женя',
    role: placeholderRole,
    about:
      'Программирую на C#, Delphi. Изучаю новый для меня web-стек. В проекте работала над каталогом с бесконечной прокруткой, компонентом Select.',
    avatar: 'https://github.com/zen-ja.png',
    github: 'https://github.com/zen-ja',
  },
  {
    name: 'Дарья',
    role: placeholderRole,
    about: placeholderAbout,
    avatar: 'https://github.com/Darya-O.png',
    github: 'https://github.com/Darya-O',
  },
  {
    name: 'Егор',
    role: placeholderRole,
    about: placeholderAbout,
    avatar: 'https://github.com/EgorCheprasov8.png',
    github: 'https://github.com/EgorCheprasov8',
  },
  {
    name: 'Игорь',
    role: placeholderRole,
    about: placeholderAbout,
    avatar: 'https://github.com/igorasha26.png',
    github: 'https://github.com/igorasha26',
  },
]
