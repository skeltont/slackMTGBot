// parse the text input and try to return the content between the square
// brackets.
function handleText(text) {
  var re = /\[(.*?)\]/;
  return re.exec(text)[1];
}

function handleResponse(card) {
  var message = '';
  message = "mana cost: " + card['manaCost'] + "\n";
  message = message + "type: " + card['type'] + "\n";
  message = message + "text: " + card['text'] + "\n";

  switch (card['types'][0]) {
    case 'Sorcery':
      break;

    case 'Instant':
      break;

    case 'Creature':
      message = message + "power: " + card['power'] + "\n";
      message = message + "toughness: " + card['toughness'] + "\n";
      break;

    case 'Planeswalker':
      message = message + "loyalty: " + card['loyalty'] + "\n";
      break;

    case 'Enchantment':
      break;

    case 'Land':
      break;

    default:
      break;
  }

  return message;
}

function handleImage(name, sets) {
  ids = [];
  for (var s in sets) {
    for (var c in sets[s]['cards']) {
      if (sets[s]['cards'][c]['name'] == name) {
        // return s + ' ' + sets[s]['cards'][c]['mciNumber'];
        // console.log(to_lower(s) + ' ' + sets[s]['cards'][c]['mciNumber']);
        if (sets[s]['cards'][c]['multiverseid']) {
          ids.push(sets[s]['cards'][c]['multiverseid']);
        }
      }
    }
  }
  return ids;
}

// what gets required by the app.
module.exports = function (req, res, next) {
  var sets = require('./AllSets.json');
  var cards = require('./AllCards.json');
  var request = require('request');

  var userName = req.body.user_name,
      text = req.body.text,
      card = '',
      message = '',
      ids = [];

  card = handleText(text);

  if (!cards[card]) {
    message = "could not find card, usage: `mtgbot [card-name-case-sensitive]`";
  } else {
    message = handleResponse(cards[card]);
    ids = handleImage(card, sets);
    message = message + "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=" + ids[Math.floor(Math.random() * ids.length)] + "&type=card"
  }

  // Sanity check. We don't want our slackbot to make this shit infinite.
  if (userName !== 'slackbot') {
    return res.status(200).json({
      text: message
    });
  } else {
    return res.status(200).end();
  }
}
