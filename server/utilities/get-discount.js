const pWhilst = require('p-whilst');
const generate = require('nanoid/generate');

const ALPHABET = '123456789ABCDEFGHJKMNPQRSTUVWXZ';
const ALPHABET_N = 5;

const getDiscount = () => generate(ALPHABET, ALPHABET_N);

function getValidDiscount (User) {
  let validDiscount = null;

  const condition = () => validDiscount === null;

  const action = () => {
    const promoCode = getDiscount();
    return User
    .findOne({promoCode})
    .then(foundUser => {
      if (!foundUser) validDiscount = promoCode;
    });
  };

  return pWhilst(condition, action).then(() => validDiscount);
}

module.exports = getValidDiscount;
