const express = require('express');
const router = express.Router();
const axios = require('axios');

// Home page
router.get('/', function(req, res, next) {
  const titleStr = 'NODE.JS INTERNSHIP ASSIGNMENT (BRINGG)';
  const tasksArr = ['Build a server that is proxying SWAPI.', 'The new server should extend SWAPI custom encodings with a new one - Ewok.'];
  const linksArr = ['http://localhost:3033/people/1', 'http://localhost:3033/people/1?encoding=ewok',
                    'http://localhost:3033/planets/1', 'http://localhost:3033/planets/1?encoding=ewok'];

  res.render('index', { title: titleStr, tasks: tasksArr, links: linksArr });
});

// Universal route
router.get('/:element/:id', async function(req, res) {
  try {
    const element = await axios.get(`https://swapi.dev/api/${req.params.element}/${req.params.id}`);

    // Check the need for translation
    if(req.query.encoding === 'ewok') {
      const vowels = 'eyuoaEYUIOA';
      const consonants = 'qwrtpsdfghjklzxcvnmQWRTPSDFGHJKLZXCVBNM';
      const keys = Object.keys(element.data);
      const values = Object.values(element.data);
      
      // Translation function
      const translation = (str) => {
          let ecrypStr = '';
  
          for(i = 0; i < str.length; i++) {
            let findChar = false;
  
            for(j = 0; j < vowels.length; j++) {
                if(str[i] === vowels[j]) {
                  ecrypStr += 'i';
                  findChar = true;
                  break;
                }
            }
  
            if(!findChar) {
              for(j = 0; j < consonants.length; j++) {
                  if(str[i] === consonants[j]) {
                    ecrypStr += 'b';
                    findChar = true;
                    break;
                  }
              }
            }
  
            if(!findChar) ecrypStr += str[i];
          }
  
          return ecrypStr;
      }
      // We get the pretended (translated) data
      let transValues = values.map(el => {
        if(typeof(el) === 'object') {
          return el.map(item => {
            return translation(item);
          });
        } else {
          return translation(el);
        }
      });

      // We collect a new object with the translated data
      element.data = keys.reduce((obj, key, i) => {
        obj[key] = (obj[key]) ? `${obj[key]}, ${transValues[i]}` : transValues[i];
        return obj;
      }, {})
    }

      res.status(element.status).json(element.data);
  } catch(err) {
      res.send(`error: ${err.response.status}`);
  }
});

module.exports = router;
