// weekend.js
// shared function called by both text & slash commands to return a funny gif on the weekend

const weightedPick = require('../../src/util/weightedPick');
const makeAttachment = require('../../src/util/makeAttachmentArray');

// common path to images used
const imgFolderPath = './assets/weekend/';

// the following are the images that can be conjured. Bit of an anarchist with the structure :P
// the O.G.
const craigSnl = {
  weight: 6,
  filenames: ['theweekend.gif']
};

// friday options
const friday = {
  diddy: {weight: 2, filenames: ['friday-diddyfriday.gif']},
  krabs: {weight: 3, filenames: ['friday-sailer.mp4']},
  cage:  {weight: 5, filenames: ['friday-conair.gif']},
  cat:   {weight: 4, filenames: ['friday-catjam.mp4']},
  itysl: [ // friday night options
    {weight: 1, filenames: ['itysl-friday1.gif']},
    {weight: 1, filenames: ['itysl-friday.mp4']},
    {weight: 1, filenames: ['itysl-friday-aco.mp4']}
  ]
}

// saturday options
const saturday = {
  wickie: {weight: 5, filenames: ['saturday-wickie.mp4']},
  chilling: [
    {weight: 1, filenames: ['saturday-chill1.png']},
    {weight: 1, filenames: ['saturday-chill2.jpg']},
    {weight: 1, filenames: ['saturday-chill3.jpg']}
  ]
}

// horse plink :^O
const hplinko = {
  weight: .0069,
  filenames: [ 'hplinko0.gif', 'hplinko1.gif' ]
};

/* MEAT AND POTATOES BELOW */

// general payload creation (function of functions for utility, mostly)
async function makePayload(chanceArray) {
  const choice = weightedPick(chanceArray);
  const attachments = await makeAttachment(choice.filenames, imgFolderPath);
  return {files: attachments};
}

// the bulk of the work, check date & times to decide what to send
async function getPayload(date) {
  let replyPayload = {};
  const roll = Math.random();

  // always a chance for horse plinko
  if (Math.random() < hplinko.weight) {
    replyPayload.files = await makeAttachment(hplinko.filenames, imgFolderPath);
  }

  // friday options
  else if (date.getDay() === 5) {
    if (date.getHours() < 9) { // before 9am, diddy & krabs
      replyPayload = await makePayload([
        {weight: .4, filenames: friday.diddy.filenames},
        {weight: .6, filenames: friday.krabs.filenames}
      ]);
    }
    else if (date.getHours() < 12) { // between 9am-noon, cage is in the mix
      replyPayload = await makePayload([
        {weight: .2, filenames: friday.diddy.filenames},
        {weight: .3, filenames: friday.krabs.filenames},
        {weight: .5, filenames: friday.cage.filenames}
      ]);
    }
    else if (date.getHours() < 16) { // bewteen noon-4pm, craig & cat get in there
      replyPayload = await makePayload([
        {weight: .10, filenames: friday.diddy.filenames},
        {weight: .15, filenames: friday.krabs.filenames},
        {weight: .25, filenames: friday.cage.filenames},
        {weight: .20, filenames: friday.cat.filenames},
        {weight: .30, filenames: craigSnl.filenames}
      ]);
    }
    else { // after 4pm, it's just craig, cage, cat, and ITYSL hit "Friday Night"
      replyPayload = await makePayload([
        {weight: .20, filenames: friday.cage.filenames},
        {weight: .10, filenames: friday.cat.filenames},
        {weight: .55, filenames: craigSnl.filenames},
        {weight: .15, filenames: chooseFilenames(friday.itysl)}
      ]);
    }
  }
  // saturday options
  else if (date.getDay() === 6) {
    if (date.getHours() < 3) { // before 3am, it's still Friday Night
      replyPayload = await makePayload([
        {weight: .7, filenames: craigSnl.filenames},
        {weight: .2, filenames: chooseFilenames(friday.itysl)},
        {weight: .1, filenames: saturday.wickie.filenames}
      ]);
    }
    else { // otherwise, wickie & chilling on Saturday
      replyPayload = await makePayload([
        {weight: .3, filenames: craigSnl.filenames},
        {weight: .4, filenames: saturday.wickie.filenames},
        {weight: .3, filenames: chooseFilenames(saturday.chilling)}
      ]);
    }
  }
  // sunday options
  else if ( // Sunday & early Monday, it's mostly Craig. And yet....
    date.getDay() === 0 ||
    ( date.getDay() === 1 && date.getHours() < 5 )
  ) {
    replyPayload = await makePayload([
      {weight: .05, filenames: friday.cage.filenames},
      {weight: .90, filenames: craigSnl.filenames},
      {weight: .05, filenames: chooseFilenames(saturday.chilling)}
    ]);
  }

  // chance for the weekend to occur during the week
  else if (roll < .069) {
    replyPayload = await makeAttachment(craigSnl.filenames, imgFolderPath);
  }

  // chance for horse plinko during the week
  else if (roll > .96) {
    replyPayload = await makeAttachment(hplinko.filenames, imgFolderPath);
  }

  // otherwise, it's not the weekend :(
  else {
    replyPayload = {content: 'It is not the weekend :('};
  }

  return replyPayload;
}


module.exports = async (message) => {
  let replyPayload = {};

  // always weekend for moss
  if (message.author.id === '461229960464564224') {
    replyPayload = await makeAttachment(craigSnl.filenames, imgFolderPath);
  }

  // otherwise check weekend status & get payload
  else replyPayload = await getPayload(message.createdAt);

  // send payload
  await message.reply(replyPayload);
}
