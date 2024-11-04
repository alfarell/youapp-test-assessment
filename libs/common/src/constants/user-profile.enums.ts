export const genderEnum: string[] = ['male', 'female', 'others'];

export type ZodiacSign = {
  zodiac: string;
  horoscope: string;
  start: string;
  end: string;
};
export const zodiacSigns: ZodiacSign[] = [
  {
    zodiac: 'Ram',
    horoscope: 'Aries',
    start: '03-21',
    end: '04-19',
  },
  {
    zodiac: 'Bull',
    horoscope: 'Taurus',
    start: '04-20',
    end: '05-20',
  },
  {
    zodiac: 'Twins',
    horoscope: 'Gemini',
    start: '05-21',
    end: '06-21',
  },
  {
    zodiac: 'Crab',
    horoscope: 'Cancer',
    start: '06-22',
    end: '07-22',
  },
  {
    zodiac: 'Lion',
    horoscope: 'Leo',
    start: '07-23',
    end: '08-22',
  },
  {
    zodiac: 'Virgin',
    horoscope: 'Virgo',
    start: '08-23',
    end: '09-22',
  },
  {
    zodiac: 'Balance',
    horoscope: 'Libra',
    start: '09-23',
    end: '10-23',
  },
  {
    zodiac: 'Scorpion',
    horoscope: 'Scorpius',
    start: '10-24',
    end: '11-21',
  },
  {
    zodiac: 'Archer',
    horoscope: 'Sagittarius',
    start: '11-22',
    end: '12-21',
  },
  {
    zodiac: 'Goat',
    horoscope: 'Capricornus',
    start: '12-22',
    end: '01-19',
  },
  {
    zodiac: 'Water Bearer',
    horoscope: 'Aquarius',
    start: '01-20',
    end: '02-18',
  },
  {
    zodiac: 'Fish',
    horoscope: 'Pisces',
    start: '02-19',
    end: '03-20',
  },
];
